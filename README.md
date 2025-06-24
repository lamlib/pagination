# 📚 Pagination.js

**Pagination.js** là thư viện JavaScript nhẹ giúp phân trang bảng dữ liệu HTML, hỗ trợ cả dữ liệu client-side và server-side, tìm kiếm, xuất Excel và UI hiện đại.

---

## ✨ Tính năng chính

- **🔄 Phân trang động:** Hỗ trợ dữ liệu phía client & server
- **🔍 Tìm kiếm tức thời:** Tìm kiếm theo từ khóa với debounce
- **📤 Xuất Excel:** Xuất bảng thành file `.xlsx` chỉ với một nút bấm
- **🔢 Tùy chọn số dòng/trang:** Dropdown thay đổi số dòng/trang
- **📑 Chọn trang nhanh:** Dropdown chọn trang (nếu bật)
- **🧩 Tùy biến cao:** Tùy chỉnh render dòng bảng (`rowRenderer`)
- **🌐 Tích hợp đơn giản:** Không phụ thuộc framework

---

## 🚀 Cài đặt

### 1. Chèn thư viện

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script type="module" src="/path/to/pagination.js"></script>
```

---

## 💡 Sử dụng cơ bản

### 1. HTML cơ bản

```html
<input type="text" id="search-box" placeholder="Tìm kiếm..." />
<table id="data-table">
    <thead>
        <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Địa chỉ</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
<div id="pagination"></div>
<button id="export-btn">Xuất Excel</button>
```

### 2. Khởi tạo

```js
import Pagination from './pagination.js';

const pag = new Pagination({
    tableId: 'data-table',
    paginationContainerId: 'pagination',
    searchInputId: 'search-box',
    exportButtonId: 'export-btn',
    itemsPerPage: 5,
    showItemsPerPageSelect: true,
    showPageSelect: true,
    isShowTotalSize: true,
    data: [
        { name: 'Nguyễn Văn A', age: 28, address: 'Hà Nội' },
        { name: 'Trần Thị B', age: 24, address: 'Đà Nẵng' },
        // ...
    ]
});
```

---

## 🌐 Phân trang server-side (tùy chọn)

```js
const pag = new Pagination({
    serverCallback: (limit, offset, done) => {
        fetch(`/api/users?limit=${limit}&offset=${offset}`)
            .then(res => res.json())
            .then(({ data, total }) => {
                done(data, total); // Callback trả về data và tổng số bản ghi
            });
    },
    totalSize: 0, // sẽ được cập nhật tự động
    // ...
});
```

---

## 📤 Xuất Excel

- Cần có thư viện [SheetJS](https://sheetjs.com/).
- Dữ liệu xuất là dữ liệu đã được lọc và sắp xếp hiện tại.

---

## 🛠️ Tuỳ biến nâng cao

### Tùy chỉnh render dòng

```js
rowRenderer: (index, item) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.address}</td>
    </tr>
`
```

### Sự kiện sau khi render

```js
onRender: () => {
    console.log('Bảng đã được render lại');
}
```

---

## 🔧 API Configuration

| Option                  | Type      | Default         | Mô tả                                 |
|-------------------------|-----------|-----------------|---------------------------------------|
| `tableId`               | string    | "data-table"    | ID bảng HTML                          |
| `paginationContainerId` | string    | "pagination"    | ID container cho phân trang           |
| `searchInputId`         | string    | ""              | ID của input tìm kiếm                 |
| `exportButtonId`        | string    | ""              | ID nút xuất Excel                     |
| `itemsPerPage`          | number    | 5               | Số dòng mỗi trang                     |
| `currentPage`           | number    | 1               | Trang khởi tạo                        |
| `showItemsPerPageSelect`| boolean   | false           | Dropdown chọn dòng/trang              |
| `showPageSelect`        | boolean   | false           | Dropdown chọn trang                   |
| `isShowTotalSize`       | boolean   | false           | Hiển thị tổng bản ghi                 |
| `rowRenderer`           | function  | Mặc định        | Hàm render dòng                       |
| `data`                  | array     | []              | Dữ liệu đầu vào (client-side)         |
| `serverCallback`        | function  | null            | Callback lấy dữ liệu từ server        |
| `totalSize`             | number    | 0               | Tổng số bản ghi (server-side)         |
| `onRender`              | function  | null            | Gọi lại sau khi render xong           |

---

## 🎯 Các tình huống sử dụng

- ✅ Phân trang dữ liệu client nhỏ
- 🌐 Tải dữ liệu phân trang từ server (REST API)
- 📤 Tạo nút xuất Excel nhanh
- 🔍 Thêm ô tìm kiếm ngay trên bảng

---

## 🧪 Ví dụ đầy đủ

```js
new Pagination({
    tableId: 'data-table',
    paginationContainerId: 'pagination',
    searchInputId: 'search',
    exportButtonId: 'export-btn',
    showItemsPerPageSelect: true,
    showPageSelect: true,
    isShowTotalSize: true,
    itemsPerPage: 10,
    data: danhSachNguoiDung, // mảng object
    onRender: () => {
        console.log('Render xong!');
    }
});
```

---

## 🪪 License

MIT License © 2025