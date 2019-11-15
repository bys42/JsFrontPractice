const products = [
    {
        id: '1',
        title: '產品一',
        price: 10,
        img: 'https://picsum.photos/id/999/1200/600',
        isAvailable: true
    },
    {
        id: '2',
        title: '產品二',
        price: 60,
        img: 'https://picsum.photos/id/1070/1200/600',
        isAvailable: true
    },
    {
        id: '3',
        title: '產品三',
        price: 180,
        img: 'https://picsum.photos/id/1071/1200/600',
        isAvailable: true
    },
    {
        id: '4',
        title: '產品四',
        price: 220,
        img: 'https://picsum.photos/id/1072/1200/600',
        isAvailable: true
    },
    {
        id: '5',
        title: '產品五',
        price: 360,
        img: 'https://picsum.photos/id/1073/1200/600',
        isAvailable: true
    },
    {
        id: '6',
        title: '產品六',
        price: 360,
        img: 'https://picsum.photos/id/1074/1200/600',
        isAvailable: true
    },
    {
        id: '7',
        title: '產品七',
        price: 400,
        img: 'https://picsum.photos/id/1075/1200/600',
        isAvailable: true
    },
    {
        id: '8',
        title: '產品八',
        price: 450,
        img: 'https://picsum.photos/id/1076/1200/600',
        isAvailable: true
    },
    {
        id: '9',
        title: '產品九',
        price: 520,
        img: 'https://picsum.photos/id/1077/1200/600',
        isAvailable: true
    }
];

// 渲染商品
function renderProducts() {
    products.forEach(
        function (product) {
            //console.log(product);
            // traditional:
            // document.getElementById("productRow").innerHTML += 
            // `<div class="col-sm-6 col-md-4 col-lg-3">
            //     ${product.title}
            // </div>`

            // ref: cdnjs.com
            // jQuery(id), simplify: $(id)
            // jQuery('#productRow').append(
            //     `<div class="col-sm-6 col-md-4 col-lg-3">
            //         ${product.title}
            //     </div>`
            // );
            $('#productRow').append(
                `<div class="col-sm-6 col-md-4 col-lg-6">
                    <div class="card mt-2 mb-2">
                        <img src="${product.img}" class="card-img-top">
                        <form class="card-body" onsubmit="onFormSubmit(event)" data-product-id="${product.id}">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">NTD: ${product.price}</p>
                            <input class="form-control my-3" type="number" min="1" max="20" require id="amount${product.id}">
                            <button type="submit" class="btn btn-primary btn-block">加入購物車</button>
                        </form>
                    </div>
                </div>`
            );
        }
    )
}

renderProducts();