//const { baremetalsolution } = require("googleapis/build/src/apis/baremetalsolution");

// State management | إدارة الحالة
let currentStep = 1;
const totalSteps = 5;
let wifeCounter = 0;
let childCounter = 0;
let martyrCounter = 0;
const regexIdNumber = /^[4789][0-9]{8}$/; // 422948516
const regexPhoneNumber = /^05[96][0-9]{7}$/; // 0591234567
const regexWhatsappPhoneNumber = /^(00|\+)97[02]5[69][0-9]{7}$/; // 00972591234567

function checkRegex(selectElem, targetRegex){
    console.log("CheckRegex selectElem:",selectElem);
    console.log("CheckRegex targetRegex:",targetRegex);
    switch(targetRegex){
        case 'id':
            if (!regexIdNumber.test(selectElem.value)) {
                selectElem.setCustomValidity("رقم الهوية يجب أن يكون 9 أرقام فقط");
                selectElem.reportValidity();
            } else {
                selectElem.setCustomValidity("");
            }
            break;
        case 'phone':
            if (!regexPhoneNumber.test(selectElem.value)) {
                selectElem.setCustomValidity("رقم الهاتف يجب أن يكون 10 أرقام \nومبدوء 059 او 056");
                selectElem.reportValidity();
            } else {
                selectElem.setCustomValidity("");
            }
            break;
        case 'whatsapp':
            if (!regexWhatsappPhoneNumber.test(selectElem.value)) {
                selectElem.setCustomValidity("رقم الهاتف يجب ان يكون مبدوء ب +972 او +970\nثم رقم الهاتف بدون الصفر في البداية.");
                selectElem.reportValidity();
            } else {
                selectElem.setCustomValidity("");
            }
            break;

        default:
            console.log("Did not find targetRegex:",targetRegex);
    }
}

// Navigation functions | وظائف التنقل
function nextStep(step) {
    if (validateStep(currentStep)) {
        const headSocialStatus = new FormData(document.getElementById('familyForm')).get('headSocialStatus');document.getElementById('headSocialStatus');
    
        console.log('nextStep headSocialStatus:',headSocialStatus);
        console.log('nextStep bef:',step);

        if (step === 2 && ( headSocialStatus === 'male_single_40' || headSocialStatus === 'female_single_40' )){
            step += 3;
        } else if (step === 2 && ( headSocialStatus === 'male_widower' || headSocialStatus === 'male_divorced' || headSocialStatus.includes('female'))) {
            step += 1;
        }
        console.log('nextStep afrer:',step);
        showStep(step);
    }
}

