export default class Pagination {
constructor(options) {
    this.tableId = options.tableId || "data-table";
    this.itemsPerPage = options.itemsPerPage || 5;
    this.data = options.data || [];
    this.currentPage = options.currentPage || 1;
    this.paginationContainerId =
    options.paginationContainerId || "pagination";
    this.searchInputId = options.searchInputId || "";
    this.isShowTotalSize = options.isShowTotalSize || false;
    this.maxPagesToShow = 5;
    this.showPageSelect =
    options.showPageSelect !== undefined ? options.showPageSelect : false;
    this.showItemsPerPageSelect =
    options.showItemsPerPageSelect !== undefined
        ? options.showItemsPerPageSelect
        : false;
    this.rowRenderer = options.rowRenderer || this.defaultRowRenderer;
    this.exportButtonId = options.exportButtonId || "";
    this.serverCallback = options.serverCallback || null; // Server-side callback
    this.totalSize = options.totalSize || 0; // Total size for server-side pagination
    this.onRender = options.onRender || null;
    this.init();
}

init() {
    if (this.serverCallback) {
    this.serverCallback(
        this.itemsPerPage,
        this.currentPage - 1,
        (data, totalSize) => {
        // Adjusted currentPage to be zero-based
        this.data = data;
        this.totalSize = totalSize;
        this.renderTable();
        this.renderPaginationControls();
        this.addEventListeners();
        if (this.exportButtonId) this.setupExportButton();
        }
    );
    } else {
    this.renderTable();
    this.renderPaginationControls();
    this.addEventListeners();
    if (this.exportButtonId) this.setupExportButton();
    }
}

renderTable() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageData = this.serverCallback
    ? this.data
    : this.getFilteredData().slice(start, end);

    const tableBody = document
    .getElementById(this.tableId)
    .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    pageData.forEach((item, index) => {
    const rowHtml = this.rowRenderer(index + start, item);
    // const row = document.createElement("tr");
    // row.innerHTML = rowHtml;
    tableBody.insertAdjacentHTML('beforeend',rowHtml);
    });
    this.onRender && this.onRender();
}

