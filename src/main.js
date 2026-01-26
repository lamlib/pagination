const XLSExport = (function () {
    function convertArrayOfObjectsToXLS(data) {
        var xlsContent = 'data:application/vnd.ms-excel;charset=utf-8,%EF%BB%BF';
        var xlsData =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style></style></head><body>';
        // Header row
        xlsData += '<table>';
        xlsData += '<tr>';
        xlsData += '</tr>';
        xlsData += '<tr>';
        Object.entries(data[0]).forEach(function ([key, value]) {
            if (!key.startsWith('_')) {
                xlsData += '<td style="color: #fff; background-color: #6366f1">' + key + '</td>';
            }
        });
        xlsData += '</tr>';

        // Body rows
        data.forEach(function (item) {
            xlsData += '<tr>';
            Object.entries(item).forEach(function ([key, value]) {
                if (!key.startsWith('_')) {
                    xlsData += '<td>' + value + '</td>';
                }
            });
            xlsData += '</tr>';
        });
        xlsData += '</table>';

        xlsData += '</body></html>';

        xlsContent += encodeURIComponent(xlsData);
        return xlsContent;
    }

    function downloadXLS(data, filename) {
        var xlsContent = convertArrayOfObjectsToXLS(data);

        var downloadLink = document.createElement('a');
        downloadLink.href = xlsContent;
        downloadLink.download = filename + '.xls';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    return {
        downloadXLS: downloadXLS,
    };
})();

export default class Pagination {
    constructor(options) {
        this.cssClasses = {
            btnActive: 'btn btn-info',
            btnNormal: 'btn btn-outline-info',
            row: 'row',
            col: 'col',
            formSelect: 'form-select',
            totalSize: '',
            ellipsis: '',
            ...(options.cssClasses || {})
        };

        this.text = options.text || {
            prevBtn: 'Previous',
            nextBtn: 'Next',
            records: 'Records',
            page: 'Page',
        };
        
        this.tableId = options.tableId?.trim() || 'data-table';
        this.itemsPerPage = options.itemsPerPage || 5;
        this.formartXLS = options.formartXLS || (data => data);
        this.nameXLS = options.nameXLS || 'data';
        this.data = options.data || [];
        this.currentPage = options.currentPage || 1;
        this.paginationContainerId = options.paginationContainerId || 'pagination';
        this.searchInputId = options.searchInputId || '';
        this.isShowTotalSize = options.isShowTotalSize || false;
        this.maxPagesToShow = 5;
        this.showPageSelect = options.showPageSelect !== undefined ? options.showPageSelect : false;
        this.showItemsPerPageSelect = options.showItemsPerPageSelect !== undefined ? options.showItemsPerPageSelect : false;
        this.rowRenderer = options.rowRenderer || this.defaultRowRenderer;
        this.cardRenderer = options.cardRenderer || null;
        this.gridColumns = options.gridColumns || 3;
        this.exportButtonId = options.exportButtonId || '';
        this.serverCallback = options.serverCallback || null;
        this.totalSize = options.totalSize || 0;
        this.onRender = options.onRender || null;
        this.backupHTML = '';
        this.backupGridCallback = options.cardRenderer;
        this.noData = options.noData || '';
        this.init();
    }

    init() {
        if (this.backupHTML) {
            document.getElementById(this.tableId).innerHTML = this.backupHTML;
        }
        if (this.serverCallback) {
            this.serverCallback(this.itemsPerPage, this.currentPage - 1, (data, totalSize) => {
                this.data = data;
                this.totalSize = totalSize;
                this.renderContent();
                this.renderPaginationControls();
                this.addEventListeners();
                if (this.exportButtonId) this.setupExportButton();
            });
        } else {
            this.renderContent();
            this.renderPaginationControls();
            this.addEventListeners();
            if (this.exportButtonId) this.setupExportButton();
        }
    }

    renderContent() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.serverCallback ? this.data : this.getFilteredData().slice(start, end);

        const container = document.getElementById(this.tableId);
        this.backupHTML ||= container.innerHTML;

        if (this.cardRenderer) {
            container.innerHTML = '';
            container.classList.add(this.cssClasses.row);
            pageData.forEach((item, index) => {
                const cardHtml = this.cardRenderer(index + start, item);
                const card = document.createElement('div');
                card.className = `${this.cssClasses.col}-${Math.floor(12 / this.gridColumns)}`;
                card.innerHTML = cardHtml;
                container.appendChild(card);
            });
        } else {
            const tableBody = container.getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            pageData.forEach((item, index) => {
                const rowHtml = this.rowRenderer(index + start, item);
                tableBody.insertAdjacentHTML('beforeend', rowHtml);
            });
            if (pageData.length == 0) {
                tableBody.innerHTML = this.noData;
            }
        }
        this.onRender && this.onRender();
    }

    renderPaginationControls() {
        const totalPages = this.serverCallback
            ? Math.ceil(this.totalSize / this.itemsPerPage)
            : Math.ceil(this.getFilteredData().length / this.itemsPerPage);

        const paginationContainer = document.getElementById(this.paginationContainerId);
        let pageNumbersHtml = '';

        if (this.isShowTotalSize) {
            pageNumbersHtml += `<span class="${this.cssClasses.totalSize}">${this.totalSize} ${this.text.records || "records"}</span>`;
        }

        const startPage = Math.max(1, this.currentPage - Math.floor(this.maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + this.maxPagesToShow - 1);

        pageNumbersHtml += `<button id="${this.tableId}-prev-btn" class="${this.currentPage === 1 ? this.cssClasses.btnActive : this.cssClasses.btnNormal}">${this.text.prevBtn}</button>`;

        if (startPage > 1) {
            pageNumbersHtml += `<button class="${this.cssClasses.btnNormal} ${this.tableId + '-page-btn'}" data-page="1">1</button>`;
            if (startPage > 2) pageNumbersHtml += `<span class="${this.cssClasses.ellipsis}">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersHtml += `<button class="${this.currentPage === i ? this.cssClasses.btnActive : this.cssClasses.btnNormal} ${this.tableId + '-page-btn'}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbersHtml += `<span class="${this.cssClasses.ellipsis}">...</span>`;
            pageNumbersHtml += `<button class="${this.cssClasses.btnNormal} ${this.tableId + '-page-btn'}" data-page="${totalPages}">${totalPages}</button>`;
        }

        pageNumbersHtml += `<button id="${this.tableId}-next-btn" class="${this.currentPage === totalPages ? this.cssClasses.btnActive : this.cssClasses.btnNormal}">${this.text.nextBtn}</button>`;

        if (this.showPageSelect) {
            pageNumbersHtml += `<select id="${this.tableId}-page-select" class="${this.cssClasses.formSelect}">`;
            for (let i = 1; i <= totalPages; i++) {
                pageNumbersHtml += `<option value="${i}" ${this.currentPage === i ? 'selected' : ''}>${this.text.page || 'Page'} ${i}</option>`;
            }
            pageNumbersHtml += `</select>`;
        }

        if (this.showItemsPerPageSelect) {
            pageNumbersHtml += `
                <select id="${this.tableId}-items-per-page" class="${this.cssClasses.formSelect}">
                    <option value="5" ${this.itemsPerPage === 5 ? 'selected' : ''}>5</option>
                    <option value="10" ${this.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="20" ${this.itemsPerPage === 20 ? 'selected' : ''}>20</option>
                    <option value="50" ${this.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                </select>
            `;
        }

        paginationContainer.innerHTML = pageNumbersHtml;
    }

    addEventListeners() {
        const prevButton = document.getElementById(`${this.tableId}-prev-btn`);
        const nextButton = document.getElementById(`${this.tableId}-next-btn`);
        const pageButtons = document.getElementById(this.paginationContainerId).querySelectorAll(`.${this.tableId + '-page-btn'}`);
        const pageSelect = document.getElementById(`${this.tableId}-page-select`);
        const itemsPerPageSelect = document.getElementById(`${this.tableId}-items-per-page`);
        const searchInput = document.getElementById(this.searchInputId);

        prevButton?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePagination();
            }
        });

        nextButton?.addEventListener('click', () => {
            const totalPages = this.serverCallback
                ? Math.ceil(this.totalSize / this.itemsPerPage)
                : Math.ceil(this.getFilteredData().length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updatePagination();
            }
        });

        pageButtons.forEach((btn) =>
            btn.addEventListener('click', (event) => {
                const page = parseInt(event.target.getAttribute('data-page'));
                if (page !== this.currentPage) {
                    this.currentPage = page;
                    this.updatePagination();
                }
            })
        );

        pageSelect?.addEventListener('change', (e) => {
            const page = parseInt(e.target.value);
            if (page !== this.currentPage) {
                this.currentPage = page;
                this.updatePagination();
            }
        });

        itemsPerPageSelect?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.updatePagination();
        });

        if (searchInput) {
            searchInput.oninput = this.debounce(() => {
                this.currentPage = 1;
                this.updatePagination();
            });
        }
    }

    updatePagination() {
        if (this.serverCallback) {
            this.serverCallback(this.itemsPerPage, this.currentPage - 1, (data, totalSize) => {
                this.data = data;
                this.totalSize = totalSize;
                this.renderContent();
                this.renderPaginationControls();
                this.addEventListeners();
            });
        } else {
            this.renderContent();
            this.renderPaginationControls();
            this.addEventListeners();
        }
    }

    debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), timeout);
        };
    }

    getFilteredData() {
        const searchInput = document.getElementById(this.searchInputId);
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (!searchTerm) return this.data;
        return this.data.filter(item => Object.entries(item).some(([key, val]) => !key.startsWith('_') && val?.toString().toLowerCase().includes(searchTerm)));
    }

    defaultRowRenderer(index, item) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.address}</td>
            </tr>
        `;
    }

    setupExportButton() {
        const exportButton = document.getElementById(this.exportButtonId);
        if (!exportButton) return;

        exportButton.addEventListener('click', () => {
            const filteredData = this.getFilteredData();
            XLSExport.downloadXLS(filteredData.map(this.formartXLS), this.nameXLS);
        });
    }

    changeTypeDisplayToGrid() {
        this.cardRenderer = this.backupGridCallback;
        this.init();
    }

    changeTypeDisplayToTable() {
        const container = document.getElementById(this.tableId);
        container.classList.remove(this.cssClasses.row);
        this.cardRenderer = null;
        this.init();
    }
}