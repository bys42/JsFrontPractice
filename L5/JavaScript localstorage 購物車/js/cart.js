
function Cart() {
    // localStorage key
    this.key = 'example-cart';
    // 購物車的資料
    this.data = [];
    // 初始化購物車
    this.initCart = function () {

    }
    // 傳入商品id與數量並新增商品至購物車
    this.addItem = function (pid, amount) {
        let product;
        // for (let i = 0; i < products.length; i++){
        //     if (products[i] === pid) {
        //         product = p;
        //         break;
        //     }
        // }
        products.forEach(function(p) {
            if (p.id === pid) {
                product = p;
            }
        });
        
        const item = {
            title: product.title,
            price: product.price,
            mount: amount,
        };
        
        this.data.push(item);
        
        this.render();
    }
    // 至購物車刪除於購物車內指定索引商品
    this.deleteItem = function (i) {

    }
    // 清空購物車
    this.emptyCart = function () {

    }
    // 更新資料到localStorage
    this.updateDataToStorage = function () {

    }
    // 渲染購物車
    this.render = function () {
        $('#cartTableBody').empty();
        this.data.forEach(function(item){
            console.log(item);
            $('#cartTableBody').append(`
                <tr>
                    <td>${item.title}</td>
                    <td class="text-right">${item.price}</td>
                    <td class="text-right">${item.mount}</td>
                    <td class="text-right">${item.price * item.mount}</td>
                </tr>
            `);
        })
    }
}