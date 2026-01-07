//const { baremetalsolution } = require("googleapis/build/src/apis/baremetalsolution");

// State management | إدارة الحالة
let currentStep = 1;
const totalSteps = 5;
let wifeCounter = 0;
let childCounter = 0;
let martyrCounter = 0;

// Navigation functions | وظائف التنقل
function nextStep(step) {
    if (validateStep(currentStep)) {
        const headSocialStatus = new FormData(document.getElementById('familyForm')).get('headSocialStatus');document.getElementById('headSocialStatus').value;

        if (step === 1 && ( headSocialStatus === 'male_single_40' || headSocialStatus === 'female_single_40' )){
            step += 2;
        } else if (step === 1 && ( headSocialStatus === 'male_widower' || headSocialStatus === 'male_divorced' || headSocialStatus === 'female_widow' || headSocialStatus === 'female_divorced' || headSocialStatus === 'female_abandoned')) {
            step += 1;
        }

        showStep(step);
    }
}

function prevStep(step) {

    const headSocialStatus = new FormData(document.getElementById('familyForm')).get('headSocialStatus');

    if (step === 3 && ( headSocialStatus === 'male_widower' || headSocialStatus === 'male_divorced' || headSocialStatus === 'female_widow' || headSocialStatus === 'female_divorced' || headSocialStatus === 'female_abandoned')){
        step -= 1;
    } else if (step === 4 && ( headSocialStatus === 'male_single_40' || headSocialStatus === 'female_single_40' )){
        step -= 2;
    }

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
    let valid = true;

    const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (input.offsetParent === null) return; // Ignore hidden fields
        
        // Check file inputs
        if (input.type === 'file' && input.files.length === 0) {
             // يمكن جعلها اختيارية إذا أردت، حالياً نتجاوز التحقق للملفات لتسهيل التجربة
             return; 
        }

        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    if (!valid) {
        alert('يرجى تعبئة الحقول المطلوبة المحددة باللون الأحمر.');
    }
    return valid;
}

// UI Helpers | وظائف مساعدة للواجهة
function toggleField(selectElem, targetId) {
    const target = document.getElementById(targetId);
    //const input = document.getElementsByClassName('hidden-input');
    if (!target) {
        // Try finding by class inside dynamic cards
        const parent = selectElem.closest('.dynamic-card') || selectElem.closest('.section-box');
        const internalTarget = parent ? parent.querySelector('.' + targetId) : null;
        if(internalTarget) {
             internalTarget.style.display = selectElem.value === 'yes' || selectElem.value === 'other' ? 'block' : 'none';
             const inputs = internalTarget.querySelectorAll('input');
             inputs.forEach(i => {
                if(selectElem.value === 'yes' || selectElem.value === 'other') {
                    i.hidden = false;
                    i.setAttribute('required', 'true');
                } else {
                    i.hidden = true; 
                    i.removeAttribute('required');
                }
            });
        }
        return;
    }

    // Standard ID toggle
    if (selectElem.value === 'yes' || selectElem.value === 'other') {
        target.style.display = 'block';
        target.querySelectorAll('input').forEach(i => i.setAttribute('required', 'true'));
    } else {
        target.style.display = 'none';
        target.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    }
}

function handleSpouseStatus(selectElem) {
    const target = document.getElementById('deceasedSpouseInfo');
    if (selectElem.value === 'martyr' || selectElem.value === 'deceased') {
        target.style.display = 'block';
        target.querySelectorAll('input').forEach(i => i.setAttribute('required', 'true'));
    } else {
        target.style.display = 'none';
        target.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    }
}

