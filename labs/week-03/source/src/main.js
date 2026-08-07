import './style.css';

const form = document.querySelector('#request-form');
const status = document.querySelector('#form-status');
const requestList = document.querySelector('#request-list');

// TODO 1: query preview/status/list elements
const preview = {
  requesterName: document.querySelector('#preview-name'),
  requestType: document.querySelector('#preview-type'),
  details: document.querySelector('#preview-details'),
};

const fields = {
  requesterName: document.querySelector('#requester-name'),
  requestType: document.querySelector('#request-type'),
  details: document.querySelector('#request-details'),
};

const errorMessages = {
  requesterName: document.querySelector('#requester-name-error'),
  requestType: document.querySelector('#request-type-error'),
  details: document.querySelector('#request-details-error'),
};

// TODO 2: readForm()
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// TODO 3: renderPreview(data)
function renderPreview(data) {
  preview.requesterName.textContent = data.requesterName?.trim() || 'ยังไม่ระบุชื่อ';
  preview.requestType.textContent = data.requestType || 'ยังไม่เลือกประเภท';
  preview.details.textContent = data.details?.trim() || 'ยังไม่มีรายละเอียด';
}

// TODO 4: validate(data)
function validate(data) {
  const errors = {};

  if (!data.requesterName?.trim()) {
    errors.requesterName = 'Requester Name is required.';
  }

  if (!data.requestType) {
    errors.requestType = 'Request Type is required.';
  }

  if (!data.details?.trim()) {
    errors.details = 'Details are required.';
  }

  return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
  Object.keys(fields).forEach((name) => {
    const message = errors[name] || '';

    fields[name].setAttribute('aria-invalid', message ? 'true' : 'false');
    errorMessages[name].textContent = message;
  });
}

function clearStatus() {
  status.textContent = '';
  status.className = 'status';
}

function setStatus(message, type) {
  status.textContent = message;
  status.className = `status status-${type}`;
}

function addSubmittedRequest(data) {
  const item = document.createElement('li');
  const title = document.createElement('strong');
  const details = document.createElement('p');

  title.textContent = `${data.requesterName.trim()} - ${data.requestType}`;
  details.textContent = data.details.trim();

  item.append(title, details);
  requestList.prepend(item);
}

// TODO 6: input and submit listeners
form.addEventListener('input', () => {
  renderPreview(readForm());
  clearStatus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);

  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    const firstInvalidField = Object.keys(fields).find((name) => errors[name]);

    setStatus('Please complete the required fields.', 'error');
    fields[firstInvalidField]?.focus();
    return;
  }

  addSubmittedRequest(data);
  setStatus('Request submitted successfully.', 'success');
  form.reset();
  renderPreview(readForm());
  renderErrors({});
});