
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
var Pagination=(()=>{var c=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var m=(o,t)=>{for(var e in t)c(o,e,{get:t[e],enumerable:!0})},p=(o,t,e,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of u(t))!P.call(o,s)&&s!==e&&c(o,s,{get:()=>t[s],enumerable:!(a=g(t,s))||a.enumerable});return o};var b=o=>p(c({},"__esModule",{value:!0}),o);var I={};m(I,{default:()=>d});var d=class{constructor(t){this.tableId=t.tableId||"data-table",this.itemsPerPage=t.itemsPerPage||5,this.data=t.data||[],this.currentPage=t.currentPage||1,this.paginationContainerId=t.paginationContainerId||"pagination",this.searchInputId=t.searchInputId||"",this.isShowTotalSize=t.isShowTotalSize||!1,this.maxPagesToShow=5,this.showPageSelect=t.showPageSelect!==void 0?t.showPageSelect:!1,this.showItemsPerPageSelect=t.showItemsPerPageSelect!==void 0?t.showItemsPerPageSelect:!1,this.rowRenderer=t.rowRenderer||this.defaultRowRenderer,this.exportButtonId=t.exportButtonId||"",this.serverCallback=t.serverCallback||null,this.totalSize=t.totalSize||0,this.onRender=t.onRender||null,this.init()}init(){this.serverCallback?this.serverCallback(this.itemsPerPage,this.currentPage-1,(t,e)=>{this.data=t,this.totalSize=e,this.renderTable(),this.renderPaginationControls(),this.addEventListeners(),this.exportButtonId&&this.setupExportButton()}):(this.renderTable(),this.renderPaginationControls(),this.addEventListeners(),this.exportButtonId&&this.setupExportButton())}renderTable(){let t=(this.currentPage-1)*this.itemsPerPage,e=t+this.itemsPerPage,a=this.serverCallback?this.data:this.getFilteredData().slice(t,e),s=document.getElementById(this.tableId).getElementsByTagName("tbody")[0];s.innerHTML="",a.forEach((r,n)=>{let i=this.rowRenderer(n+t,r);s.insertAdjacentHTML("beforeend",i)}),this.onRender&&this.onRender()}renderPaginationControls(){let t=this.serverCallback?Math.ceil(this.totalSize/this.itemsPerPage):Math.ceil(this.getFilteredData().length/this.itemsPerPage),e=document.getElementById(this.paginationContainerId),a="",s=Math.max(1,this.currentPage-Math.floor(this.maxPagesToShow/2)),r=Math.min(t,s+this.maxPagesToShow-1);this.isShowTotalSize&&(a+=`<span id="pag-total-size">${this.totalSize} records</span>`),a+=`
        <button id="prev-btn" class="btn btn-outline-primary" ${this.currentPage===1?"disabled":""}>Previous</button>
    `,s>1&&(a+='<button class="btn btn-outline-primary page-btn" data-page="1">1</button>',s>2&&(a+="<span>...</span>"));for(let n=s;n<=r;n++)a+=`<button class="btn btn-outline-primary page-btn" data-page="${n}" ${this.currentPage===n?"disabled":""}>${n}</button>`;r<t&&(r<t-1&&(a+="<span>...</span>"),a+=`<button class="btn btn-outline-primary page-btn" data-page="${t}">${t}</button>`),a+=`
        <button id="next-btn" class="btn btn-outline-primary" ${this.currentPage===t?"disabled":""}>Next</button>
    `,this.showPageSelect&&(a+=`
        <select id="page-select" class="form-select">
        ${Array.from({length:t},(n,i)=>`
        <option value="${i+1}" ${this.currentPage===i+1?"selected":""}>Page ${i+1}</option>
        `).join("")}
        </select>
        `),this.showItemsPerPageSelect&&(a+=`
        <select id="items-per-page" class="form-select">
        <option value="5" ${this.itemsPerPage===5?"selected":""}>5</option>
        <option value="10" ${this.itemsPerPage===10?"selected":""}>10</option>
        <option value="20" ${this.itemsPerPage===20?"selected":""}>20</option>
        <option value="50" ${this.itemsPerPage===50?"selected":""}>50</option>
        </select>
        `),e.innerHTML=a}debounce(t,e=500){let a;return(...s)=>{clearTimeout(a),a=setTimeout(()=>{t.apply(this,s)},e)}}addEventListeners(){let t=document.getElementById("prev-btn"),e=document.getElementById("next-btn"),a=document.querySelectorAll(".page-btn"),s=document.getElementById("page-select"),r=document.getElementById("items-per-page"),n=document.getElementById(this.searchInputId);t.onclick=()=>{this.currentPage>1&&(this.currentPage--,this.updatePagination())},e.onclick=()=>{let i=this.serverCallback?Math.ceil(this.totalSize/this.itemsPerPage):Math.ceil(this.getFilteredData().length/this.itemsPerPage);this.currentPage<i&&(this.currentPage++,this.updatePagination())},a.forEach(i=>{i.onclick=l=>{let h=parseInt(l.target.getAttribute("data-page"));h!==this.currentPage&&(this.currentPage=h,this.updatePagination())}}),s&&(s.onchange=i=>{let l=parseInt(i.target.value);l!==this.currentPage&&(this.currentPage=l,this.updatePagination())}),r&&(r.onchange=i=>{this.itemsPerPage=parseInt(i.target.value),this.currentPage=1,this.updatePagination()}),n&&(n.oninput=this.debounce(()=>{this.currentPage=1,this.updatePagination()}))}updatePagination(){this.serverCallback?this.serverCallback(this.itemsPerPage,this.currentPage-1,(t,e)=>{this.data=t,this.totalSize=e,this.renderTable(),this.renderPaginationControls(),this.addEventListeners()}):(this.renderTable(),this.renderPaginationControls(),this.addEventListeners())}defaultRowRenderer(t,e){return`
        <td>${t+1}</td>
        <td>${e.name}</td>
        <td>${e.age}</td>
        <td>${e.address}</td>
    `}getFilteredData(){let t=document.getElementById(this.searchInputId),e=t?t.value.trim().toLowerCase():"";return e?this.data.filter(a=>Object.values(a).some(s=>s?.toString().toLowerCase().includes(e))):this.data}setupExportButton(){let t=document.getElementById(this.exportButtonId);t&&t.addEventListener("click",()=>{let e=this.getFilteredData(),a=document.getElementById(this.tableId),s=Array.from(a.querySelectorAll("thead th")).map(l=>l.innerText),r=e.map((l,h)=>[h+1,...Object.values(l)]),n=XLSX.utils.aoa_to_sheet([s,...r]),i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,n,"Sheet1"),XLSX.writeFile(i,"data.xlsx")})}showTotalSize(){document.getElementById(this.totalSizeId).innerText="Show "+this.itemsPerPage+"/"+this.totalSize+"records"}};return b(I);})();
