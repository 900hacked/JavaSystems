document.addEventListener('DOMContentLoaded',() => {
const tableBody = document.querySelector('#productsTable tbody');
const baseUrl = window.location.origin + contextPath;

loadProducts();

async function loadProducts(){
tableBody.innerHTML = '<tr><td colspan = "4">Loading products...</td></tr> ';



try{
const response = await fetch(`${baseUrl}/products/gets`,{
method: 'GET'
credentials: 'same-origin'
});
if(!response.ok){
tableBody.innerHTML = `<tr><td colspan = "4">Failed to load products (Error ${response.status}) </td></tr>`;
return;
}

const products = await response.json();

if(!products || products.length === 0){
tableBody.innerHTML = '<tr><td colspan = "4"> No products found.</td></tr>';
return;
}

tableBody.innerHTML = '';

products.forEach(product => {
const row = document.createElement('tr');

row.innerHTML = `
<td>${product.id}</td>
<td>${product.productName}</td>
<td class = "description" title="${product.description}">
${product.description}
</td>
<td>
<button class ="edit" data-id="${product.id}">Edit</button>
<button class ="delete" data-id="${product.id}">Delete</button>
</td>
`;

tableBody.appendChild(row);
});

document.querySelectorAll('.edit').forEach(btn =>
btn.addEventListener('click', handleEdit)
);
document.querySelectorAll('.delete').forEach(btn =>
btn.addEventListener('click', handleDelete)
);

} catch (error){
console.error('Error loading products: ', error);
tableBody.innerHTML = '<tr><td colspan = "4">Network error while loading products.</td></tr>';
}
}

async function handleEdit(e){
const id = e.target.dataset.id;
const newName = prompt('Enter new product name: ');
const newDesc = prompt('Enter new description: ');

if(!newName || !newDesc){
alert('Both fields are required');
return;
}

try{
const response = await fetch(`${baseUrl}/products/update/${id}`, {
method: 'PUT',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
productName: newName,
description: newDesc
})
});

if (response.ok){
alert('product updated successfully!');
loadProducts();
}else{
alert('Failed to update product. Status: ' + response.status);
}
}catch (error){
console.error('Edit error:', error);
alert('Network error while updating product.');
}
}

async function handleDelete(e){
const id = e.target.dataset.id;
const confirmDelete = confirm('Are you sure you want to delete this product?');

if(!confirmDelete) return;

try{
const response = await fetch(`${baseUrl}/products/delete/${id}`, {
method: 'DELETE'
});

if(response.ok){
alert('Product deleted successfully.');
loadProducts();
} else{
alert('Failed to delete product. Status: ' + response.status);
}
}catch(error){
console.error('Delete error:', error);
alert('Network error while deleting product.');
}
}
});