function prevStep(step) {

    const headSocialStatus = new FormData(document.getElementById('familyForm')).get('headSocialStatus');

    console.log('prevStep headSocialStatus:',headSocialStatus);
    console.log('prevStep bef:',step);

    if (step === 4 && ( headSocialStatus === 'male_single_40' || headSocialStatus === 'female_single_40' )){
        step -= 3;
    } else if (step === 2 && ( headSocialStatus === 'male_widower' || headSocialStatus === 'male_divorced' || headSocialStatus.includes('female'))){
        step -= 1;
    }
    console.log('prevStep afrer:',step);

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

        if (!input.value.trim() || !input.checkValidity()) {
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
        console.log("select elem", selectElem)
        console.log("select elem value", selectElem.value)
        const parent = selectElem.closest('.dynamic-card') || selectElem.closest('.section-box');
        const internalTarget = parent ? parent.querySelector('.' + targetId) : null;
        if(internalTarget) {
             internalTarget.style.display = (selectElem.value === 'yes' || selectElem.value === 'other' || selectElem.value.includes('female')) ? 'block' : 'none';
             const inputs = internalTarget.querySelectorAll('input');
             inputs.forEach(i => {
                if(selectElem.value === 'yes' || selectElem.value === 'other' || selectElem.value.includes('female')) {
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
    if (selectElem.value === 'yes' || selectElem.value === 'other' || selectElem.value.includes('female')) {
        target.style.display = 'block';
        target.querySelectorAll('input').forEach(i => i.setAttribute('required', 'true'));
    } else {
        target.style.display = 'none';
        target.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    }
}

function handleSpouseStatus(selectElem, targetId) {
    //console.log("handleSpouseStatus: selectElem",selectElem);
    const target = document.getElementById(targetId);
    //console.log("target:",target);
   if (!target) {
        // Try finding by class inside dynamic cards
        const parent = selectElem.closest('.dynamic-card') || selectElem.closest('.section-box');
        //console.log("parent:",parent);
        const internalTarget = parent ? parent.querySelector('.' + targetId) : null;
        //console.log("internalTarget:",internalTarget);
        if(internalTarget) {
             internalTarget.style.display = (selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') ? 'block' : 'none';
             const inputs = internalTarget.querySelectorAll('input');
             inputs.forEach(i => {
                if(selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') {
                    i.hidden = false;
                    i.setAttribute('required', 'true');
                    console.log("set Attribute show for ",i);
                } else {
                    i.hidden = true; 
                    i.removeAttribute('required');
                    console.log("set Attribute hidden ",i);
                }
            });
        }
        return;
    } 

    if (selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') {
        target.style.display = 'block';
        target.querySelectorAll('input').forEach(i => i.setAttribute('required', 'true'));
    } else {
        target.style.display = 'none';
        target.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    }
}

function handleSocialStatus(selectElem, targetId) {
    //console.log("handleSpouseStatus: selectElem",selectElem);
    const target = document.getElementById(targetId);
    //console.log("target:",target);
   if (!target) {
        // Try finding by class inside dynamic cards
        const parent = selectElem.closest('.dynamic-card') || selectElem.closest('.section-box');
        //console.log("parent:",parent);
        const internalTarget = parent ? parent.querySelector('.' + targetId) : null;
        //console.log("internalTarget:",internalTarget);
        if(internalTarget) {
             internalTarget.style.display = (selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') ? 'block' : 'none';
             const inputs = internalTarget.querySelectorAll('input');
             inputs.forEach(i => {
                if(selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') {
                    i.hidden = false;
                    i.setAttribute('required', 'true');
                    console.log("set Attribute show for ",i);
                } else {
                    i.hidden = true; 
                    i.removeAttribute('required');
                    console.log("set Attribute hidden ",i);
                }
            });
        }
        return;
    } 

    if (selectElem.value === 'martyr' || selectElem.value === 'deceased' || selectElem.value === 'unknownFate') {
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
        const master = btn.closest('.dynamic-card');  //.remove();
        const master_id = master.id;
        console.log("identifying master_id:",master_id);
        switch (master_id[0]){
            case 'w':
                wifeCounter--;
                break;
            case 'c':
                childCounter--;
                break;
            case 'm':
                martyrCounter--;
                break;
            default:
                console.log("can't identify master id:",master_id);
                break;
        }
        master.remove();
    }
}

// ------------------------------------------
// WIVES | الزوجات
// ------------------------------------------
function addWife() {
    if (wifeCounter >= 4){
        alert("لا يمكن إضافة أكثر من 4 زوجات");
        return;
    }
    wifeCounter++;
    const id = generateId();
    // (تم الحفاظ على نفس الحقول كما في النسخة السابقة)
/*
    const content = `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="wives[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="text" name="wives[${id}][id]" required inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group half">
                <label>تاريخ الميلاد</label>
                <input type="date" name="wives[${id}][dob]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهاتف</label>
                <input type="tel" name="wives[${id}][phone]" inputmode="numeric" maxlength="10" onchange="checkRegex(this, 'phone')">
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
            <label>هل تعاني زوجتك من أمراض؟</label>
            <select name="wives[${id}][sick]" onchange="toggleField(this, 'wives[${id}][diseaseDetails]')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>

            <div id="wives[${id}][diseaseDetails]" class="hidden-input"  hidden >
                <label><b>إرفاق صورة عن التقرير الطبي<b>:</label>
                <label class="hint">ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</label>
                <input type="file" name="wives[${id}][diseaseImage]" placeholder="ارفاق صورة">
                <input type="text" name="wives[${id}][diseaseDetails]" placeholder="تفاصيل المرض بوضوح">
            </div>
        </div>

        <div class="form-group">
            <label>هل تعرضت زوجتك لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="wives[${id}][injured]" onchange="toggleField(this, 'wifeInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div class="wifeInjury-${id} hidden-input" hidden >
                <label><b>ادخل بيانات إصابة زوجتك:-</b></label>
                <label class="hint">تاريخ إصابة زوجتك:</label>
                <input type="date" name="wives[${id}][injuryDate]" placeholder="">
                <input type="text" name="wives[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
                <label>إرفاق صورة عن التقرير الطبي:</label>
                <label class="hint">ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</label>
                <input type="file" name="wives[${id}][injuryImage]" placeholder="ارفاق صورة">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group half">
               <label>هل فقدت زوجتك خلال الحرب؟</label>
                <select name="wives[${id}][missing]" onchange="toggleField(this, 'wivesMissing-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="wivesMissing-${id}" class="hidden-input" hidden> 
                    <label class="hint">تاريخ الفقد</label>
                    <input type="date" name="wife[${id}][missingDate]" placeholder="تاريخ الفقد">
                </div>
            </div>
            <div class="form-group half">
                <label>هل أُسرت خلال الحرب؟</label>
                <select name="wives[${id}][prisoner]" onchange="toggleField(this, 'wivesPrison-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="wivesPrison-${id}" class="hidden-input" hidden> 
                    <label>تاريخ الاسر</label>
                    <input type="date" name="wives[${id}][prisonDate]" placeholder="تاريخ الأسر">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>إرفاق صورة الهوية</label>
            <label class="hint">- الهوية الأصلية تشمل السليب بشكل مفرود أو الهوية بدل فاقد (وجه الأول + الوجه الثاني)</label>
            <input type="file" name="wives[${id}][IdImage]" accept="image/*,.pdf">
        </div>
    `;*/
    const content = getWifeById(id);
    document.getElementById('wivesContainer').appendChild(createCard('wife', id, content, `بطاقة الزوجة (${wifeCounter})`));
}

function getWifeById(id){
    return `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="wives[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="text" name="wives[${id}][id]" required inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group half">
                <label>تاريخ الميلاد</label>
                <input type="date" name="wives[${id}][dob]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهاتف</label>
                <input type="tel" name="wives[${id}][phone]" inputmode="numeric" maxlength="10" onchange="checkRegex(this, 'phone')">
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
            <label>هل تعاني زوجتك من أمراض؟</label>
            <select name="wives[${id}][sick]" onchange="toggleField(this, 'wives[${id}][diseaseDetails]')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>

            <div id="wives[${id}][diseaseDetails]" class="hidden-input"  hidden >
                <label><b>إرفاق صورة عن التقرير الطبي<b>:</label>
                <label class="hint">ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</label>
                <input type="file" name="wives[${id}][diseaseImage]" placeholder="ارفاق صورة">
                <input type="text" name="wives[${id}][diseaseDetails]" placeholder="تفاصيل المرض بوضوح">
            </div>
        </div>

        <div class="form-group">
            <label>هل تعرضت زوجتك لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="wives[${id}][injured]" onchange="toggleField(this, 'wifeInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div class="wifeInjury-${id} hidden-input" hidden >
                <label><b>ادخل بيانات إصابة زوجتك:-</b></label>
                <label class="hint">تاريخ إصابة زوجتك:</label>
                <input type="date" name="wives[${id}][injuryDate]" placeholder="">
                <input type="text" name="wives[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
                <label>إرفاق صورة عن التقرير الطبي:</label>
                <label class="hint">ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</label>
                <input type="file" name="wives[${id}][injuryImage]" placeholder="ارفاق صورة">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group half">
               <label>هل فقدت زوجتك خلال الحرب؟</label>
                <select name="wives[${id}][missing]" onchange="toggleField(this, 'wivesMissing-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="wivesMissing-${id}" class="hidden-input" hidden> 
                    <label class="hint">تاريخ الفقد</label>
                    <input type="date" name="wife[${id}][missingDate]" placeholder="تاريخ الفقد">
                </div>
            </div>
            <div class="form-group half">
                <label>هل أُسرت خلال الحرب؟</label>
                <select name="wives[${id}][prisoner]" onchange="toggleField(this, 'wivesPrison-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="wivesPrison-${id}" class="hidden-input" hidden> 
                    <label>تاريخ الاسر</label>
                    <input type="date" name="wives[${id}][prisonDate]" placeholder="تاريخ الأسر">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>إرفاق صورة الهوية</label>
            <label class="hint">- الهوية الأصلية تشمل السليب بشكل مفرود أو الهوية بدل فاقد (وجه الأول + الوجه الثاني)</label>
            <input type="file" name="wives[${id}][IdImage]" accept="image/*,.pdf">
        </div>
    `;
}

// ------------------------------------------
// CHILDREN | الأبناء
// ------------------------------------------
function addChild() {
    if (childCounter >= 10) {
        alert("لا يمكن إضافة أكثر من 10 أبناء في هذا النموذج");
        return;
    }
    childCounter++;
    const id = generateId();
    /*
    const content = `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="children[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="text" name="children[${id}][id]" required inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
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
            <label>هل يعاني ابنك/بنتك من أمراض؟</label>
            <select name="children[${id}][sick]" onchange="toggleField(this, 'childDiseaseDesc-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div id="childDiseaseDesc-${id}" class="hidden-input" hidden >
                <input type="text" name="children[${id}][diseaseDetails]" placeholder="تفاصيل المرض بدقة">
                <div class="form-group">
                    <label>إرفاق صورة عن التقرير الطبي <b>للمرض</b>:</label>
                    <label>ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</lable>
                    <input type="file" accept="image/*,.pdf"">
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>هل تعرض لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="children[${id}][injured]" onchange="toggleField(this, 'childInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div id="childInjury-${id}" class="hidden-input" hidden >
                <label class="hint">تاريخ الإصابة:</label>
                <input type="date" name="children[${id}][injuryDate]">
                <input type="text" name="children[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
            </div>
        </div>

        <div class="form-row">
             <div class="form-group half">
                <label>هل ابنك/بنتك من مفقودين الحرب?</label>
                <select name="children[${id}][missing]" onchange="toggleField(this, 'childMissing-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="childMissing-${id}" class="hidden-input" hidden> 
                    <label class="hint">تاريخ الفقد</label>
                    <input type="date" name="children[${id}][missingDate]" placeholder="تاريخ الفقد">
                </div>
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
    `;*/
    const content = getChildById(id);
    document.getElementById('childrenContainer').appendChild(createCard('child', id, content, `ابن/ابنة (${childCounter})`));
}

function getChildById(id){
    return `
        <div class="form-row">
            <div class="form-group half">
                <label>الاسم الرباعي</label>
                <input type="text" name="children[${id}][name]" required>
            </div>
            <div class="form-group half">
                <label>رقم الهوية</label>
                <input type="text" name="children[${id}][id]" required inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
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
            <label>هل يعاني ابنك/بنتك من أمراض؟</label>
            <select name="children[${id}][sick]" onchange="toggleField(this, 'childDiseaseDesc-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div id="childDiseaseDesc-${id}" class="hidden-input" hidden >
                <input type="text" name="children[${id}][diseaseDetails]" placeholder="تفاصيل المرض بدقة">
                <div class="form-group">
                    <label>إرفاق صورة عن التقرير الطبي <b>للمرض</b>:</label>
                    <label>ويُشترط أن يكون التقرير صادرًا عن جهة طبية معتمدة.</lable>
                    <input type="file" accept="image/*,.pdf"">
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>هل تعرض لإصابة/إعاقة نتيجة الحرب؟</label>
            <select name="children[${id}][injured]" onchange="toggleField(this, 'childInjury-${id}')">
                <option value="no">لا</option>
                <option value="yes">نعم</option>
            </select>
            <div id="childInjury-${id}" class="hidden-input" hidden >
                <label class="hint">تاريخ الإصابة:</label>
                <input type="date" name="children[${id}][injuryDate]">
                <input type="text" name="children[${id}][injuryDesc]" placeholder="طبيعة الإصابة/الإعاقة">
            </div>
        </div>

        <div class="form-row">
             <div class="form-group half">
                <label>هل ابنك/بنتك من مفقودين الحرب?</label>
                <select name="children[${id}][missing]" onchange="toggleField(this, 'childMissing-${id}')">
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                </select>
                <div id="childMissing-${id}" class="hidden-input" hidden> 
                    <label class="hint">تاريخ الفقد</label>
                    <input type="date" name="children[${id}][missingDate]" placeholder="تاريخ الفقد">
                </div>
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
}

// ------------------------------------------
// MARTYRS | الشهداء
// ------------------------------------------
function addMartyr() {
    martyrCounter++;
    const id = generateId();
    /*
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
                </select>
            </div>
            <div class="form-group half">
                <label class="hint">رقم الهوية</label>
                <input type="text" name="martyrs[${id}][id]" inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
            </div>
        </div>
        <div class="form-group">
            <label>تاريخ الاستشهاد</label>
            <input type="date" name="martyrs[${id}][date]" required>
        </div>
    `;*/
    const content = getMartyrById(id);
    document.getElementById('martyrsContainer').appendChild(createCard('martyr', id, content, `شهيد (${martyrCounter})`));
}

function getMartyrById(id){
    return `
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
                </select>
            </div>
            <div class="form-group half">
                <label class="hint">رقم الهوية</label>
                <input type="text" name="martyrs[${id}][id]" inputmode="numeric" maxlength="9" onchange="checkRegex(this, 'id')">
            </div>
        </div>
        <div class="form-group">
            <label>تاريخ الاستشهاد</label>
            <input type="date" name="martyrs[${id}][date]" required>
        </div>
    `;
}

const extractDynamic = (prefix) => {
    const map = {};
    console.log("extractDynamic of ",prefix);
    for(let [key, value] of new FormData(document.getElementById('familyForm')).entries()) {
        if(key.startsWith(prefix + '[')) {
            const match = key.match(new RegExp(`${prefix}\\[(.*?)\\]\\[(.*?)\\]`));
            console.log("match: ", match);
            if(match) {
                const id = match[1];
                const field = match[2];
                if(!map[id]) map[id] = {};
                    if (value === 'yes' || value === 'no')
                        map[id][field] = value === 'yes' ? 'نعم' : 'لا';
                    else
                        //if (prefix === 'martyrs' && id ===  )
                        map[id][field] = value;
                    console.log(`map[${id}][${field}] = ${value}`);
                }
            }
        }
    return map;
};

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
        case "unknownFate":
            headSpouseStatusArb = "غير معروف مصيره";
            break;
        default:  
            headSpouseStatusArb = headSpouseStatus;
    }

    let headJob = formData.get('headJob') === 'other' ? formData.get('headOtherJob') : formData.get('headJob');
    let headJobArb = "";
    switch (headJob){
        case 'worker':
            headJobArb = "عامل";
            break;
        case 'unemployed':
            headJobArb = "عاطل عن العمل";
            break;
        case 'gov_gaza':
            headJobArb = "موظف حكومة غزة";
            break;
        case 'gov_ramallah':
            headJobArb = "موطف حكومة رام الله";
            break;
        case 'unrwa':
            headJobArb = "موطف وكاله";
            break;
        case 'private':
            headJobArb = "موظف قطاع خاص";
            break;
        case 'retired_gaza':
            headJobArb = "متقاعد حكومة غزة";
            break;
        case 'retired_ramallah':
            headJobArb = "متقاعد حكومة رام الله";
            break;
        case 'housewife':
            headJobArb = "ربة بيت";
            break;
        default:
            headJobArb = headJob;
    }

    let currentGov = formData.get('currentGov');
    let currentGovArb = "";
    switch (currentGov){
        case 'north':
            currentGovArb = "شمال غزة";
            break;
        case 'gaza':
            currentGovArb = "غزة";
            break;
        case 'central':
            currentGovArb = "الوسطى";
            break;
        case 'khanyounis':
            currentGovArb = "خانيونس";
            break;
        case 'rafah':
            currentGovArb = "رفح";
            break;
        default:
            currentGovArb = currentGov;
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
                chronic: (formData.get('headHasDisease') == 'yes') ? 'نعم' : 'لا',
                chronicType: formData.get('headDiseaseType'),
                chronicImage: formData.get('headIdImage') || "", //image uri in here
                warInjury: (formData.get('headIsInjured') == 'yes') ? 'نعم' : 'لا',
                injuryDetails: formData.get('headInjuryDesc'),
                injuryDate: formData.get('headInjuryDate'),
                injuryEffect: formData.get('headInjuryEffect')
            },
            job: headJobArb,
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
                gov: currentGovArb,
                city: formData.get('currentCity'),
                neighborhood: formData.get('currentNeighborhood'),
                landmark: formData.get('currentLandmark'),
                type: formData.get('housingType') === 'other' ?   formData.get('housingOtherType') : formData.get('housingType')
            },
            whatsapp: formData.get('whatsapp')
        },
        hasMartyrWife: (formData.get('hasMartyrWife') === 'yes') ? 'نعم' : 'لا',
        wives: [],
        children: [],
        martyrs: []
    };

    // Helper function for nested fields
    /*
    const extractDynamic = (prefix) => {
        const map = {};
        console.log("extractDynamic of ",prefix);
        for(let [key, value] of formData.entries()) {
            if(key.startsWith(prefix + '[')) {
                const match = key.match(new RegExp(`${prefix}\\[(.*?)\\]\\[(.*?)\\]`));
                console.log("match: ", match);
                if(match) {
                    const id = match[1];
                    const field = match[2];
                    if(!map[id]) map[id] = {};
                    if (value === 'yes' || value === 'no')
                        map[id][field] = value === 'yes' ? 'نعم' : 'لا';
                    else
                        //if (prefix === 'martyrs' && id ===  )
                        map[id][field] = value;
                    console.log(`map[${id}][${field}] = ${value}`);
                }
            }
        }
        return Object.values(map);
    };*/

    data.wives = extractDynamic('wives');
    data.children = extractDynamic('children');
    data.martyrs = extractDynamic('martyrs');

    // ----------------------------------------------------
    // SEND DATA TO GOOGLE SHEETS VIA NETLIFY FUNCTION
    // ----------------------------------------------------
    const API_URL = "https://gazaaiddata.netlify.app/.netlify/functions/saveData";

    console.log("sending data to server: ",data);

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

// Save data whenever an input changes
//document.addEventListener('input', function(e) {
//    console.log("Saving field:", e.target.id, e.target.value);
//    if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
//        const inputId = e.target.id || e.target.name; // Use unique ID or name as key
//        console.log("Saving field:", inputId, e.target.value);
//        localStorage.setItem(e.target.id, e.target.value);
//    }
//});

document.addEventListener('input', function(e) {
     if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
         const inputId = e.target.id || e.target.name;
         console.log("Saving field:", inputId, e.target.value);
         
         // Check if the field is a date and store it in the correct format
        if (e.target.type === 'date' && !isValidDate(e.target.value)) {
            console.log('Invalid date format');
            return;  // Prevent saving invalid date
        }

        saveDynamicFieldData('wives');
        saveDynamicFieldData('children');
        saveDynamicFieldData('martyrs');
         
        localStorage.setItem(inputId, e.target.value); // Save to localStorage
     }
});

// Function to validate date format (yyyy-MM-dd)
function isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
}


// Load data when page opens
//window.addEventListener('load', function() {
//    const inputs = document.querySelectorAll('input, select');
//   inputs.forEach(input => {
//        const saved = localStorage.getItem(input.id);
//        if (saved) input.value = saved;
//    });  
//});

window.addEventListener('load', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        const saved = localStorage.getItem(input.id || input.name); // Use unique id or name as key
        console.log("loading input.");
        console.log("input:",input);
        console.log("input.id:",input.id);
        console.log("input.name:",input.name);
        console.log("saved:",saved);
        if (saved) {
            input.value = saved; // Apply saved data to the input field
            const event = new Event('change', { bubbles: true });

            // 4. Dispatch the event
            input.dispatchEvent(event);
        }
    });

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('wives-')){
            loadDynamicFieldData('wives',key);
        } 
        if (key.startsWith('children-')){
            loadDynamicFieldData('children',key);
        } 
        if (key.startsWith('martyrs-')){
            loadDynamicFieldData('martyrs',key);
        } 
    });

});

