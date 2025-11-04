document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#productsTable tbody");
  // compute contextPath: prefer server-provided value (set in HTML), then meta tag, then fallback
  const contextFromWindow =
    typeof window.contextPath === "string" ? window.contextPath : null;
  const meta = document.querySelector('meta[name="context-path"]');
  const contextFromMeta = meta ? meta.getAttribute("content") : null;
  let contextPath = "";
  if (contextFromWindow) contextPath = contextFromWindow;
  else if (contextFromMeta) contextPath = contextFromMeta;
  else {
    // fallback: if webapp deployed under a first path segment that is not 'products' or 'resources'
    const first = window.location.pathname.split("/")[1];
    if (first && first !== "products" && first !== "resources")
      contextPath = "/" + first;
  }
  const baseUrl = window.location.origin + contextPath;

  // UI elements (may be absent in some pages; guard before use)
  const searchBtn = document.querySelector("#searchBtn");
  const searchInput = document.querySelector("#searchInput");
  const resetBtn = document.querySelector("#resetBtn");
  const addBtn = document.querySelector("#addBtn");
  const addName = document.querySelector("#addName");
  const addDesc = document.querySelector("#addDesc");

  loadProducts();

  async function loadProducts() {
    tableBody.innerHTML =
      '<tr><td colspan = "4">Loading products...</td></tr> ';

    try {
      const response = await fetch(`${baseUrl}/products/gets`, {
        method: "GET",
        credentials: "same-origin",
      });
      if (!response.ok) {
        tableBody.innerHTML = `<tr><td colspan = "4">Failed to load products (Error ${response.status}) </td></tr>`;
        return;
      }

      const products = await response.json();

      if (!products || products.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan = "4"> No products found.</td></tr>';
        return;
      }

      // render products into table
      renderProducts(products);
    } catch (error) {
      console.error("Error loading products: ", error);
      tableBody.innerHTML =
        '<tr><td colspan = "4">Network error while loading products.</td></tr>';
    }
  }

  // Helper to render product list into tableBody
  function renderProducts(products) {
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");

      row.innerHTML = `
<td>${product.id}</td>
<td>${product.productName}</td>
<td class = "description" title="${product.description}">
${product.description}
</td>
<td>
<button class ="select" data-id="${product.id}">Select</button>
<button class ="edit" data-id="${product.id}">Edit</button>
<button class ="delete" data-id="${product.id}">Delete</button>
</td>
`;

      tableBody.appendChild(row);
    });

    // attach handlers
    document
      .querySelectorAll(".edit")
      .forEach((btn) => btn.addEventListener("click", handleEdit));
    document
      .querySelectorAll(".delete")
      .forEach((btn) => btn.addEventListener("click", handleDelete));
  }

  async function handleEdit(e) {
    const id = e.target.dataset.id;
    const newName = prompt("Enter new product name: ");
    const newDesc = prompt("Enter new description: ");

    if (!newName || !newDesc) {
      alert("Both fields are required");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/products/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: newName,
          description: newDesc,
        }),
      });

      if (response.ok) {
        alert("product updated successfully!");
        loadProducts();
      } else {
        alert("Failed to update product. Status: " + response.status);
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Network error while updating product.");
    }
  }

  async function handleDelete(e) {
    const id = e.target.dataset.id;
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${baseUrl}/products/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully.");
        loadProducts();
      } else {
        alert("Failed to delete product. Status: " + response.status);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error while deleting product.");
    }
  }

  // SEARCH FEATURE
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim();
      if (!query) {
        alert("Please enter a product name to search.");
        return;
      }

      tableBody.innerHTML = '<tr><td colspan="4">Searching...</td></tr>';

      try {
        const response = await fetch(
          `${baseUrl}/products/search/${encodeURIComponent(query)}`,
          { credentials: "same-origin" }
        );

        if (response.status === 204) {
          tableBody.innerHTML =
            '<tr><td colspan="4">No products found.</td></tr>';
          return;
        }

        if (!response.ok) {
          tableBody.innerHTML = `<tr><td colspan="4">Search failed (Error ${response.status})</td></tr>`;
          return;
        }

        const results = await response.json();
        renderProducts(results);
      } catch (error) {
        console.error("Search error:", error);
        tableBody.innerHTML =
          '<tr><td colspan="4">Network error during search.</td></tr>';
      }
    });
  }

  if (resetBtn && searchInput) {
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      loadProducts();
    });
  }

  // --- ADD PRODUCT FEATURE ---
  if (addBtn && addName && addDesc) {
    addBtn.addEventListener("click", async () => {
      const name = addName.value.trim();
      const desc = addDesc.value.trim();

      if (!name || !desc) {
        alert("Both name and description are required.");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/products/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: name, description: desc }),
        });

        if (response.ok) {
          alert("Product added successfully!");
          addName.value = "";
          addDesc.value = "";
          loadProducts();
        } else {
          alert("Failed to add product. Status: " + response.status);
        }
      } catch (error) {
        console.error("Add error:", error);
        alert("Network error while adding product.");
      }
    });
  }

  const selectedProducts = [];
  // If a delivery-summary element exists in the HTML use it, otherwise create it
  let selectedListContainer = document.querySelector(".delivery-summary");
  if (!selectedListContainer) {
    selectedListContainer = document.createElement("div");
    selectedListContainer.className = "delivery-summary";
    selectedListContainer.innerHTML = `
      <h2>Selected Products</h2>
      <ul id="selectedProducts"></ul>
      <button id="generateDeliveryBtn">Generate Delivery Note</button>
    `;
    document.body.appendChild(selectedListContainer);
  }

  const selectedList = document.getElementById("selectedProducts");
  const generateBtn = document.getElementById("generateDeliveryBtn");

  // Add "Select" buttons to each product row dynamically
  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("select")) {
      const row = e.target.closest("tr");
      const id = row.children[0].textContent;
      const name = row.children[1].textContent;

      const qty = prompt(`Enter quantity for ${name}:`);
      if (!qty || isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
      }

      const numericId = parseInt(id);
      const existing = selectedProducts.find((p) => p.id === numericId);
      if (existing) {
        existing.quantity = parseInt(qty);
      } else {
        selectedProducts.push({ id: numericId, name, quantity: parseInt(qty) });
      }

      updateSelectedList();
    }
  });

  function updateSelectedList() {
    if (!selectedList) return;
    selectedList.innerHTML = "";
    selectedProducts.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `${p.name} — ${p.quantity}`;
      selectedList.appendChild(li);
    });
  }

  // Send selected products to /delivery/add
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      if (!selectedProducts.length) {
        alert("No products selected!");
        return;
      }

      for (const product of selectedProducts) {
        try {
          const response = await fetch(`${baseUrl}/delivery/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
              product: { id: product.id },
              quantity: product.quantity,
              serialNumber: "AUTO-" + Date.now(), // simple serial example
            }),
          });

          if (!response.ok)
            throw new Error(`Failed to add delivery for ${product.name}`);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      }

      alert("Delivery note generated!");
      window.location.href = `${baseUrl}/delivery/front`; // redirect to delivery page
    });
  }
});
