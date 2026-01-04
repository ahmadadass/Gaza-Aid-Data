// State management
let currentStep = 1;
const totalSteps = 5;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add initial fields if empty
    addWife();
    addChild();
});

// Navigation functions
function nextStep(step) {
    if (validateStep(currentStep)) {
        showStep(step);
    }
}

function prevStep(step) {
    showStep(step);
}

function showStep(step) {
    // Update active step in UI
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');

    currentStep = step;
    window.scrollTo(0, 0);
}

function validateStep(step) {
    const stepEl = document.getElementById(`step${step}`);
    const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    if (!valid) {
        alert('يرجى تعبئة جميع الحقول المطلوبة');
    }
    return valid;
}

// Dynamic Field Generators
function createCard(type, id, content) {
    const div = document.createElement('div');
    div.className = 'dynamic-card';
    div.id = `${type}-${id}`;
    div.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeElement(this)">حذف</button>
        ${content}
    `;
    return div;
}

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Wives
function addWife() {
    const id = generateId();
    const content = `
        <h3>بيانات الزوجة</h3>
        <div class="form-group">
            <label>الاسم الكامل</label>
            <input type="text" name="wives[${id}][name]" required placeholder="الاسم رباعي">
        </div>
        <div class="form-group">
            <label>رقم الهوية</label>
            <input type="number" name="wives[${id}][id]" required>
        </div>
        <div class="form-group">
            <label>تاريخ الميلاد</label>
            <input type="date" name="wives[${id}][dob]" required>
        </div>
    `;
    document.getElementById('wivesContainer').appendChild(createCard('wife', id, content));
}

// Children
function addChild() {
    const id = generateId();
    const content = `
        <h3>بيانات الابن/الابنة</h3>
        <div class="form-group">
            <label>الاسم</label>
            <input type="text" name="children[${id}][name]" required>
        </div>
        <div class="form-group">
            <label>الجنس</label>
            <select name="children[${id}][gender]" required>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
            </select>
        </div>
        <div class="form-group">
            <label>تاريخ الميلاد</label>
            <input type="date" name="children[${id}][dob]" required>
        </div>
        <div class="form-group">
            <label>الحالة التعليمية</label>
            <select name="children[${id}][education]">
                <option value="none">دون سن الدراسة</option>
                <option value="school">مدرسة</option>
                <option value="university">جامعة</option>
                <option value="graduated">خريج</option>
            </select>
        </div>
    `;
    document.getElementById('childrenContainer').appendChild(createCard('child', id, content));
}

// Martyrs
function addMartyr() {
    const id = generateId();
    const content = `
        <h3>بيانات الشهيد</h3>
        <div class="form-group">
            <label>الاسم الكامل</label>
            <input type="text" name="martyrs[${id}][name]" required>
        </div>
        <div class="form-group">
            <label>تاريخ الاستشهاد</label>
            <input type="date" name="martyrs[${id}][date]" required>
        </div>
        <div class="form-group">
            <label>صلة القرابة</label>
            <input type="text" name="martyrs[${id}][relation]" required placeholder="أب، أخ، ابن...">
        </div>
    `;
    document.getElementById('martyrsContainer').appendChild(createCard('martyr', id, content));
}

// Prisoners
function addPrisoner() {
    const id = generateId();
    const content = `
        <h3>بيانات الأسير</h3>
        <div class="form-group">
            <label>الاسم الكامل</label>
            <input type="text" name="prisoners[${id}][name]" required>
        </div>
        <div class="form-group">
            <label>تاريخ الاعتقال</label>
            <input type="date" name="prisoners[${id}][date]" required>
        </div>
        <div class="form-group">
            <label>مدة الحكم (إن وجد)</label>
            <input type="text" name="prisoners[${id}][sentence]" placeholder="إداري / مدة الحكم">
        </div>
    `;
    document.getElementById('prisonersContainer').appendChild(createCard('prisoner', id, content));
}

function removeElement(btn) {
    if(confirm('هل أنت متأكد من الحذف؟')) {
        btn.parentElement.remove();
    }
}


document.getElementById('familyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateStep(5)) return;

// Collect Data
    const formData = new FormData(this);
    const data = {
        headOfFamily: {
            name: formData.get('headName'),
            id: formData.get('headId'),
            dob: formData.get('headDob'),
            phone: formData.get('headPhone')
        },
        wives: [],
        children: [],
        martyrs: [],
        prisoners: [],
        housing: {
            status: formData.get('housingStatus'),
            address: formData.get('address')
        },
        documents: []
    };

    // Helper to parse dynamic array fields
    // This simple parser assumes inputs are named like category[id][field]
    // Since FormData doesn't natively nest, we iterate entries
    const entries = Array.from(formData.entries());
    
    // Maps to store temporary objects
    const wivesMap = {};
    const childrenMap = {};
    const martyrsMap = {};
    const prisonersMap = {};

    entries.forEach(([key, value]) => {
        if (key.startsWith('wives[')) {
            const [, id, field] = key.match(/wives\[(.*?)\]\[(.*?)\]/);
            if (!wivesMap[id]) wivesMap[id] = {};
            wivesMap[id][field] = value;
        } else if (key.startsWith('children[')) {
            const [, id, field] = key.match(/children\[(.*?)\]\[(.*?)\]/);
            if (!childrenMap[id]) childrenMap[id] = {};
            childrenMap[id][field] = value;
        } else if (key.startsWith('martyrs[')) {
            const [, id, field] = key.match(/martyrs\[(.*?)\]\[(.*?)\]/);
            if (!martyrsMap[id]) martyrsMap[id] = {};
            martyrsMap[id][field] = value;
        } else if (key.startsWith('prisoners[')) {
            const [, id, field] = key.match(/prisoners\[(.*?)\]\[(.*?)\]/);
            if (!prisonersMap[id]) prisonersMap[id] = {};
            prisonersMap[id][field] = value;
        } else if (key === 'documents') {
            if (value.name) {
                data.documents.push(value.name); // Just storing filenames for demo
            }
        }
    });

    data.wives = Object.values(wivesMap);
    data.children = Object.values(childrenMap);
    data.martyrs = Object.values(martyrsMap);
    data.prisoners = Object.values(prisonersMap);

    // إرسال البيانات إلى Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbzTqYAA5zRbGnZMpmOwxddZpVUnQXzmjQ-5UVgU34U2PtIB1Tursq_p_iw4wUprX0eV/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(resp => {
        console.log('Google Sheets Response:', resp);
        if(resp.status === 'success') {
            alert('تم حفظ البيانات بنجاح في Google Sheets!');
            document.getElementById('outputArea').classList.remove('hidden');
            document.getElementById('jsonOutput').textContent = JSON.stringify(data, null, 4);
        } else {
            alert('حدث خطأ أثناء الحفظ: ' + resp.message);
        }
    })
    .catch(err => alert('خطأ في الاتصال: ' + err));
});

document.querySelectorAll('.btn-next').forEach((btn, idx) => {
    btn.addEventListener('click', () => nextStep(idx + 2));
});