// Function to save data to localStorage when adding a dynamic field (wife)
/*
function saveDynamicFieldData() {
    const wivesData = [];
    document.querySelectorAll('.wife-card').forEach((card, index) => {
        const wife = {
            name: card.querySelector('[name="wives[' + index + '][name]"]').value,
            id: card.querySelector('[name="wives[' + index + '][id]"]').value,
            dob: card.querySelector('[name="wives[' + index + '][dob]"]').value,
            phone: card.querySelector('[name="wives[' + index + '][phone]"]').value,
            pregnant: card.querySelector('[name="wives[' + index + '][pregnant]"]').value,
            nursing: card.querySelector('[name="wives[' + index + '][nursing]"]').value,
            sick: card.querySelector('[name="wives[' + index + '][sick]"]').value,
            diseaseImage: card.querySelector('[name="wives[' + index + '][diseaseImage]"]').value,
            diseaseDetails: card.querySelector('[name="wives[' + index + '][diseaseDetails]"]').value,
            injured: card.querySelector('[name="wives[' + index + '][injured]"]').value,
            injuryDate: card.querySelector('[name="wives[' + index + '][injuryDate]"]').value,
            injuryDesc: card.querySelector('[name="wives[' + index + '][injuryDesc]"]').value,
            injuryImage: card.querySelector('[name="wives[' + index + '][injuryImage]"]').value,
            missing: card.querySelector('[name="wives[' + index + '][missing]"]').value,
            prisoner: card.querySelector('[name="wives[' + index + '][prisoner]"]').value,
            prisonDate: card.querySelector('[name="wives[' + index + '][prisonDate]"]').value,
            IdImage: card.querySelector('[name="wives[' + index + '][IdImage]"]').value,
        };
        wivesData.push(wife);
    });
    
    // Save the wives data to localStorage
    localStorage.setItem('wives', JSON.stringify(wivesData));
}*/

