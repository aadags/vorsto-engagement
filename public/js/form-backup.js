class DynamicForm {
  constructor(containerId, id, options = {}) {
    this.container = document.getElementById(containerId);
    this.apiUrl = `http://localhost:3000/api/public/form?formId=${id}`;
    this.options = {
      designColor: options.designColor || "#007bff", // Default blue
      textColor: options.textColor || "black", // Default black
      backgroundColor: options.backgroundColor || "transparent", // Default transparent
      showBorder: options.showBorder !== undefined ? options.showBorder : true, // Default true
      showShadow: options.showShadow !== undefined ? options.showShadow : true, // Default true
      inputStyles: options.inputStyles || "width: 100%; padding: 10px; border-radius: 5px; font-size: 16px;",
      textareaStyles: options.textareaStyles || "width: 100%; padding: 10px; border-radius: 5px; font-size: 16px; height: 100px;",
      buttonStyles: options.buttonStyles || "width: 100%; padding: 12px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer;",
      labelStyles: options.labelStyles || "display: block; font-weight: bold; margin-bottom: 5px;",
      fontFamily: options.fontFamily || "Arial, sans-serif",
    };
    this.fetchFormData();
  }

  async fetchFormData() {
    try {
      const response = await fetch(this.apiUrl);
      const formData = await response.json();
      this.renderForm(JSON.parse(formData.form.data));
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  }

  renderForm(formData) {
    if (!this.container) {
      console.error("Container not found");
      return;
    }

    this.container.style.background = this.options.backgroundColor;
    this.container.style.fontFamily = this.options.fontFamily;
    this.container.style.padding = "20px";
    this.container.style.maxWidth = "400px";
    this.container.style.margin = "auto";
    this.container.style.color = this.options.textColor;
    this.container.style.border = this.options.showBorder ? "1px solid #ccc" : "none";
    this.container.style.boxShadow = this.options.showShadow ? "0px 0px 10px rgba(0, 0, 0, 0.1)" : "none";
    this.container.style.borderRadius = "8px";

    const form = document.createElement("form");
    
    formData.questions.forEach((field) => {
      const div = document.createElement("div");
      div.style.marginBottom = "15px";

      const label = document.createElement("label");
      label.textContent = field.question;
      label.setAttribute("for", `field-${field.id}`);
      label.style.cssText = this.options.labelStyles;
      label.style.color = this.options.textColor;
      div.appendChild(label);

      let input;
      if (field.answerType === "text") {
        input = document.createElement("input");
        input.type = "text";
      } else if (field.answerType === "textarea") {
        input = document.createElement("textarea");
      }
      else if (field.answerType === "number") {
        input = document.createElement("input");
        input.type = "number";
      }
      else if (field.answerType === "email") {
        input = document.createElement("input");
        input.type = "email";
      }
      
      if (input) {
        input.id = field.question;
        input.name = `${field.question}`;
        input.style.cssText = `${this.options.inputStyles} border: 1px solid ${this.options.designColor}; color: ${this.options.textColor};`;
        input.required = true;  // Make all fields required
        div.appendChild(input);
      }
      
      if (field.answerType === "radio") {
        const optionsContainer = document.createElement("div");
        optionsContainer.style.display = "flex";
        optionsContainer.style.flexWrap = "wrap";
        optionsContainer.style.gap = "10px";
        
        field.options.forEach((option) => {
          const optionWrapper = document.createElement("div");
          optionWrapper.style.display = "flex";
          optionWrapper.style.alignItems = "center";
          
          const optionInput = document.createElement("input");
          optionInput.type = field.answerType;
          optionInput.name = `${field.question}`;
          optionInput.value = option;
          optionInput.style.marginRight = "5px";
          optionInput.style.marginBottom = "10px";
          optionInput.style.accentColor = this.options.designColor;
          
          const optionLabel = document.createElement("label");
          optionLabel.textContent = option;
          optionLabel.style.color = this.options.textColor;
          
          optionWrapper.appendChild(optionInput);
          optionWrapper.appendChild(optionLabel);
          optionsContainer.appendChild(optionWrapper);
        });

        div.appendChild(optionsContainer);
      }

      if (field.answerType === "checkbox") {
        const optionsContainer = document.createElement("div");
        optionsContainer.style.display = "flex";
        optionsContainer.style.flexWrap = "wrap";
        optionsContainer.style.gap = "10px";
        
        field.options.forEach((option, i) => {
          const optionWrapper = document.createElement("div");
          optionWrapper.style.display = "flex";
          optionWrapper.style.alignItems = "center";
          
          const optionInput = document.createElement("input");
          optionInput.type = field.answerType;
          optionInput.name = `${field.question}-${i}`;
          optionInput.value = option;
          optionInput.style.marginRight = "5px";
          optionInput.style.marginBottom = "10px";
          optionInput.style.accentColor = this.options.designColor;
          optionInput.setAttribute('data-name', `${field.question}-${i}`);
          
          const optionLabel = document.createElement("label");
          optionLabel.textContent = option;
          optionLabel.style.color = this.options.textColor;
          
          optionWrapper.appendChild(optionInput);
          optionWrapper.appendChild(optionLabel);
          optionsContainer.appendChild(optionWrapper);
        });

        div.appendChild(optionsContainer);
      }
      
      form.appendChild(div);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.style.cssText = `${this.options.buttonStyles} background-color: ${this.options.designColor};`;
    submitBtn.addEventListener("mouseover", () => {
      submitBtn.style.backgroundColor = this._adjustBrightness(this.options.designColor, -30);
    });
    submitBtn.addEventListener("mouseout", () => {
      submitBtn.style.backgroundColor = this.options.designColor;
    });

    // Form validation before submission
    form.addEventListener("submit", async (event) => {
      event.preventDefault();  // Prevent form submission until validation
      const formData = new FormData(form);
      const formJson = {};
    
      let isValid = true;
    
      formData.forEach((value, key) => {
        const inputElement = document.getElementById(key);
    
        // Handle text and textarea fields
        if (!value.trim()) {
          isValid = false;
          inputElement.style.borderColor = "red";  // Indicate error on the field
        } else {
          formJson[key] = value;
          // inputElement.style.borderColor = "";  // Reset border color if valid
        }
    
        // Handle radio buttons
        if (inputElement && inputElement.type === "radio") {
          const groupName = inputElement.name;
          const radioButtons = form.querySelectorAll(`input[name=${groupName}]`);
          const selectedRadio = Array.from(radioButtons).some((radio) => radio.checked);
    
          if (!selectedRadio) {
            isValid = false;
            radioButtons.forEach((radio) => {
              radio.style.borderColor = "red"; // Indicate error on radio button group
            });
          }
        }
    
        // Handle checkboxes
        if (inputElement && inputElement.type === "checkbox") {
          const checkboxGroupName = inputElement.name;
          const checkboxes = form.querySelectorAll(`input[name=${checkboxGroupName}]`);
          const selectedCheckbox = Array.from(checkboxes).some((checkbox) => checkbox.checked);
    
          if (!selectedCheckbox) {
            isValid = false;
            checkboxes.forEach((checkbox) => {
              checkbox.style.borderColor = "red"; // Indicate error on checkbox group
            });
          }
        }
      });
    
      if (isValid) {
        // Send data to the server if form is valid
        try {
          const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ form: JSON.stringify(formJson) }),
          });
    
          if (response.ok) {
            alert("Form submitted successfully!");
          } else {
            alert("Error submitting form");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      } else {
        alert("Please fill in all required fields.");
      }
    });
    

    form.appendChild(submitBtn);
    this.container.appendChild(form);
  }

  _adjustBrightness(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, r + (r * percent) / 100));
    g = Math.min(255, Math.max(0, g + (g * percent) / 100));
    b = Math.min(255, Math.max(0, b + (b * percent) / 100));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
