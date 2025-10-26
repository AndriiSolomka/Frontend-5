let validationState = {
  isFullNameValid: false,
  isFacultyValid: false,
  isBirthdateValid: false,
  isAddressValid: false,
  isEmailValid: false,
};

const validators = {
  fullName: {
    regex: /^[A-Za-zА-Яа-яІіЇїЄє]+ [A-Za-zА-ЯІіЇїЄє]\.[A-Za-zА-ЯІіЇїЄє]\.$/,
    field: "isFullNameValid",
  },
  faculty: {
    regex: /^[A-Za-zА-Яа-яІіЇїЄє]{2,4}$/,
    field: "isFacultyValid",
  },
  birthdate: {
    regex: /^\d{2}\.\d{2}\.\d{4}$/,
    field: "isBirthdateValid",
    customValidation: (value) => {
      const [day, month, year] = value.split(".").map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const minDate = new Date(1907, 0, 1);
      const currentDate = new Date();
      return enteredDate >= minDate && enteredDate <= currentDate;
    },
  },
  address: {
    regex: /^м\. \d{6}$/,
    field: "isAddressValid",
  },
  email: {
    regex: /^[a-z0-9\._]+@[a-z]+\.com$/,
    field: "isEmailValid",
  },
};

function validateField(fieldName, value) {
  const validator = validators[fieldName];
  if (!validator) return false;

  let isValid = validator.regex.test(value);

  if (isValid && validator.customValidation) {
    isValid = validator.customValidation(value);
  }

  validationState[validator.field] = isValid;
  return isValid;
}

function setupFieldValidation() {
  Object.keys(validators).forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    if (field) {
      field.addEventListener("input", function () {
        const isValid = validateField(fieldName, this.value);
        this.classList.toggle("error", !isValid);

        updateFieldVisualFeedback(this, isValid);
      });

      field.addEventListener("focus", function () {
        this.classList.add("focused");
      });

      field.addEventListener("blur", function () {
        this.classList.remove("focused");
      });
    }
  });
}

function updateFieldVisualFeedback(field, isValid) {
  field.classList.remove("valid", "invalid");

  if (field.value.length > 0) {
    field.classList.add(isValid ? "valid" : "invalid");
  }
}

function setupFormSubmission() {
  const form = document.querySelector(".registration-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const allValid = Object.values(validationState).every(
        (isValid) => isValid
      );

      if (allValid) {
        displayTextInNewWindow();
        showSuccessMessage();
      } else {
        showErrorMessage();
        highlightInvalidFields();
      }
    });
  }
}

function showSuccessMessage() {
  console.log("Форма успішно відправлена!");
}

function showErrorMessage() {
  const invalidFields = Object.entries(validationState)
    .filter(([key, isValid]) => !isValid)
    .map(([key]) => key);

  alert(
    `Будь ласка, перевірте правильність введених даних у полях: ${invalidFields.join(
      ", "
    )}`
  );
}

function highlightInvalidFields() {
  Object.entries(validationState).forEach(([field, isValid]) => {
    if (!isValid) {
      const fieldElement = document.getElementById(
        field.replace("is", "").replace("Valid", "").toLowerCase()
      );
      if (fieldElement) {
        fieldElement.classList.add("error");
        fieldElement.focus();
        return;
      }
    }
  });
}

const displayTextInNewWindow = () => {
  const formData = {
    fullName: document.getElementById("fullName").value,
    faculty: document.getElementById("faculty").value,
    birthdate: document.getElementById("birthdate").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
  };

  const displayHTML = `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Дані реєстрації</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        
        .info-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          padding: 3rem;
          max-width: 500px;
          width: 100%;
          border: 1px solid #e2e8f0;
        }
        
        .info-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
        }
        
        .info-value {
          font-weight: 500;
          color: #1e293b;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }
        
        .success-icon {
          width: 4rem;
          height: 4rem;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        
        .checkmark {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="info-container">
        <div class="success-icon">
          <span class="checkmark">✓</span>
        </div>
        <h1 class="info-title">Реєстрація успішна!</h1>
        <div class="info-item">
          <span class="info-label">ПІБ:</span>
          <span class="info-value">${formData.fullName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Факультет:</span>
          <span class="info-value">${formData.faculty}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Дата народження:</span>
          <span class="info-value">${formData.birthdate}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Адреса:</span>
          <span class="info-value">${formData.address}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Електронна пошта:</span>
          <span class="info-value">${formData.email}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  const newWindow = window.open("", "_blank");
  newWindow.document.write(displayHTML);
  newWindow.document.close();
};

function setupInteractiveTable() {
  const tableBody = document.getElementById("numberTableBody");
  const colorPicker = document.getElementById("colorPicker");

  if (!tableBody || !colorPicker) return;

  let counter = 1;

  for (let i = 1; i <= 6; i++) {
    const row = document.createElement("tr");

    for (let j = 1; j <= 6; j++) {
      const cell = document.createElement("td");
      cell.textContent = counter;

      if (counter === 5) {
        cell.classList.add("special-cell");
        setupSpecialCellEvents(cell, colorPicker, tableBody);
      }

      row.appendChild(cell);
      counter++;
    }

    tableBody.appendChild(row);
  }
}

function setupSpecialCellEvents(cell, colorPicker, tableBody) {
  cell.addEventListener("mouseover", () => {
    cell.style.backgroundColor = getRandomColor();
  });

  cell.addEventListener("click", () => {
    cell.style.backgroundColor = colorPicker.value;
  });

  cell.addEventListener("dblclick", () => {
    const selectedColor = getRandomColor();
    const allCells = Array.from(tableBody.getElementsByTagName("td"));

    allCells.forEach((otherCell) => {
      if (otherCell !== cell) {
        otherCell.style.backgroundColor = selectedColor;
      }
    });
  });
}

function getRandomColor() {
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#10ac84",
    "#ee5a6f",
    "#60a3bc",
    "#778ca3",
    "#4b7bec",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("DOMContentLoaded", function () {
  setupFieldValidation();
  setupFormSubmission();
  setupInteractiveTable();

  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});