renderPaginationControls() {
    const totalPages = this.serverCallback
    ? Math.ceil(this.totalSize / this.itemsPerPage)
    : Math.ceil(this.getFilteredData().length / this.itemsPerPage);
    const paginationContainer = document.getElementById(
    this.paginationContainerId
    );
    let pageNumbersHtml = "";

    const startPage = Math.max(
    1,
    this.currentPage - Math.floor(this.maxPagesToShow / 2)
    );
    const endPage = Math.min(totalPages, startPage + this.maxPagesToShow - 1);

    if (this.isShowTotalSize) {
    pageNumbersHtml += `<span id="pag-total-size">${this.totalSize} records</span>`;
    }

    pageNumbersHtml += `
        <button id="prev-btn" class="btn btn-outline-primary" ${
            this.currentPage === 1 ? "disabled" : ""
        }>Previous</button>
    `;

    if (startPage > 1) {
    pageNumbersHtml += `<button class="btn btn-outline-primary page-btn" data-page="1">1</button>`;
    if (startPage > 2) pageNumbersHtml += `<span>...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
    pageNumbersHtml += `<button class="btn btn-outline-primary page-btn" data-page="${i}" ${
        this.currentPage === i ? "disabled" : ""
    }>${i}</button>`;
    }

    if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbersHtml += `<span>...</span>`;
    pageNumbersHtml += `<button class="btn btn-outline-primary page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    pageNumbersHtml += `
        <button id="next-btn" class="btn btn-outline-primary" ${
            this.currentPage === totalPages ? "disabled" : ""
        }>Next</button>
    `;

    if (this.showPageSelect) {
    pageNumbersHtml += `
        <select id="page-select" class="form-select">
        ${Array.from(
            { length: totalPages },
            (_, i) => `
        <option value="${i + 1}" ${
            this.currentPage === i + 1 ? "selected" : ""
            }>Page ${i + 1}</option>
        `
        ).join("")}
        </select>
        `;
    }

    if (this.showItemsPerPageSelect) {
    pageNumbersHtml += `
        <select id="items-per-page" class="form-select">
        <option value="5" ${
            this.itemsPerPage === 5 ? "selected" : ""
        }>5</option>
        <option value="10" ${
            this.itemsPerPage === 10 ? "selected" : ""
        }>10</option>
        <option value="20" ${
            this.itemsPerPage === 20 ? "selected" : ""
        }>20</option>
        <option value="50" ${
            this.itemsPerPage === 50 ? "selected" : ""
        }>50</option>
        </select>
        `;
    }

    paginationContainer.innerHTML = pageNumbersHtml;
}

debounce(func, timeout = 500){
    let timer;
    return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

addEventListeners() {
    const prevButton = document.getElementById("prev-btn");
    const nextButton = document.getElementById("next-btn");
    const pageButtons = document.querySelectorAll(".page-btn");
    const pageSelect = document.getElementById("page-select");
    const itemsPerPageSelect = document.getElementById("items-per-page");
    const searchInput = document.getElementById(this.searchInputId);

    prevButton.onclick = () => {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
    }
    };

    nextButton.onclick = () => {
    const totalPages = this.serverCallback
        ? Math.ceil(this.totalSize / this.itemsPerPage)
        : Math.ceil(this.getFilteredData().length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updatePagination();
    }
    };

    pageButtons.forEach((button) => {
    button.onclick = (event) => {
        const page = parseInt(event.target.getAttribute("data-page"));
        if (page !== this.currentPage) {
        this.currentPage = page;
        this.updatePagination();
        }
    };
    });

    if (pageSelect) {
    pageSelect.onchange = (event) => {
        const page = parseInt(event.target.value);
        if (page !== this.currentPage) {
        this.currentPage = page;
        this.updatePagination();
        }
    };
    }

    if (itemsPerPageSelect) {
    itemsPerPageSelect.onchange = (event) => {
        this.itemsPerPage = parseInt(event.target.value);
        this.currentPage = 1;
        this.updatePagination();
    };
    }

    if (searchInput) {
    searchInput.oninput = this.debounce(() => {
        this.currentPage = 1;
        this.updatePagination();
    });
    }
}

updatePagination() {
    if (this.serverCallback) {
    this.serverCallback(
        this.itemsPerPage,
        this.currentPage - 1,
        (data, totalSize) => {
        // Adjusted currentPage to be zero-based
        this.data = data;
        this.totalSize = totalSize;
        this.renderTable();
        this.renderPaginationControls();
        this.addEventListeners();
        }
    );
    } else {
    this.renderTable();
    this.renderPaginationControls();
    this.addEventListeners();
    }
}

defaultRowRenderer(index, item) {
    return `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.address}</td>
    `;
}

getFilteredData() {
    const searchInput = document.getElementById(this.searchInputId);
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (!searchTerm) return this.data;
    return this.data.filter((item) => {
    return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm)
    );
    });
}

setupExportButton() {
    const exportButton = document.getElementById(this.exportButtonId);
    if (exportButton) {
    exportButton.addEventListener("click", () => {
        const filteredData = this.getFilteredData();
        const table = document.getElementById(this.tableId);
        const headers = Array.from(table.querySelectorAll("thead th")).map(
        (th) => th.innerText
        );
        const dataForExcel = filteredData.map((item, index) => {
        return [index + 1, ...Object.values(item)];
        });

        const ws = XLSX.utils.aoa_to_sheet([headers, ...dataForExcel]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, "data.xlsx");
    });
    }
}

showTotalSize() {
    document.getElementById(this.totalSizeId).innerText =
    "Show " + this.itemsPerPage + "/" + this.totalSize + "records";
}
}
