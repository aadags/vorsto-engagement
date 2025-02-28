class DynamicForm{constructor(e,t,o={}){this.container=document.getElementById(e),this.apiUrl=`https://engage.vorsto.io/api/public/form?formId=${t}`,this.options={designColor:o.designColor||"#007bff",textColor:o.textColor||"black",backgroundColor:o.backgroundColor||"transparent",showBorder:void 0===o.showBorder||o.showBorder,showShadow:void 0===o.showShadow||o.showShadow,inputStyles:o.inputStyles||"width: 100%; padding: 10px; border-radius: 5px; font-size: 16px;",textareaStyles:o.textareaStyles||"width: 100%; padding: 10px; border-radius: 5px; font-size: 16px; height: 100px;",buttonStyles:o.buttonStyles||"width: 100%; padding: 12px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer;",labelStyles:o.labelStyles||"display: block; font-weight: bold; margin-bottom: 5px;",fontFamily:o.fontFamily||"Arial, sans-serif"},this.fetchFormData()}async fetchFormData(){try{let e=await fetch(this.apiUrl),t=await e.json();this.renderForm(JSON.parse(t.form.data))}catch(o){console.error("Error fetching form data:",o)}}renderForm(e){if(!this.container){console.error("Container not found");return}this.container.style.background=this.options.backgroundColor,this.container.style.fontFamily=this.options.fontFamily,this.container.style.padding="20px",this.container.style.maxWidth="100%",this.container.style.margin="auto",this.container.style.color=this.options.textColor,this.container.style.border=this.options.showBorder?"1px solid #ccc":"none",this.container.style.boxShadow=this.options.showShadow?"0px 0px 10px rgba(0, 0, 0, 0.1)":"none",this.container.style.borderRadius="8px";let t=document.createElement("form");e.questions.forEach(e=>{let o=document.createElement("div");o.style.marginBottom="15px";let r=document.createElement("label");r.textContent=e.question,r.setAttribute("for",`field-${e.id}`),r.style.cssText=this.options.labelStyles,r.style.color=this.options.textColor,o.appendChild(r);let i;if("text"===e.answerType?(i=document.createElement("input")).type="text":"textarea"===e.answerType?i=document.createElement("textarea"):"number"===e.answerType?(i=document.createElement("input")).type="number":"email"===e.answerType&&((i=document.createElement("input")).type="email"),i&&(i.id=e.question,i.name=`${e.question}`,i.style.cssText=`${this.options.inputStyles} border: 1px solid ${this.options.designColor}; color: ${this.options.textColor};`,i.required=!0,o.appendChild(i)),"radio"===e.answerType){let n=document.createElement("div");n.style.display="flex",n.style.flexWrap="wrap",n.style.gap="10px",e.options.forEach(t=>{let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let r=document.createElement("input");r.type=e.answerType,r.name=`${e.question}`,r.value=t,r.style.marginRight="5px",r.style.marginBottom="10px",r.style.accentColor=this.options.designColor;let i=document.createElement("label");i.textContent=t,i.style.color=this.options.textColor,o.appendChild(r),o.appendChild(i),n.appendChild(o)}),o.appendChild(n)}if("checkbox"===e.answerType){let s=document.createElement("div");s.style.display="flex",s.style.flexWrap="wrap",s.style.gap="10px",e.options.forEach((t,o)=>{let r=document.createElement("div");r.style.display="flex",r.style.alignItems="center";let i=document.createElement("input");i.type=e.answerType,i.name=`${e.question}-${o}`,i.value=t,i.style.marginRight="5px",i.style.marginBottom="10px",i.style.accentColor=this.options.designColor,i.setAttribute("data-name",`${e.question}-${o}`);let n=document.createElement("label");n.textContent=t,n.style.color=this.options.textColor,r.appendChild(i),r.appendChild(n),s.appendChild(r)}),o.appendChild(s)}t.appendChild(o)});let o=document.createElement("button");o.type="submit",o.textContent="Submit",o.style.cssText=`${this.options.buttonStyles} background-color: ${this.options.designColor};`,o.addEventListener("mouseover",()=>{o.style.backgroundColor=this._adjustBrightness(this.options.designColor,-30)}),o.addEventListener("mouseout",()=>{o.style.backgroundColor=this.options.designColor}),t.addEventListener("submit",async e=>{e.preventDefault();let o=new FormData(t),r={},i=!0;if(o.forEach((e,o)=>{let n=document.getElementById(o);if(e.trim()?r[o]=e:(i=!1,n.style.borderColor="red"),n&&"radio"===n.type){let s=n.name,l=t.querySelectorAll(`input[name=${s}]`),a=Array.from(l).some(e=>e.checked);a||(i=!1,l.forEach(e=>{e.style.borderColor="red"}))}if(n&&"checkbox"===n.type){let p=n.name,d=t.querySelectorAll(`input[name=${p}]`),c=Array.from(d).some(e=>e.checked);c||(i=!1,d.forEach(e=>{e.style.borderColor="red"}))}}),i)try{let n=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({form:JSON.stringify(r)})});n.ok?alert("Form submitted successfully!"):alert("Error submitting form")}catch(s){console.error("Error submitting form:",s)}else alert("Please fill in all required fields.")}),t.appendChild(o),this.container.appendChild(t)}_adjustBrightness(e,t){let o=parseInt(e.slice(1,3),16),r=parseInt(e.slice(3,5),16),i=parseInt(e.slice(5,7),16);return o=Math.min(255,Math.max(0,o+o*t/100)),`rgb(${o}, ${r=Math.min(255,Math.max(0,r+r*t/100))}, ${i=Math.min(255,Math.max(0,i+i*t/100))})`}}