// Dynamic Field Generators | إنشاء الحقول ديناميكياً
function createCard(type, id, content, title) {
    const div = document.createElement('div');
    div.className = 'dynamic-card';
    div.id = `${type}-${id}`;
    div.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
            <button type="button" class="btn-remove" onclick="removeElement(this)">حذف</button>
        </div>
        ${content}
    `;
    return div;
}

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 5);
}

function removeElement(btn) {
    if(confirm('هل أنت متأكد من الحذف؟')) {
        btn.closest('.dynamic-card').remove();
    }
}

// ------------------------------------------
// WIVES | الزوجات
// ------------------------------------------
function addWife() {
    if (wifeCounter >= 4){
        return "Error: you can only have 4 wifes";
    }
    wifeCounter++;
    const id = generateId();
    // (تم الحفاظ على نفس الحقول كما في النسخة السابقة)
    const content = `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="wives[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="number" name="wives[${id}][id]" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group half">
                <label>تاريخ الميلاد</label>
                <input type="date" name="wives[${id}][dob]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهاتف</label>
                <input type="tel" name="wives[${id}][phone]">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group half">
                <label>هل حامل؟</label>
                <select name="wives[${id}][pregnant]">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
            </div>
            <div class="form-group half">
                <label>هل مرضع؟</label>
                <select name="wives[${id}][nursing]">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>هل تعاني من أمراض؟</label>
            <select name="wives[${id}][sick]" onchange="toggleField(this, 'wifeDisease-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <input type="text" class="wifeDisease-${id} hidden-input" name="wives[${id}][diseaseDetails]" placeholder="تفاصيل المرض بوضوح" hidden >
        </div>

        <div class="form-group">
            <label>هل تعرضت لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="wives[${id}][injured]" onchange="toggleField(this, 'wifeInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div class="wifeInjury-${id} hidden-input" hidden >
                <input type="text" name="wives[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
                <label>تاريخ الإصابة:</label>
                <input type="date" name="wives[${id}][injuryDate]">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group half">
                <label>هل فُقدت خلال الحرب؟</label>
                <select name="wives[${id}][missing]">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
            </div>
            <div class="form-group half">
                <label>هل أُسرت خلال الحرب؟</label>
                <select name="wives[${id}][prisoner]" onchange="toggleField(this, 'wifePrison-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <input type="date" class="wifePrison-${id} hidden-input" name="wives[${id}][prisonDate]" placeholder="تاريخ الأسر" hidden >
            </div>
        </div>
        <div class="form-group">
            <label>- الهوية الأصلية تشمل السليب بشكل مفرود أو الهوية بدل فاقد (وجه الأول + الوجه الثاني)</label>
            <input type="file" name="wives[${id}][IdImage]" accept="image/*,.pdf">
        </div>
    `;
    document.getElementById('wivesContainer').appendChild(createCard('wife', id, content, `بطاقة الزوجة (${wifeCounter})`));
}

// ------------------------------------------
// CHILDREN | الأبناء
// ------------------------------------------
function addChild() {
    childCounter++;
    const id = generateId();
    const content = `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="children[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="number" name="children[${id}][id]" required>
            </div>
        </div>
        <div class="form-row">
             <div class="form-group half">
                <label>الجنس</label>
                <select name="children[${id}][gender]" required>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                </select>
            </div>
            <div class="form-group half">
                <label>تاريخ الميلاد</label>
                <input type="date" name="children[${id}][dob]" required>
            </div>
        </div>
        <div class="form-group">
            <label>اسم الأم (رباعي)</label>
            <input type="text" name="children[${id}][motherName]" required>
        </div>
        
        <div class="form-group">
            <label>هل يعاني من أمراض؟</label>
            <select name="children[${id}][sick]" onchange="toggleField(this, 'childDisease-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <input type="text" class="childDisease-${id} hidden-input" name="children[${id}][diseaseDetails]" placeholder="تفاصيل المرض بدقة" hidden >
        </div>

        <div class="form-group">
            <label>هل تعرض لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="children[${id}][injured]" onchange="toggleField(this, 'childInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div class="childInjury-${id} hidden-input" hidden >
                <input type="text" name="children[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
                <label>تاريخ الإصابة:</label>
                <input type="date" name="children[${id}][injuryDate]">
            </div>
        </div>

        <div class="form-row">
             <div class="form-group half">
                <label>هل هو من مفقودين الحرب?</label>
                <select name="children[${id}][missing]" onchange="toggleField(this, 'childMissing-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <input type="date" class="childMissing-${id} hidden-input" name="children[${id}][missingDate]" placeholder="تاريخ الفقد" hidden >
            </div>
            <div class="form-group half">
                <label>هل أسر خلال الحرب؟</label>
                <select name="children[${id}][prisoner]" onchange="toggleField(this, 'childPrison-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <input type="date" class="childPrison-${id} hidden-input" name="children[${id}][prisonDate]" placeholder="تاريخ الأسر" hidden >
            </div>
        </div>

        <div class="form-group">
            <label>المرحلة التعليمية الحالية</label>
            <select name="children[${id}][education]">
                <option value="kg">روضة</option>
                <option value="primary">ابتدائي</option>
                <option value="middle">إعدادي</option>
                <option value="high">ثانوي</option>
                <option value="university">جامعة</option>
                <option value="none">بدون / دون سن الدراسة</option>
            </select>
        </div>
    `;
    document.getElementById('childrenContainer').appendChild(createCard('child', id, content, `ابن/ابنة (${childCounter})`));
}

// ------------------------------------------
// MARTYRS | الشهداء
// ------------------------------------------
function addMartyr() {
    martyrCounter++;
    const id = generateId();
    const content = `
        <div class="form-group">
            <label>الاسم الرباعي</label>
            <input type="text" name="martyrs[${id}][name]" required>
        </div>
        <div class="form-row">
            <div class="form-group half">
        
                <label>صلة القرابة ابن,ابنة,زوجة</label>
                    
                <select name="martyrs[${id}][relation]">
                    <option value="son">ابن</option>
                    <option value="daughter">ابنة</option>
                    <option value="wife">زوجة</option>
                    <option value="husband">زوج</option>
                </select>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="number" name="martyrs[${id}][id]">
            </div>
        </div>
        <div class="form-group">
            <label>تاريخ الاستشهاد</label>
            <input type="date" name="martyrs[${id}][date]" required>
        </div>
    `;
    document.getElementById('martyrsContainer').appendChild(createCard('martyr', id, content, `شهيد (${martyrCounter})`));
}

// ------------------------------------------
// SUBMIT | إرسال النموذج
// ------------------------------------------
document.getElementById('familyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateStep(5)) return;

    // زر الإرسال لتغيير نصه أثناء التحميل
    const submitBtn = document.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'جاري الإرسال...';
       submitBtn.disabled = true;

    const formData = new FormData(this);

    let headSocialStatus = formData.get('headSocialStatus');
    let headSocialStatusArb = "";
    switch (headSocialStatus) {
        case "male_married":
            headSocialStatusArb = "-- اختر الحالة --"; 
            break; 
        case "male_multi":
            headSocialStatusArb = "ذكر (متزوج)";
            break;
        case "male_multi":
            headSocialStatusArb = "ذكر (متعدد الزوجات)";
            break;
        case "male_single_40":
            headSocialStatusArb = "ذكر (أعزب فوق 40)";
            break; 
        case "male_widower":
            headSocialStatusArb = "ذكر (أرمل) لم يتزوج بعدها";
            break;
        case "male_divorced":
            headSocialStatusArb = "ذكر (مطلق) لم يتزوج بعدها";
            break; 
        case "female_widow":
            headSocialStatusArb = "أنثى (أرملة)";
            break;
        case "female_single_40":
            headSocialStatusArb = "أنثى (عزباء فوق 40)";
            break;
        case "female_divorced":
            headSocialStatusArb = "أنثى (مطلقة)";
            break;
        case "female_abandoned":
            headSocialStatusArb = "أنثى (مهجورة)";
            break;
        default:  
            headSocialStatusArb = headSocialStatus;
    }

    let headSpouseStatus = formData.get('headSpouseStatus');
    let headSpouseStatusArb = "";

    switch (headSocialStatus) {
        case "none":
            headSpouseStatusArb = "لا ينطبق (الزوج/ة على قيد الحياة)";
            break; 
        case "martyr":
            headSpouseStatusArb = "شهيد";
            break; 
        case "deceased":
            headSpouseStatusArb = "متوفّى (وفاة طبيعية)";
            break; 
        default:  
            headSpouseStatusArb = headSpouseStatus;
    }


    
    // بناء كائن البيانات JSON
    const data = {
        submissionDate: new Date().toISOString(),
        headOfFamily: {
            firstName: formData.get('headFirstName'),
            fatherName: formData.get('headFatherName'),
            grandName: formData.get('headGrandName'),
            familyName: formData.get('headFamilyName'),
            fullName: `${formData.get('headFirstName')} ${formData.get('headFatherName')} ${formData.get('headGrandName')} ${formData.get('headFamilyName')}`,
            id: formData.get('headId'),
            dob: formData.get('headDob'),
            socialStatus: headSocialStatusArb,
            health: {
                chronic: (formData.get('headHasDisease') == "yes") ? "نعم" : "لا",
                details: formData.get('headDiseaseDetails'),
                warInjury: (formData.get('headIsInjured') == "yes") ? "نعم" : "لا",
                injuryDetails: formData.get('headInjuryDesc'),
                injuryDate: formData.get('headInjuryDate'),
                injuryEffect: formData.get('headInjuryEffect')
            },
            job: formData.get('headJob') === 'other' ? formData.get('headOtherJob') : formData.get('headOtherJob'),
            spouseStatus: headSpouseStatusArb,
            deceasedSpouse: {
                name: formData.get('deceasedSpouseName'),
                id: formData.get('deceasedSpouseId'),
                date: formData.get('deceasedSpouseDate')
            },
            phones: {
                primary: formData.get('headPhone'),
                alt: formData.get('headPhoneAlt')
            }
        },
        housing: {
            original: {
                city: 'غزة - التفاح الشرقي - مسجد الجولاني',
                street: formData.get('originalStreet'),
                desc: formData.get('originalDesc')
            },
            current: {
                gov: formData.get('currentGov'),
                city: formData.get('currentCity'),
                neighborhood: formData.get('currentNeighborhood'),
                landmark: formData.get('currentLandmark'),
                type: formData.get('housingType') === 'other' ?   formData.get('housingOtherType') : formData.get('housingType')
            },
            whatsapp: formData.get('whatsapp')
        },
        hasMartyrWife: (formData.get('hasMartyrWife') == "yes") ? "نعم" : "لا",
        wives: [],
        children: [],
        martyrs: []
    };

    // Helper function for nested fields
    const extractDynamic = (prefix) => {
        const map = {};
        for(let [key, value] of formData.entries()) {
            if(key.startsWith(prefix + '[')) {
                const match = key.match(new RegExp(`${prefix}\\[(.*?)\\]\\[(.*?)\\]`));
                if(match) {
                    const id = match[1];
                    const field = match[2];
                    if(!map[id]) map[id] = {};
                    map[id][field] = value;
                }
            }
        }
        return Object.values(map);
    };

    data.wives = extractDynamic('wives');
    data.children = extractDynamic('children');
    data.martyrs = extractDynamic('martyrs');

    // ----------------------------------------------------
    // SEND DATA TO GOOGLE SHEETS VIA NETLIFY FUNCTION
    // ----------------------------------------------------
    const API_URL = "https://gazaaiddata.netlify.app/.netlify/functions/saveData";

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(result => {
        console.log('Success:', result);
        alert('تم حفظ البيانات بنجاح! شكراً لتعاونكم.');
        
        // إعادة تعيين النموذج
        document.getElementById('familyForm').reset();
        window.location.reload(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء إرسال البيانات. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.\n' + error.message);
    })
    .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
});

// Event Listeners for Next buttons
document.querySelectorAll('.btn-next').forEach((btn, idx) => {
    btn.addEventListener('click', () => nextStep(idx + 2));
});