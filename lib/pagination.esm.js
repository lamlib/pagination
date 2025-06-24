
/*!
 * ============================================================
 *  Project:   pagination.js
 *  Version:   1.0.0
 *  Homepage:  https://github.com/lamlib/pagination
 *
 *  Description:
 *    Datasync giúp bạn xử lý bảng biểu trên client.
 *
 *  Author:    Nhat Han <lamlib2023@gmail.com>
 *  License:   MIT License
 *  Copyright: © 2025 Nhat Han
 *
 *  Created:   2025-06-24
 * ============================================================
 */
var h=class{constructor(t){this.tableId=t.tableId||"data-table",this.itemsPerPage=t.itemsPerPage||5,this.data=t.data||[],this.currentPage=t.currentPage||1,this.paginationContainerId=t.paginationContainerId||"pagination",this.searchInputId=t.searchInputId||"",this.isShowTotalSize=t.isShowTotalSize||!1,this.maxPagesToShow=5,this.showPageSelect=t.showPageSelect!==void 0?t.showPageSelect:!1,this.showItemsPerPageSelect=t.showItemsPerPageSelect!==void 0?t.showItemsPerPageSelect:!1,this.rowRenderer=t.rowRenderer||this.defaultRowRenderer,this.exportButtonId=t.exportButtonId||"",this.serverCallback=t.serverCallback||null,this.totalSize=t.totalSize||0,this.onRender=t.onRender||null,this.init()}init(){this.serverCallback?this.serverCallback(this.itemsPerPage,this.currentPage-1,(t,a)=>{this.data=t,this.totalSize=a,this.renderTable(),this.renderPaginationControls(),this.addEventListeners(),this.exportButtonId&&this.setupExportButton()}):(this.renderTable(),this.renderPaginationControls(),this.addEventListeners(),this.exportButtonId&&this.setupExportButton())}renderTable(){let t=(this.currentPage-1)*this.itemsPerPage,a=t+this.itemsPerPage,e=this.serverCallback?this.data:this.getFilteredData().slice(t,a),s=document.getElementById(this.tableId).getElementsByTagName("tbody")[0];s.innerHTML="",e.forEach((r,n)=>{let i=this.rowRenderer(n+t,r);s.insertAdjacentHTML("beforeend",i)}),this.onRender&&this.onRender()}renderPaginationControls(){let t=this.serverCallback?Math.ceil(this.totalSize/this.itemsPerPage):Math.ceil(this.getFilteredData().length/this.itemsPerPage),a=document.getElementById(this.paginationContainerId),e="",s=Math.max(1,this.currentPage-Math.floor(this.maxPagesToShow/2)),r=Math.min(t,s+this.maxPagesToShow-1);this.isShowTotalSize&&(e+=`<span id="pag-total-size">${this.totalSize} records</span>`),e+=`
        <button id="prev-btn" class="btn btn-outline-primary" ${this.currentPage===1?"disabled":""}>Previous</button>
    `,s>1&&(e+='<button class="btn btn-outline-primary page-btn" data-page="1">1</button>',s>2&&(e+="<span>...</span>"));for(let n=s;n<=r;n++)e+=`<button class="btn btn-outline-primary page-btn" data-page="${n}" ${this.currentPage===n?"disabled":""}>${n}</button>`;r<t&&(r<t-1&&(e+="<span>...</span>"),e+=`<button class="btn btn-outline-primary page-btn" data-page="${t}">${t}</button>`),e+=`
        <button id="next-btn" class="btn btn-outline-primary" ${this.currentPage===t?"disabled":""}>Next</button>
    `,this.showPageSelect&&(e+=`
        <select id="page-select" class="form-select">
        ${Array.from({length:t},(n,i)=>`
        <option value="${i+1}" ${this.currentPage===i+1?"selected":""}>Page ${i+1}</option>
        `).join("")}
        </select>
        `),this.showItemsPerPageSelect&&(e+=`
        <select id="items-per-page" class="form-select">
        <option value="5" ${this.itemsPerPage===5?"selected":""}>5</option>
        <option value="10" ${this.itemsPerPage===10?"selected":""}>10</option>
        <option value="20" ${this.itemsPerPage===20?"selected":""}>20</option>
        <option value="50" ${this.itemsPerPage===50?"selected":""}>50</option>
        </select>
        `),a.innerHTML=e}debounce(t,a=500){let e;return(...s)=>{clearTimeout(e),e=setTimeout(()=>{t.apply(this,s)},a)}}addEventListeners(){let t=document.getElementById("prev-btn"),a=document.getElementById("next-btn"),e=document.querySelectorAll(".page-btn"),s=document.getElementById("page-select"),r=document.getElementById("items-per-page"),n=document.getElementById(this.searchInputId);t.onclick=()=>{this.currentPage>1&&(this.currentPage--,this.updatePagination())},a.onclick=()=>{let i=this.serverCallback?Math.ceil(this.totalSize/this.itemsPerPage):Math.ceil(this.getFilteredData().length/this.itemsPerPage);this.currentPage<i&&(this.currentPage++,this.updatePagination())},e.forEach(i=>{i.onclick=o=>{let l=parseInt(o.target.getAttribute("data-page"));l!==this.currentPage&&(this.currentPage=l,this.updatePagination())}}),s&&(s.onchange=i=>{let o=parseInt(i.target.value);o!==this.currentPage&&(this.currentPage=o,this.updatePagination())}),r&&(r.onchange=i=>{this.itemsPerPage=parseInt(i.target.value),this.currentPage=1,this.updatePagination()}),n&&(n.oninput=this.debounce(()=>{this.currentPage=1,this.updatePagination()}))}updatePagination(){this.serverCallback?this.serverCallback(this.itemsPerPage,this.currentPage-1,(t,a)=>{this.data=t,this.totalSize=a,this.renderTable(),this.renderPaginationControls(),this.addEventListeners()}):(this.renderTable(),this.renderPaginationControls(),this.addEventListeners())}defaultRowRenderer(t,a){return`
        <td>${t+1}</td>
        <td>${a.name}</td>
        <td>${a.age}</td>
        <td>${a.address}</td>
    `}getFilteredData(){let t=document.getElementById(this.searchInputId),a=t?t.value.trim().toLowerCase():"";return a?this.data.filter(e=>Object.values(e).some(s=>s?.toString().toLowerCase().includes(a))):this.data}setupExportButton(){let t=document.getElementById(this.exportButtonId);t&&t.addEventListener("click",()=>{let a=this.getFilteredData(),e=document.getElementById(this.tableId),s=Array.from(e.querySelectorAll("thead th")).map(o=>o.innerText),r=a.map((o,l)=>[l+1,...Object.values(o)]),n=XLSX.utils.aoa_to_sheet([s,...r]),i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,n,"Sheet1"),XLSX.writeFile(i,"data.xlsx")})}showTotalSize(){document.getElementById(this.totalSizeId).innerText="Show "+this.itemsPerPage+"/"+this.totalSize+"records"}};export{h as default};