function saveDynamicFieldData(prefix) {
    const dynamicData = extractDynamic(prefix); // Get dynamic data for the given prefix (wives, children, martyrs)
    let keys = Object.keys(dynamicData);
    
    keys.forEach((key) => {
        console.log(`saving prefix: ${prefix} data`);
        console.log("index:",key);
        console.log("data:",dynamicData[key]);
       
        localStorage.setItem(`${prefix}-${key}`, JSON.stringify(dynamicData[key])); // Save to localStorage 

    });
    //localStorage.setItem(`${prefix}-${}`, JSON.stringify(dynamicData)); // Save to localStorage
}

function loadDynamicFieldData(prefix,id) {

    const savedData = JSON.parse(localStorage.getItem(id));

    if (savedData) {
        savedData.forEach((data, index) => {
            // Create dynamic fields for wives, children, or martyrs
            const container = document.getElementById(prefix + 'Container');
            let content = '';
            let type = '';
            let title = '';
            let id = index
            switch (prefix){
                case 'wives':
                    content = getWifeById(id);
                    wifeCounter++;
                    type = 'wife';
                    title = `بطاقة الزوجة (${wifeCounter})`;
                    break;
                case 'children':
                    content = getChildById(id);
                    childCounter++;
                    type = 'child';
                    title = `ابن/ابنة (${childCounter})`;
                    break;
                case 'martyrs':
                    content = getMartyrById(id);
                    martyrCounter++;
                    type = 'martyr';
                    title = `شهيد (${martyrCounter})`;
                    break;
                
                default:
                    console.log("can't find prefix:",prefix)
                    return;
            }
            //dynamicFieldCard.innerHTML = generateDynamicFieldHTML(prefix, id, data); // Use the appropriate HTML structure for each dynamic field
/*
            const keys = Object.keys(data);
            keys.forEach(key => {
                // Find the element inside dynamicFieldCard based on the id
                const element = dynamicFieldCard.querySelector(`[name="${prefix}[${id}][${key}]"]`); // Use name attribute to find the element

                if (element) {
                    // Set the value for the element, assuming you're working with text input, select, etc.
                    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                        element.value = data[key]; // For input fields or text areas
                    } else {
                        element.textContent = data[key]; // For other elements like spans, divs, etc.
                    }
                }
            });*/

    
            const card = createCard(type, id, content, title);
            container.appendChild(card);

            // Populate the form fields with the saved data
            Object.keys(data).forEach(field => {
                const input = card.querySelector(`[name="${prefix}[${id}][${field}]"]`);
                if (input && !input.type === 'file') {
                    input.value = data[field];
                }
            });
        });
    }
}

function clearLocalStorage() {
    localStorage.clear(); // This will clear all data in localStorage
    console.log("localStorage has been cleared.");
}

// Prevent "Enter" key from submitting the form
document.addEventListener('keydown', function(event) {
  // If the key pressed is "Enter" AND the user is not in a large text area
  if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
    event.preventDefault(); // Stop the default action (Submit)
    return false;
  }
});