
function Cart() {
    // localStorage key
    this.key = 'example-cart';
    // 購物車的資料
    this.data = [];
    // 初始化購物車
    this.initCart = function () {
        let localData = localStorage.getItem(this.key);
        this.data = localData ? JSON.parse(localData) : [];
        this.render();
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
        products.forEach(function (p) {
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
        this.data.splice(i, 1);
        this.render();
    }
    // 清空購物車
    this.emptyCart = function () {
        this.data = [];
        this.render();
    }
    // 更新資料到localStorage
    this.updateDataToStorage = function () {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }
    // 渲染購物車
    this.render = function () {
        this.updateDataToStorage();

        $('#cartTableBody').empty();
        let sum = 0;
        this.data.forEach(function (item, index) {
            $('#cartTableBody').append(`
                <tr>
                    <td>
                        <button class="btn btn-danger btn-sm btn-delete-item" data-index="${index}">
                            &times;
                        </button>
                        ${item.title}
                    </td>
                    <td class="text-right">$ ${item.price}</td>
                    <td class="text-right">${item.mount}</td>
                    <td class="text-right">$ ${item.price * item.mount}</td>
                </tr>
            `);
            sum += item.price * item.mount;
        });

        $('#cartTableBody').append(`
            <tr>
                <td>總計</td>
                <td class="text-right" colspan="3">$ ${sum}</td>
            </tr>
        `);
    }
}