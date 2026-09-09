/* =========================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   Extracted from the original single-file website.
   Original inline JavaScript block order is preserved.
   External Supabase/XLSX libraries remain in index.html.
========================================================= */


/* ===== SOURCE SCRIPT BLOCK: inline-script-1 ===== */
/* =====================================================
   GENERAL POPUP
===================================================== */

function openPopup(id){

    const popup = document.getElementById(id);

    if(popup){

        popup.style.display = "block";

        document.body.style.overflow = "hidden";

    }

}


function closePopup(id){

    const popup = document.getElementById(id);

    if(popup){

        popup.style.display = "none";

    }

    document.body.style.overflow = "auto";

}


/* =====================================================
   PHOTO LIGHTBOX + PHOTO SLIDER
===================================================== */

let photoList = [];

let currentPhotoIndex = 0;


/*
   Collect every image which already uses
   openPhoto(this.src).
*/

function buildPhotoList(){

    const images = document.querySelectorAll(
        'img[onclick*="openPhoto"]'
    );

    photoList = [];

    images.forEach(function(img){

        if(img.src){

            photoList.push(img.src);

        }

    });

}


function openPhoto(src){

    buildPhotoList();

    currentPhotoIndex =
        photoList.indexOf(src);

    if(currentPhotoIndex < 0){

        currentPhotoIndex = 0;

        photoList.push(src);

    }

    updatePhoto();

    document.getElementById(
        "photoLightbox"
    ).style.display = "flex";

    document.body.style.overflow = "hidden";

}


function updatePhoto(){

    if(photoList.length === 0){
        return;
    }

    document.getElementById(
        "largePhoto"
    ).src = photoList[currentPhotoIndex];


    document.getElementById(
        "photoCounter"
    ).textContent =
        (currentPhotoIndex + 1) +
        " / " +
        photoList.length;

}


function nextPhoto(){

    if(photoList.length === 0){
        return;
    }

    currentPhotoIndex++;

    if(currentPhotoIndex >= photoList.length){

        currentPhotoIndex = 0;

    }

    updatePhoto();

}


function previousPhoto(){

    if(photoList.length === 0){
        return;
    }

    currentPhotoIndex--;

    if(currentPhotoIndex < 0){

        currentPhotoIndex =
            photoList.length - 1;

    }

    updatePhoto();

}


function closePhoto(){

    document.getElementById(
        "photoLightbox"
    ).style.display = "none";

    document.body.style.overflow = "auto";

}


/* =====================================================
   PHOTO SWIPE ON MOBILE
===================================================== */

let touchStartX = 0;

let touchEndX = 0;


const photoLightbox =
    document.getElementById("photoLightbox");


photoLightbox.addEventListener(
    "touchstart",
    function(event){

        touchStartX =
            event.changedTouches[0].screenX;

    },
    {passive:true}
);


photoLightbox.addEventListener(
    "touchend",
    function(event){

        touchEndX =
            event.changedTouches[0].screenX;

        handlePhotoSwipe();

    },
    {passive:true}
);


function handlePhotoSwipe(){

    const difference =
        touchEndX - touchStartX;


    if(Math.abs(difference) < 50){

        return;

    }


    if(difference < 0){

        nextPhoto();

    }

    else{

        previousPhoto();

    }

}


/* =====================================================
   KEYBOARD PHOTO SLIDER
===================================================== */

document.addEventListener(
    "keydown",
    function(event){

        const lightbox =
            document.getElementById(
                "photoLightbox"
            );


        if(
            lightbox.style.display === "flex"
        ){

            if(event.key === "ArrowRight"){

                nextPhoto();

            }

            if(event.key === "ArrowLeft"){

                previousPhoto();

            }

        }

    }
);




/* =====================================================
   STUDENT PORTFOLIO — FINAL A-Z STUDENT DIRECTORY
===================================================== */
const STUDENT_DIRECTORY = [
    {className:'Nursery', studentId:'NUR001', name:'AAROSH RAI'},
    {className:'Nursery', studentId:'NUR002', name:'AAVASH PRADHAN'},
    {className:'Nursery', studentId:'NUR003', name:'AAYAN BHOLAN'},
    {className:'Nursery', studentId:'NUR004', name:'ALEXA MAHAT'},
    {className:'Nursery', studentId:'NUR005', name:'ALIYAS RAI'},
    {className:'Nursery', studentId:'NUR006', name:'ARINA KATWAL'},
    {className:'Nursery', studentId:'NUR007', name:'BRAYANA TAMANG'},
    {className:'Nursery', studentId:'NUR008', name:'CHHANMI RAI'},
    {className:'Nursery', studentId:'NUR009', name:'DIKSHIT RAI'},
    {className:'Nursery', studentId:'NUR010', name:'KEREN DEWAN'},
    {className:'Nursery', studentId:'NUR011', name:'KRIPA LIMBU'},
    {className:'Nursery', studentId:'NUR012', name:'NAYUHANGMA RAI'},
    {className:'Nursery', studentId:'NUR013', name:'NEIZAN RAI'},
    {className:'Nursery', studentId:'NUR014', name:'NIWAMA RAI'},
    {className:'Nursery', studentId:'NUR015', name:'NUHANG RAI'},
    {className:'Nursery', studentId:'NUR016', name:'NUNGNIMA YAMPHU RAI'},
    {className:'Nursery', studentId:'NUR017', name:'PRAGYA ACHARYA'},
    {className:'Nursery', studentId:'NUR018', name:'PRENA RAI'},
    {className:'Nursery', studentId:'NUR019', name:'PRIYANSH RAI'},
    {className:'Nursery', studentId:'NUR020', name:'REYYAN RAI'},
    {className:'Nursery', studentId:'NUR021', name:'RUHAMA JABEGU'},
    {className:'Nursery', studentId:'NUR022', name:'SAIRA RAI'},
    {className:'Nursery', studentId:'NUR023', name:'SANGAM RAI'},
    {className:'Nursery', studentId:'NUR024', name:'SAPHIRA RAI'},
    {className:'Nursery', studentId:'NUR025', name:'SARA LIMBU'},
    {className:'Nursery', studentId:'NUR026', name:'SHREYANG RAI'},
    {className:'Nursery', studentId:'NUR027', name:'SUYEN LIMBU'},
    {className:'Nursery', studentId:'NUR028', name:'SWARNA RAI'},
    {className:'LKG', studentId:'LKG001', name:'ADITY YONTIMCHHA CHAMBLING RAI'},
    {className:'LKG', studentId:'LKG002', name:'JENI LIMBU'},
    {className:'LKG', studentId:'LKG003', name:'KABYA RIMAL'},
    {className:'LKG', studentId:'LKG004', name:'LADIPMA RAI'},
    {className:'LKG', studentId:'LKG005', name:'NISHANT DHAKAL'},
    {className:'LKG', studentId:'LKG006', name:'PHUNGMA LIMBU'},
    {className:'LKG', studentId:'LKG007', name:'PRIYANSHA LIMBU'},
    {className:'LKG', studentId:'LKG008', name:'SAIME SUNUWAR'},
    {className:'LKG', studentId:'LKG009', name:'SAYAHANG RAI'},
    {className:'LKG', studentId:'LKG010', name:'SAYANSH KHAWAS'},
    {className:'LKG', studentId:'LKG011', name:'SEJASHREE KARKI'},
    {className:'LKG', studentId:'LKG012', name:'SEMIN LAPCHA'},
    {className:'LKG', studentId:'LKG013', name:'SHALVI DAHAL'},
    {className:'LKG', studentId:'LKG014', name:'YADAH RAI'},
    {className:'UKG', studentId:'UKG001', name:'AASHIK PRADHAN'},
    {className:'UKG', studentId:'UKG002', name:'ALISH RAI'},
    {className:'UKG', studentId:'UKG003', name:'AMEJAN PRADHAN'},
    {className:'UKG', studentId:'UKG004', name:'ANUP DHAKAL'},
    {className:'UKG', studentId:'UKG005', name:'ENI CHAMBLING RAI'},
    {className:'UKG', studentId:'UKG006', name:'ETHEN LAYO MAGAR'},
    {className:'UKG', studentId:'UKG007', name:'GRISHAN RAI'},
    {className:'UKG', studentId:'UKG008', name:'KAUSAL RAI'},
    {className:'UKG', studentId:'UKG009', name:'LAXMI RAI'},
    {className:'UKG', studentId:'UKG010', name:'MUKSAM LINGDEN'},
    {className:'UKG', studentId:'UKG011', name:'NAYANSHI RAI'},
    {className:'UKG', studentId:'UKG012', name:'PRISKILA RAI'},
    {className:'UKG', studentId:'UKG013', name:'ROJINA PRADHAN'},
    {className:'UKG', studentId:'UKG014', name:'SANGMU SHERPA'},
    {className:'UKG', studentId:'UKG015', name:'SUMNIMA RAI'},
    {className:'Class 1', studentId:'G1001', name:'AARIYA RAI'},
    {className:'Class 1', studentId:'G1002', name:'ABARAN TIMSINA'},
    {className:'Class 1', studentId:'G1003', name:'ANUPAM RAI'},
    {className:'Class 1', studentId:'G1004', name:'ARJU SINJALI'},
    {className:'Class 1', studentId:'G1005', name:'DANIYEL RAI'},
    {className:'Class 1', studentId:'G1006', name:'DIPSHIKA PRADHAN'},
    {className:'Class 1', studentId:'G1007', name:'HIMANSHI RAI'},
    {className:'Class 1', studentId:'G1008', name:'JENNYFOR ACHARYA'},
    {className:'Class 1', studentId:'G1009', name:'LIYANA RAI'},
    {className:'Class 1', studentId:'G1010', name:'MERCY RAI'},
    {className:'Class 1', studentId:'G1011', name:'PRINCESS RAI'},
    {className:'Class 1', studentId:'G1012', name:'PRINJAL RAI'},
    {className:'Class 1', studentId:'G1013', name:'PRITAM RAI'},
    {className:'Class 1', studentId:'G1014', name:'PRIYANSHI ACHARYA'},
    {className:'Class 1', studentId:'G1015', name:'RHYDAM RAI'},
    {className:'Class 1', studentId:'G1016', name:'RIDAM GHALE'},
    {className:'Class 1', studentId:'G1017', name:'SANGHE TAMANG'},
    {className:'Class 1', studentId:'G1018', name:'SEWAHANG RAI'},
    {className:'Class 1', studentId:'G1019', name:'SUJIN RAI'},
    {className:'Class 1', studentId:'G1020', name:'UMANG RAI'},
    {className:'Class 1', studentId:'G1021', name:'YUMINSA RAI'},
    {className:'Class 2', studentId:'G2001', name:'AAROSH LAPCHA'},
    {className:'Class 2', studentId:'G2002', name:'ABISHNA TAMANG'},
    {className:'Class 2', studentId:'G2003', name:'ANJAL RAI'},
    {className:'Class 2', studentId:'G2004', name:'ELEKSA RAI'},
    {className:'Class 2', studentId:'G2005', name:'GRISH ACHARYA'},
    {className:'Class 2', studentId:'G2006', name:'IMAN TAMANG'},
    {className:'Class 2', studentId:'G2007', name:'JUSAN LIMBU'},
    {className:'Class 2', studentId:'G2008', name:'KAYARA TAMANG'},
    {className:'Class 2', studentId:'G2009', name:'MIHANG RAI'},
    {className:'Class 2', studentId:'G2010', name:'NIHANG RAI'},
    {className:'Class 2', studentId:'G2011', name:'ROHINA PRADHAN'},
    {className:'Class 2', studentId:'G2012', name:'SAMRIDDHI RAI'},
    {className:'Class 2', studentId:'G2013', name:'SAMYOG RAI'},
    {className:'Class 2', studentId:'G2014', name:'SANCHI TAMANG'},
    {className:'Class 2', studentId:'G2015', name:'SANKENMA RAI A'},
    {className:'Class 2', studentId:'G2016', name:'SANKENMA RAI B'},
    {className:'Class 2', studentId:'G2017', name:'SPARSH RAI'},
    {className:'Class 2', studentId:'G2018', name:'YAMIMA RAI'},
    {className:'Class 3', studentId:'G3001', name:'ALJINA TAMANG'},
    {className:'Class 3', studentId:'G3002', name:'APRINA RAI'},
    {className:'Class 3', studentId:'G3003', name:'INSHIKA RAI'},
    {className:'Class 3', studentId:'G3004', name:'JELI SINGALI'},
    {className:'Class 3', studentId:'G3005', name:'KABYA RAI'},
    {className:'Class 3', studentId:'G3006', name:'LARISHA RAI'},
    {className:'Class 3', studentId:'G3007', name:'MIKSHANA LIMBU'},
    {className:'Class 3', studentId:'G3008', name:'NAINA RAI'},
    {className:'Class 3', studentId:'G3009', name:'PALLABI RAI'},
    {className:'Class 3', studentId:'G3010', name:'PRAKRITI RAI'},
    {className:'Class 3', studentId:'G3011', name:'PRIYANSI DHAKAL'},
    {className:'Class 3', studentId:'G3012', name:'RUMIBUNG RAI'},
    {className:'Class 3', studentId:'G3013', name:'RUTH MAGAR'},
    {className:'Class 3', studentId:'G3014', name:'SANGIT PRADHAN'},
    {className:'Class 3', studentId:'G3015', name:'SANJAL RAI'},
    {className:'Class 3', studentId:'G3016', name:'SOFIYAN GURUNG'},
    {className:'Class 3', studentId:'G3017', name:'TRIFONESH SHRESTHA'},
    {className:'Class 3', studentId:'G3018', name:'UNIK MAGAR'},
    {className:'Class 3', studentId:'G3019', name:'YUNA NEPAL'},
    {className:'Class 4', studentId:'G4001', name:'AAYAN LIMBU'},
    {className:'Class 4', studentId:'G4002', name:'ALIPH RAI'},
    {className:'Class 4', studentId:'G4003', name:'ALONE RAI'},
    {className:'Class 4', studentId:'G4004', name:'APSAN RAI'},
    {className:'Class 4', studentId:'G4005', name:'ARIKA KATWAL'},
    {className:'Class 4', studentId:'G4006', name:'BIBIDH RAI'},
    {className:'Class 4', studentId:'G4007', name:'DIPSHIKA RAI'},
    {className:'Class 4', studentId:'G4008', name:'JAYAL LIMBU'},
    {className:'Class 4', studentId:'G4009', name:'JESEE SUNUWAR'},
    {className:'Class 4', studentId:'G4010', name:'KANXAM RAI'},
    {className:'Class 4', studentId:'G4011', name:'MARK DEWAN'},
    {className:'Class 4', studentId:'G4012', name:'NUMAPHUNG RAI'},
    {className:'Class 4', studentId:'G4013', name:'NUMASHA LIMBU'},
    {className:'Class 4', studentId:'G4014', name:'PRAPTI RAI'},
    {className:'Class 4', studentId:'G4015', name:'PRATIK RAI'},
    {className:'Class 4', studentId:'G4016', name:'PRATIT RAI'},
    {className:'Class 4', studentId:'G4017', name:'PRINJAL TAMANG'},
    {className:'Class 4', studentId:'G4018', name:'REHAT RAI'},
    {className:'Class 4', studentId:'G4019', name:'RIDAM RAI'},
    {className:'Class 4', studentId:'G4020', name:'ROHIT RAI'},
    {className:'Class 4', studentId:'G4021', name:'ROJAN PRADHAN'},
    {className:'Class 4', studentId:'G4022', name:'SAMYAM MISHRA'},
    {className:'Class 4', studentId:'G4023', name:'SANKEN RAI'},
    {className:'Class 4', studentId:'G4024', name:'SAPHIKA TAMANG'},
    {className:'Class 4', studentId:'G4025', name:'SEMBUNG RAI'},
    {className:'Class 4', studentId:'G4026', name:'SHRESHA MAGAR'},
    {className:'Class 4', studentId:'G4027', name:'SUHANAG RAI'},
    {className:'Class 4', studentId:'G4028', name:'SURAKSHA RAI'},
    {className:'Class 4', studentId:'G4029', name:'SUSAHANG RAI'},
    {className:'Class 4', studentId:'G4030', name:'WAYANG RAI'},
    {className:'Class 5', studentId:'G5001', name:'AAYUSH PRADHAN'},
    {className:'Class 5', studentId:'G5002', name:'ABHUSAN TIMSINA'},
    {className:'Class 5', studentId:'G5003', name:'BIHAN SIWA'},
    {className:'Class 5', studentId:'G5004', name:'INOJ DEWAN'},
    {className:'Class 5', studentId:'G5005', name:'JUSTINA RAI'},
    {className:'Class 5', studentId:'G5006', name:'KARINA RAI'},
    {className:'Class 5', studentId:'G5007', name:'MANDIP POUDEL'},
    {className:'Class 5', studentId:'G5008', name:'MERIT RAI'},
    {className:'Class 5', studentId:'G5009', name:'MIZON RAI'},
    {className:'Class 5', studentId:'G5010', name:'NIHANGMA RAI'},
    {className:'Class 5', studentId:'G5011', name:'NORDEN TAMANG'},
    {className:'Class 5', studentId:'G5012', name:'PRAKRITI RAI'},
    {className:'Class 5', studentId:'G5013', name:'PRISKILA RAI'},
    {className:'Class 5', studentId:'G5014', name:'RIJAN RAI'},
    {className:'Class 5', studentId:'G5015', name:'RIYAAN RAI'},
    {className:'Class 5', studentId:'G5016', name:'ROJAN PRADHAN'},
    {className:'Class 5', studentId:'G5017', name:'RUTH RAI'},
    {className:'Class 5', studentId:'G5018', name:'SADIKSHYA ACHARYA'},
    {className:'Class 5', studentId:'G5019', name:'SAMANA KHATIWADA'},
    {className:'Class 5', studentId:'G5020', name:'SAMUEL RAI'},
    {className:'Class 5', studentId:'G5021', name:'SASHIBUNG RAI'},
    {className:'Class 5', studentId:'G5022', name:'SEBIKA RAI'},
    {className:'Class 5', studentId:'G5023', name:'SUBIN PRADHAN'},
    {className:'Class 5', studentId:'G5024', name:'SULAV RAI'}
];

function getStudentsByClass(className){
    return STUDENT_DIRECTORY.filter(student => student.className === className);
}

function getStudentRecord(className, studentId){
    return STUDENT_DIRECTORY.find(
        student => student.className === className && student.studentId === studentId
    ) || null;
}

function showStudentRolls(className){
    document.getElementById("studentClassView").style.display = "none";
    const rollView = document.getElementById("studentRollView");
    rollView.style.display = "block";

    const students = getStudentsByClass(className);

    let html = `
        <button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button>
        <h2 class="student-portfolio-title">🎓 ${className} - Student Portfolio</h2>
        <div class="student-grid">
    `;

    students.forEach((student,index) => {
        html += `
            <button class="student-roll-btn"
                onclick="showStudentProfile('${className}','${student.studentId}')">
                ${index+1}. ${student.name}
            </button>
        `;
    });

    html += `</div>`;
    rollView.innerHTML = html;
}

function backToStudentClasses(){
    document.getElementById("studentRollView").style.display = "none";
    document.getElementById("studentRollView").innerHTML = "";
    document.getElementById("studentClassView").style.display = "grid";
}

let pendingStudentClass = "";
let pendingStudentId = "";

function showStudentProfile(className, studentId){
    const student = getStudentRecord(className, studentId);
    if(!student) return;

    pendingStudentClass = className;
    pendingStudentId = studentId;

    /* Admin can open any student profile directly after Supabase admin login.
       Parents/students still need the individual student password. */
    if(studentAdminSession){
        renderStudentProfile(className, studentId);

        const portfolioPopup = document.getElementById("studentPortfolioPopup");
        if(portfolioPopup) portfolioPopup.style.display = "block";

        document.body.style.overflow = "hidden";
        return;
    }

    openStudentPassword(student);
}

function renderStudentProfile(className, studentId){
    const rollView = document.getElementById("studentRollView");
    const student = getStudentRecord(className, studentId);
    if(!student) return;

    const galleryHTML = Array.from({length:12},(_,i)=>{
        const src=`student-photos/${student.studentId}/${i+1}.jpeg`;
        return `
        <div class="student-photo-item" onclick="openStudentPhotoGallery('${student.studentId}',${i})" title="Open monthly report ${i+1}">
            <img src="${src}" alt="${student.name} progress report ${i+1}" loading="lazy" decoding="async"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div class="student-photo-missing" style="display:none;">Month ${i+1}<br>Report not available</div>
            <span class="student-photo-number">${i+1}</span>
        </div>`;
    }).join("");

    rollView.style.display = "block";
    rollView.innerHTML = `
        <button class="student-back-btn" onclick="showStudentRolls('${className}')">← Back to ${className}</button>
        <h2 class="student-portfolio-title">🎓 ${student.name}</h2>
        <div class="student-profile">
            <div class="student-profile-icon">👤</div>
            <h3>${student.name}</h3>
            <div class="student-profile-row"><strong>Student ID:</strong> ${student.studentId}</div>
            <div class="student-profile-row"><strong>Student Name:</strong> ${student.name}</div>
            <div class="student-profile-row"><strong>Class:</strong> ${student.className}</div>
            <div class="student-profile-row"><strong>Date of Birth:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Parent / Guardian:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Academic Performance:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Remarks:</strong> To be updated</div>
            <div class="student-photo-gallery">
                <h4>📊 Progress Reports</h4>
                <div class="student-photo-grid">${galleryHTML}</div>
            </div>
        </div>`;
}

async function openStudentPhotoGallery(studentId,startIndex){
    try{
        const urls=await Promise.all(
            Array.from({length:12},async(_,i)=>{
                const month=i+1;
                return await cloudSignedUrl(
                    cloudPath(studentId,"month",month),
                    900
                );
            })
        );

        currentPhotos=urls;
        currentPhotoIndex=startIndex;

        if(!currentPhotos[currentPhotoIndex]){
            const firstAvailable=currentPhotos.findIndex(Boolean);
            if(firstAvailable===-1){
                uploadStatus("No monthly photo has been uploaded yet.","info");
                return;
            }
            currentPhotoIndex=firstAvailable;
        }

        const lightbox=document.getElementById("photoLightbox");
        const lightboxImg=document.getElementById("lightboxImage");

        if(!lightbox || !lightboxImg){
            console.error("Photo lightbox elements were not found.");
            return;
        }

        lightbox.style.display="flex";
        lightbox.style.position="fixed";
        lightbox.style.inset="0";
        lightbox.style.zIndex="999999";
        lightbox.style.background="rgba(0,0,0,.96)";
        lightbox.style.alignItems="center";
        lightbox.style.justifyContent="center";

        document.body.style.overflow="hidden";

        showCurrentPhoto();
    }catch(error){
        console.error("Could not open student photo:",error);
        uploadStatus("Could not open this photo.","error");
    }
}

let studentAccessFailures = 0;
let studentLockUntil = 0;

function openStudentPassword(student){
    const popup = document.getElementById("studentPasswordPopup");
    const input = document.getElementById("studentPasswordInput");
    const error = document.getElementById("studentPasswordError");

    if(!popup || !input || !error) return;

    const heading = popup.querySelector("h2");
    const hint = popup.querySelector("p");

    if(heading) heading.textContent = "🔐 Student Login";
    if(hint) hint.textContent =
        `${student.name} (${student.studentId}) — enter this student's password.`;

    popup.style.display = "flex";
    input.value = "";
    error.style.display = "none";
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 100);
}

async function checkStudentPassword(){
    const input = document.getElementById("studentPasswordInput");
    const error = document.getElementById("studentPasswordError");
    const popup = document.getElementById("studentPasswordPopup");

    if(!input || !error || !popup) return;

    const now = Date.now();
    if(now < studentLockUntil){
        const seconds = Math.ceil((studentLockUntil - now) / 1000);
        error.textContent = `⏳ Too many attempts. Try again in ${seconds} seconds.`;
        error.style.display = "block";
        return;
    }

    const c=initStudentSupabase();
    if(!c){
        error.textContent = "⚠️ Supabase connection is not available.";
        error.style.display = "block";
        return;
    }

    error.textContent="Checking...";
    error.style.display="block";

    const {data,error:loginError}=await c.rpc("student_login",{
        p_student_id:pendingStudentId,
        p_password:input.value.trim()
    });

    const row=Array.isArray(data)?data[0]:null;

    if(loginError || !row){
        studentAccessFailures++;

        if(studentAccessFailures >= 5){
            studentLockUntil = Date.now() + 30000;
            studentAccessFailures = 0;
            error.textContent =
                "⏳ Too many incorrect attempts. Access is locked for 30 seconds.";
        }else{
            error.textContent =
                `❌ Incorrect Student ID/password. ${5 - studentAccessFailures} attempt(s) remaining.`;
        }

        input.value = "";
        input.focus();
        return;
    }

    /* Keep the authenticated profile only in memory for this page session. */
    const mapped={
        studentId:row.student_id,
        name:row.name,
        className:row.class_name,
        dob:row.dob||"",
        guardian:row.guardian||"",
        performance:row.performance||"",
        remarks:row.remarks||""
    };
    studentAuthenticatedProfiles.set(mapped.studentId,mapped);

    const listIndex=adminManagedStudents.findIndex(s=>s.studentId===mapped.studentId);
    if(listIndex>=0) adminManagedStudents[listIndex]={...adminManagedStudents[listIndex],...mapped};

    studentAccessFailures = 0;
    error.style.display = "none";
    popup.style.display = "none";
    input.value = "";

    renderStudentProfile(pendingStudentClass, pendingStudentId);

    const portfolioPopup = document.getElementById("studentPortfolioPopup");
    if(portfolioPopup) portfolioPopup.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeStudentPassword(){
    const popup = document.getElementById("studentPasswordPopup");
    if(popup) popup.style.display = "none";
    document.body.style.overflow = "auto";
}


/* =====================================================
   MONTHLY REPORT
===================================================== */

function showMonthReport(monthName,fileName){

    document.getElementById("monthButtons").style.display = "none";

    const monthlyPhotos = document.getElementById("monthlyPhotos");
    monthlyPhotos.style.display = "block";

    const monthData =
        (typeof adminManagedMonthlyReports!=="undefined" &&
         adminManagedMonthlyReports[fileName])
            ? adminManagedMonthlyReports[fileName]
            : {
                label:monthName,
                photos:[1,2,3].map(number=>({
                    slot:number,
                    src:`${fileName}${number}.jpeg`,
                    title:`${monthName} - Activity ${number}`
                }))
            };

    const cards=monthData.photos.slice(0,3).map(photo=>`
        <div class="media-card">
            ${
                photo.src
                    ? `<img src="${escapeHtmlAttr(photo.src)}"
                           onclick="openPhoto(this.src)"
                           alt="${escapeHtmlAttr(monthName)} Photo ${photo.slot}"
                           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
                    : `<img style="display:none" alt="">`
            }

            <div class="student-photo-missing"
                 style="${photo.src?'display:none;':'display:flex;'}min-height:180px;">
                ${escapeHtml(monthName)}<br>Photo ${photo.slot}<br>Not uploaded yet
            </div>

            <h3>${escapeHtml(photo.title||`${monthName} - Activity ${photo.slot}`)}</h3>

            <button
                type="button"
                class="admin-inline-edit"
                onclick="chooseMonthlyReportPhoto('${fileName}',${photo.slot})">
                📷 Upload / Replace
            </button>
        </div>
    `).join("");

    monthlyPhotos.innerHTML = `
        <button class="report-back-btn" onclick="backToMonths()">
            ← Back to Months
        </button>

        <h2 class="report-title">
            📊 ${escapeHtml(monthName)} Monthly Report
        </h2>

        <p style="text-align:center;color:#667085;margin:-6px 0 18px;">
            3 monthly report photos
        </p>

        <div class="media-grid">
            ${cards}
        </div>
    `;
}


function backToMonths(){

    document.getElementById("monthlyPhotos").style.display = "none";

    document.getElementById("monthlyPhotos").innerHTML = "";

    document.getElementById("monthButtons").style.display = "grid";

}


/* =====================================================
   STAFF DETAILS DATABASE
===================================================== */

const staffDetails = {

    ceo:{

        name:"SURESH RAI",

        designation:"Chief Executive Officer",

        photo:"ceo.jpeg",

        phone:"9749206863",

        experience:"10 Years",

        about:`
CEO, St. Augustine Academic Foundation.

Education is not just about marks and degrees. It is about building character, confidence, and a sense of unity in diversity.

I founded St. Augustine Academic Foundation with a clear vision: big achievements can come from small hands. I believe every child has the basic and fundamental right to quality education.

As a responsible citizen of my community, I took the initiative to ensure that even underprivileged children get the opportunity to learn to the best of my ability.

With over years of experience in education and leadership, my goal has been to create a learning environment where every student is encouraged to grow, lead, and serve.

My leadership is guided by three core values: Excellence, Integrity, and Service.

I believe that for any long journey, we must choose what is suitable over what is just beautiful. That means investing in strong foundations — in our teachers, our students, and our community here in Tinghare, Suryodaya Municipality-11, Ilam.
`,

        responsibility:`
Provides overall leadership and strategic direction to the institution and supports the overall development of the school.
`

    },


    md:{

        name:"SANJEEV RAI",

        designation:"Managing Director",

        photo:"md.jpeg",

        phone:"9864185122",

        experience:"10 Years",

        about:`
Managing Director, St. Augustine Academic Foundation.

Behind every strong school is strong financial custodianship.

As Managing Director, I am responsible for overseeing the overall income, expenses, and all financial operations of St. Augustine Academic Foundation.

My role is to ensure that every resource is managed with transparency, accountability, and purpose.

I believe that careful management today creates bigger opportunities for our children tomorrow.
`,

        responsibility:`
Responsible for institutional management, planning, development and coordination of the school.
`

    },


    principal:{

        name:"JOSEPH SHANKER",

        designation:"Principal",

        photo:"principal.jpeg",

        phone:"9863983951",

        experience:"10 Years",

        about:`
Message from the Principal’s Desk
It gives me immense pleasure and pride to share that I have been associated with St. Augustine Academic Foundationfor the past 11 years. These years have been a truly rewarding and memorable journey, filled with wonderful experiences, learning, challenges, and countless moments of growth.
During this journey, I have had the privilege of witnessing the dedication of our teachers, the enthusiasm of our students, and the continuous support of our parents and well-wishers. Together, we have built a learning environment that values knowledge, discipline, character, and excellence.
As we move forward, my vision is to take the reputation of St. Augustine Academic Foundation up to the skyand establish our institution as a centre of academic excellence and holistic development. One of my important aspirations is to expand our academic journey by introducing Classes 11 and 12, providing our students with the opportunity to continue their higher secondary education within our own institution.
I firmly believe that education is not merely about academic success; it is about nurturing responsible, confident, compassionate, and capable individuals who can make a positive difference in society.
With the continued support of our dedicated faculty, students, parents, and community, I am confident that St. Augustine Academic Foundation will continue to grow, achieve greater heights, and create an even brighter future.
Let us continue this journey together—with vision, dedication, and the determination to reach the sky.
Warm regards,
Principal
St. Augustine Academic Foundation`,

        responsibility:`
Leads academic activities, supervises teachers, supports students and manages the overall academic administration of the school.
`

    },


    viceprincipal:{

        name:"RANJANA RAI",

        designation:"Vice Principal",

        photo:"vice principal.jpeg",

        phone:"9767777438",

        experience:"10 Years",

        about:`
Vice Principal, St. Augustine Academic Foundation She is the heart of discipline and care at St. Augustine Academic Foundation.

A deeply caring and genuine person, she believes that every child deserves attention, guidance, and a safe place to grow. She works extra hard for weak students, giving them the extra time, encouragement, and support they need to build confidence and succeed.

She takes strong initiative for the discipline and safety of students. From maintaining a positive learning environment to ensuring every child feels respected, her presence brings order, and trust to the school.
`,

        responsibility:`
Supports the Principal in academic and administrative activities and coordinates with teachers and students.
`

    },


    payroll:{

        name:"SAGAR ADHIKARI",

        designation:"Payroll Department",

        photo:"accountant.jpeg",

        phone:"9869854482",

        experience:"12 Years",

        about:`
Accountant, St. Augustine Academic Foundation.

He is the financial backbone of St. Augustine Academic Foundation. Known for his efficiency, he manages the school's accounts with accuracy, transparency, and complete responsibility.

But his role goes far beyond accounting. He takes strong initiative for the welfare of the school and acts as a strong pillar of the institution.

Whether it is accounting or supporting day-to-day operations, he is always ready to contribute to the smooth functioning of the school.

He is not only dedicated to his work, but is always available for the school with an honest heart. Teachers, staff, and management know they can count on him for support, guidance, and solutions.
`,

        responsibility:`
Responsible for payroll-related work, salary records, financial coordination and related administrative responsibilities.
`

    },


    abhishek:{

        name:"ABHISHEK KALIKOTAY",

        designation:"Teacher",

        photo:"teacher1.jpeg",

        subject:"English & Health Education",

        experience:"10 Years",

        about:`
Mr. Abhishek Kalikotay is a dedicated, experienced, and inspiring educator at St. Augustine Academic Foundation. He teaches English and Health Education and brings more than 10 years of teaching experience to his profession. His experience is not limited to Nepal; he has also gained valuable exposure and professional experience abroad, which has broadened his perspective on education, teaching, and student development.

Known for his friendly, cooperative, and supportive nature, Mr. Kalikotay maintains a positive relationship with both students and colleagues. He is actively involved in extracurricular activities and has strong leadership qualities.

From leading school assemblies to guiding and supporting the Captain and prefect. He encourages students to take responsibility, develop confidence, and become responsible young leaders.

He strongly believes that education should go beyond textbooks and classrooms. He motivates students to explore new ideas, learn new skills, participate actively in school activities, and discover their own potential.

Through his experience, leadership, creativity, and dedication, he continues to contribute meaningfully to the academic, personal, and overall development of the students.

His commitment to education, cooperative spirit, leadership ability, and passion for helping children learn and grow make him a valuable and respected member of the St. Augustine Academic Foundation family.
`,

        responsibility:`
Responsible for teaching English and Health Education, classroom management, lesson planning, student guidance, and academic support.

He also actively contributes to school assemblies, extracurricular activities, the Captain and prefect, student leadership development, and various school programs.

He encourages students to learn new things, participate confidently, develop leadership skills, and take responsibility in their school life.
`

    },


    sunyata:{
        name:"SUNYATA RAI",
        designation:"Teacher",
        photo:"sunyata.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Sunyata Rai is a dedicated and responsible teacher at St. Augustine Academic Foundation. She is committed to supporting students in their academic learning and overall development.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    sushma:{
        name:"SUSHMA RAI",
        designation:"Teacher",
        photo:"sushma.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Ms.Sushma Rai is a passionate Nepali language teacher known for her excellent command over grammar, literature, and spoken Nepali.She teaches Nepali with love for the language and helps students speak, read, and write beautifully.  Beyond the classroom, she is very active in sports and takes great responsibility in guiding and training students for various athletic events.  
With her energetic, disciplined, and supportive nature, she inspires students to excel both academically and in sports.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    kritika:{
        name:"KRITIKA MAGAR",
        designation:"Teacher",
        photo:"kritika.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Ms. Kritika Magar is a well-qualified and dedicated educator with a strong academic foundation in the Nepali language and Social Studies.  
With deep knowledge of language, literature, and social values, she is most eligible to guide students in understanding both culture and society.  
She is known for her decency, kindness, and polite nature. Ms Kritika is a genuine person who fulfills every commitment and responsibility with sincerity.  She is always ready to give her best whenever the school requires, without any excuse. Her dedication and integrity make her a valued member of our teaching team.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    amisha:{
        name:"AMISHA RAI",
        designation:"Teacher",
        photo:"amisha.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Mrs.Amisha Rai is a well-qualified and dedicated educator with strong expertise in English. She lays a strong foundation of language, grammar, and communication skills for junior classes, ensuring every child gains confidence from the very beginning. Creative and joyful, she always finds innovative ways to make teaching and the classroom interesting and engaging.  What truly sets her apart is the value she gives to every student's presence and existence. She makes each child feel seen, heard, and important.  
Mrs.Amisha is always eager to contribute new ideas for the growth of students and the welfare of the school.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    swastika:{
        name:"SWASTIKA LIMBU",
        designation:"Teacher",
        photo:"swastika.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Swastika Limbu is a dedicated teacher at St. Augustine Academic Foundation. She is committed to providing students with a supportive and engaging learning environment.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    sanjaya:{
        name:"SANJAYA RAI",
        designation:"Teacher",
        photo:"sanjaya.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Mr. Sanjaya Rai is a dedicated Mathematics teacher known for his strong subject expertise and deep knowledge of financial management.  He believes learning should go beyond textbooks. He gives students practical lessons on budgeting, saving, investing, and real-life money management to prepare them for the future.  He is an active participant in all school activities and events, and is admired by students and colleagues for being polite, kind, and honest in his work. His commitment to both academic excellence and character building makes him a true role model.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    sujata:{
        name:"SUJATA RAI",
        designation:"Teacher",
        photo:"sujata.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Mrs Sujata Rai is a teacher with a truly caring heart.  She takes care of every child like her own and pays attention to each student's needs, comfort, and belongings. With her caring heart, she makes sure every child is comfortable, safe, and has everything they need.  
From notebooks to water bottles, she notices and takes care of every little thing. Her kindness, patience, and sense of responsibility make the classroom feel safe and homely for all kids.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    shekhar:{
        name:"SHEKHAR KUMAR ACHARYA",
        designation:"Teacher",
        photo:"shekhar.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Shekhar Kumar Acharya is a dedicated teacher at St. Augustine Academic Foundation. He is committed to effective teaching and the overall development of students.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    padam:{
        name:"PADAM KARKI",
        designation:"Teacher",
        photo:"padam.jpeg",
        subject:"Mathematics",
        experience:"25 Years",
        about:`
Mr. Padam Karki is a dedicated and enthusiastic Mathematics educator committed to making mathematical concepts clear, practical, and engaging for students.

He encourages students to develop logical thinking, problem-solving skills, and confidence in Mathematics through interactive and student-centered learning.

With a focus on building strong mathematical foundations, he supports students in understanding concepts, applying their knowledge to real-life situations, and developing a positive attitude toward learning Mathematics.

His commitment to students’ academic progress and overall development makes him a valuable member of the teaching team at St. Augustine Academic Foundation.
`,
        responsibility:`Responsible for teaching Mathematics, classroom management, student guidance, problem-solving activities and academic development.`
    },


    rufina:{
        name:"RUFINA PRADHAN",
        designation:"Teacher",
        photo:"rufina.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Rufina Pradhan is a dedicated teacher at St. Augustine Academic Foundation. She is committed to supporting students in their academic and personal development.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    liza:{
        name:"LIZA RAI",
        designation:"Teacher",
        photo:"liza.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Liza Rai is a dedicated teacher at St. Augustine Academic Foundation. She is committed to providing students with a positive and supportive learning environment.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    kalpana:{
        name:"KALPANA RAI",
        designation:"Teacher",
        photo:"kalpana.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Kalpana Rai is a dedicated teacher at St. Augustine Academic Foundation. She supports students in their academic learning and overall development.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    punita:{
        name:"PUNITA RAI",
        designation:"Teacher",
        photo:"punita.jpeg",
        subject:"Subject to be updated",
        experience:"5 Years",
        about:`Punita Rai is a dedicated teacher at St. Augustine Academic Foundation. She is committed to helping students learn, grow and participate actively in school activities.`,
        responsibility:`Responsible for teaching, classroom management, student guidance and academic activities.`
    },


    devi:{
        name:"DEVI MAYA TAMANG",
        designation:"School Support Staff",
        photo:"devi.jpeg",
        experience:"5 Years",
        about:`Devi Maya Tamang is a dedicated School Support Staff member at St. Augustine Academic Foundation.

She is committed to supporting the school environment and helping students and teachers whenever needed.

Her cooperative nature and dedication contribute positively to the smooth functioning of the school.`,
        responsibility:`Responsible for supporting daily school activities, assisting students and teachers, maintaining a supportive school environment and contributing to various school programs.`
    },


    lila:{
        name:"LILA RAI",
        designation:"School Support Staff",
        photo:"lila.jpeg",
        experience:"5 Years",
        about:`Lila Rai is a dedicated School Support Staff member at St. Augustine Academic Foundation.

She is committed to supporting the school community and contributing to a safe, friendly and positive learning environment.`,
        responsibility:`Responsible for supporting daily school activities, assisting students and teachers, helping with school programs and contributing to the smooth operation of the school.`
    },


    sabina:{
        name:"SABINA LIMBU",
        designation:"School Support Staff",
        photo:"sabina.jpeg",
        experience:"5 Years",
        about:`Sabina Limbu is a dedicated School Support Staff member at St. Augustine Academic Foundation.

She is committed to supporting students, teachers and the school community through her responsible and cooperative work.`,
        responsibility:`Responsible for supporting daily school activities, assisting students and teachers, helping during school programs and maintaining a positive school environment.`
    },


    amit:{
        name:"AMIT RAI",
        designation:"Driver",
        photo:"amit.jpeg",
        experience:"5 Years",
        about:`Amit Rai is a responsible and dedicated Driver at St. Augustine Academic Foundation.

He is committed to providing safe, careful and reliable transportation support for the school community.`,
        responsibility:`Responsible for safe school transportation, vehicle care, following traffic and safety rules, and supporting transportation-related school activities.`
    },


    bhupendra:{
        name:"BHUPENDRA RAI",
        designation:"Driver",
        photo:"bhupendra.jpeg",
        experience:"5 Years",
        about:`Bhupendra Rai is a responsible and dedicated Driver at St. Augustine Academic Foundation.

He is committed to ensuring safe and reliable transportation and supporting the school whenever transportation services are required.`,
        responsibility:`Responsible for safe school transportation, vehicle care, following traffic and safety rules, and supporting transportation-related school activities.`
    }

};


/* =====================================================
   SHOW STAFF DETAILS
===================================================== */

function showStaffDetails(staffId){

    const staff = staffDetails[staffId];

    if(!staff){

        console.error("Staff not found:",staffId);

        return;

    }


    document.getElementById("staffDetailPhoto").src =
        staff.photo;


    document.getElementById("staffDetailName").textContent =
        staff.name;


    document.getElementById("staffDetailDesignation").textContent =
        staff.designation;


    if(staff.designation === "Teacher"){

        document.getElementById("staffDetailPhone").innerHTML =
            "<strong>📚 Subject:</strong> " +
            staff.subject;

        document.getElementById("staffDetailPhone").style.display =
            "block";

    }

    else if(
        staff.designation === "Chief Executive Officer" ||
        staff.designation === "Managing Director" ||
        staff.designation === "Principal" ||
        staff.designation === "Vice Principal" ||
        staff.designation === "Payroll Department"
    ){

        document.getElementById("staffDetailPhone").innerHTML =
            "<strong>📞 Contact:</strong> " +
            staff.phone;

        document.getElementById("staffDetailPhone").style.display =
            "block";

    }

    else{

        document.getElementById("staffDetailPhone").innerHTML =
            "";

        document.getElementById("staffDetailPhone").style.display =
            "none";

    }


    document.getElementById("staffDetailExperience").innerHTML =
        "<strong>💼 Experience:</strong> " +
        staff.experience;


    document.getElementById("staffDetailAbout").innerHTML =
        "<strong>👤 About:</strong><br>" +
        staff.about.replace(/\n/g,"<br>");


    document.getElementById("staffDetailResponsibility").innerHTML =
        "<strong>📋 Responsibilities:</strong><br>" +
        staff.responsibility.replace(/\n/g,"<br>");


    /* =====================================================
       PAYROLL LINKS - ONLY FOR SAGAR ADHIKARI
    ===================================================== */

    const payrollLinks =
        document.getElementById("payrollLinks");

    if(staffId === "payroll"){

        payrollLinks.style.display = "flex";

        document.getElementById("payrollWhatsApp").href =
            "https://wa.me/9779869854482";

        document.getElementById("payrollGmail").href =
            "mailto:sagar.godak1@gmail.com";

        document.getElementById("payrollFacebook").href =
            "https://www.facebook.com/sagar.adhikari.706126";

    }

    else{

        payrollLinks.style.display = "none";

    }


    document.getElementById("staffDetailsPage").style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   BACK TO STAFF
===================================================== */

function backToStaffInformation(){

    document.getElementById("staffDetailsPage").style.display =
        "none";

    document.getElementById("staffPopup").style.display =
        "block";

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   NIGHT MODE / LIGHT MODE
===================================================== */

function toggleTheme(){

    document.body.classList.toggle("dark-mode");


    const isDark =
        document.body.classList.contains("dark-mode");


    const button =
        document.getElementById("themeToggle");


    if(isDark){

        button.textContent = "☀️";

        localStorage.setItem(
            "schoolTheme",
            "dark"
        );

    }

    else{

        button.textContent = "🌙";

        localStorage.setItem(
            "schoolTheme",
            "light"
        );

    }

}


/* =====================================================
   LOAD SAVED THEME
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const savedTheme =
            localStorage.getItem("schoolTheme");


        if(savedTheme === "dark"){

            document.body.classList.add(
                "dark-mode"
            );

            document.getElementById(
                "themeToggle"
            ).textContent = "☀️";

        }

        else{

            document.getElementById(
                "themeToggle"
            ).textContent = "🌙";

        }

    }
);


/* =====================================================
   STUDENT PASSWORD ENTER KEY
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    const input = document.getElementById("studentPasswordInput");

    if(input){
        input.addEventListener("keydown", function(event){
            if(event.key === "Enter"){
                checkStudentPassword();
            }
        });
    }
});


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener("keydown",function(event){

    if(event.key === "Escape"){

        document.querySelectorAll(".popup").forEach(function(popup){

            popup.style.display = "none";

        });


        document.getElementById("staffDetailsPage").style.display =
            "none";


        closePhoto();


        document.body.style.overflow =
            "auto";

    }

});


/* =====================================================
   CLICK OUTSIDE POPUP
===================================================== */

document.querySelectorAll(".popup").forEach(function(popup){

    popup.addEventListener("click",function(event){

        if(event.target === popup){

            popup.style.display = "none";

            document.body.style.overflow = "auto";

        }

    });

});


/* =====================================================
   ONLY ONE VIDEO PLAYS
===================================================== */

const videos = document.querySelectorAll("video");

videos.forEach(function(video){

    video.addEventListener("play",function(){

        videos.forEach(function(otherVideo){

            if(otherVideo !== video){

                otherVideo.pause();

            }

        });

    });

});


/* =====================================================
   REBUILD PHOTO LIST AFTER DYNAMIC MONTHLY PHOTOS
===================================================== */

document.addEventListener(
    "click",
    function(event){

        if(
            event.target &&
            event.target.tagName === "IMG" &&
            event.target.getAttribute("onclick") &&
            event.target.getAttribute("onclick").includes("openPhoto")
        ){

            setTimeout(function(){

                buildPhotoList();

            },100);

        }

    }
);

/* ===== SOURCE SCRIPT BLOCK: inline-script-2 ===== */
/* =====================================================
   MOBILE NAVIGATION + ACCESSIBILITY HELPERS
===================================================== */
function toggleMobileMenu(){
    const nav=document.getElementById('mainNav');
    const btn=document.getElementById('menuToggle');
    if(!nav || !btn) return;
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
    btn.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    btn.textContent=open?'✕':'☰';
}

function closeMobileMenu(){
    const nav=document.getElementById('mainNav');
    const btn=document.getElementById('menuToggle');
    if(nav) nav.classList.remove('open');
    if(btn){btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Open navigation menu');btn.textContent='☰';}
}

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',closeMobileMenu));
    document.querySelectorAll('img').forEach(img=>{
        if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
        if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    });

    const studentPasswordInput=document.getElementById('studentPasswordInput');
    if(studentPasswordInput){
        studentPasswordInput.addEventListener('keydown',e=>{
            if(e.key==='Enter'){e.preventDefault();checkStudentPassword();}
        });
    }
});

document.addEventListener('keydown',e=>{
    if(e.key!=='Escape') return;
    closeMobileMenu();
    document.querySelectorAll('.popup,.student-password-popup,.staff-details-page,.photo-lightbox').forEach(el=>{
        if(getComputedStyle(el).display!=='none') el.style.display='none';
    });
    document.body.style.overflow='auto';
});

window.addEventListener('resize',()=>{
    if(window.innerWidth>768) closeMobileMenu();
});

/* ===== SOURCE SCRIPT BLOCK: saaf-final-form-submit-handler ===== */
(function(){
    /*
      Reliable FormSubmit mode:
      - Do NOT intercept with fetch/AJAX.
      - Browser submits the form directly to FormSubmit.
      - This avoids the previous false "Submission Failed" caused by fetch/CORS.
    */
    const forms = [
        {
            formId:"admissionForm",
            buttonId:"admissionSubmit",
            statusId:"admissionStatus",
            next:"https://staugustine.edu.np/?form=admission&submitted=1"
        },
        {
            formId:"reviewForm",
            buttonId:"reviewSubmit",
            statusId:"reviewStatus",
            next:"https://staugustine.edu.np/?form=rating&submitted=1"
        },
        {
            formId:"suggestionFeedbackForm",
            buttonId:"suggestionFeedbackSubmit",
            statusId:"suggestionFeedbackStatus",
            next:"https://staugustine.edu.np/?form=feedback&submitted=1"
        }
    ];

    function ensureHidden(form,name,value){
        let input=form.querySelector(`input[name="${name}"]`);
        if(!input){
            input=document.createElement("input");
            input.type="hidden";
            input.name=name;
            form.appendChild(input);
        }
        input.value=value;
    }

    forms.forEach(config=>{
        const form=document.getElementById(config.formId);
        const button=document.getElementById(config.buttonId);
        const status=document.getElementById(config.statusId);

        if(!form || !button) return;

        form.action="https://formsubmit.co/staugustineacademicfoundation@gmail.com";
        form.method="POST";

        ensureHidden(form,"_template","table");
        ensureHidden(form,"_captcha","false");
        ensureHidden(form,"_next",config.next);

        form.addEventListener("submit",function(event){
            if(!form.checkValidity()){
                event.preventDefault();
                form.reportValidity();
                return;
            }

            button.disabled=true;
            button.textContent="Submitting...";

            if(status){
                status.className="form-submit-status";
                status.style.display="block";
                status.textContent="Submitting securely...";
            }

            /* Native form submission continues normally from here. */
        });
    });

    /* Show a friendly confirmation after FormSubmit redirects back. */
    const params=new URLSearchParams(window.location.search);
    if(params.get("submitted")==="1" && params.get("form")!=="leave"){
        const formType=params.get("form")||"form";

        setTimeout(()=>{
            alert(
                formType==="admission"
                    ?"✓ Admission application submitted successfully."
                    :formType==="rating"
                    ?"✓ Rating submitted successfully."
                    :"✓ Suggestion / feedback submitted successfully."
            );

            if(window.history && window.history.replaceState){
                window.history.replaceState({},document.title,window.location.pathname+window.location.hash);
            }
        },250);
    }
})();

/* ===== SOURCE SCRIPT BLOCK: student-portfolio-cloud-upload ===== */
/* =========================================================
   STUDENT PORTFOLIO — ADMIN-ONLY SUPABASE PHOTO UPLOAD
   Change ONLY these two placeholder values after Supabase setup.
========================================================= */
/* PRIVATE BUCKET NOTE: authenticated users need SELECT policy on storage.objects for bucket_id='student-reports'. */
const STUDENT_STORAGE_CONFIG={
    url:"https://yxecklijkcaxrfshpzna.supabase.co",
    anonKey:"sb_publishable_7q0fv4SbCVs_AHARyWPvZQ_YvzCvbfI",
    bucket:"student-reports"
};
const WEBSITE_ADMIN_EMAIL="sagar.godak1@gmail.com";

let studentSupabase=null;
let studentAdminSession=null;
let studentUploadTarget=null;
let activeStudentPortfolio=null;
const studentSignedUrlCache=new Map();

function studentStorageConfigured(){
    return STUDENT_STORAGE_CONFIG.url &&
           STUDENT_STORAGE_CONFIG.anonKey &&
           !STUDENT_STORAGE_CONFIG.url.includes("PASTE_YOUR_") &&
           !STUDENT_STORAGE_CONFIG.anonKey.includes("PASTE_YOUR_");
}

function initStudentSupabase(){
    if(studentSupabase) return studentSupabase;
    if(!studentStorageConfigured()) return null;
    if(!window.supabase || !window.supabase.createClient) return null;
    studentSupabase=window.supabase.createClient(
        STUDENT_STORAGE_CONFIG.url,
        STUDENT_STORAGE_CONFIG.anonKey,
        {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
    );
    return studentSupabase;
}

function isWebsiteAdminSession(session){
    return String(session?.user?.email||"").trim().toLowerCase()===WEBSITE_ADMIN_EMAIL;
}

function setStudentAdminUI(isAdmin,email=""){
    document.body.classList.toggle("student-admin-mode",!!isAdmin);
    const login=document.getElementById("studentAdminLoginButton");
    const logout=document.getElementById("studentAdminLogoutButton");
    const state=document.getElementById("studentAdminState");
    if(login) login.style.display=isAdmin?"none":"inline-block";
    if(logout) logout.style.display=isAdmin?"inline-block":"none";
    if(state){
        state.classList.toggle("active",!!isAdmin);
        state.textContent=isAdmin?`Admin mode${email?" — "+email:""}`:"View only";
    }
}

function adminMessage(message,type="error"){
    const el=document.getElementById("studentAdminMessage");
    if(!el) return;
    el.textContent=message;
    el.className=`student-admin-message show ${type}`;
}
function clearAdminMessage(){
    const el=document.getElementById("studentAdminMessage");
    if(el){el.textContent="";el.className="student-admin-message";}
}
function openStudentAdminLogin(){
    if(!studentStorageConfigured()){
        alert("Photo storage is ready in the code but not connected yet. Add your Supabase Project URL and anon key first.");
        return;
    }
    clearAdminMessage();
    const p=document.getElementById("studentAdminPopup");
    if(p) p.style.display="flex";
    document.body.style.overflow="hidden";
}
function closeStudentAdminLogin(){
    const p=document.getElementById("studentAdminPopup");
    if(p) p.style.display="none";
    const adminPanelOpen=document.getElementById("websiteAdminPanel")?.style.display==="block";
    const portfolioOpen=document.getElementById("studentPortfolioPopup")?.style.display==="block";
    document.body.style.overflow=(adminPanelOpen||portfolioOpen)?"hidden":"auto";
}
async function studentAdminLogin(){
    const c=initStudentSupabase();
    if(!c){adminMessage("Supabase is not configured yet.");return;}
    const email=(document.getElementById("studentAdminEmail")?.value.trim()||"").toLowerCase();
    const password=document.getElementById("studentAdminPassword")?.value||"";
    if(!email||!password){adminMessage("Enter admin email and password.");return;}
    if(email!==WEBSITE_ADMIN_EMAIL){adminMessage("This account is not authorized for website administration.");return;}
    adminMessage("Signing in...","success");
    const {data,error}=await c.auth.signInWithPassword({email,password});
    if(error||!data.session||!isWebsiteAdminSession(data.session)){
        if(data?.session) await c.auth.signOut();
        adminMessage("Admin login failed. Check email/password.");
        return;
    }
    studentAdminSession=data.session;
    setStudentAdminUI(true,data.user?.email||email);

    await loadAdminStudentsFromSupabase();

    const pw=document.getElementById("studentAdminPassword"); if(pw) pw.value="";
    closeStudentAdminLogin();
    if(activeStudentPortfolio) renderStudentProfile(activeStudentPortfolio.className,activeStudentPortfolio.studentId);
}
async function studentAdminLogout(){
    const c=initStudentSupabase();
    if(c) await c.auth.signOut();
    studentAdminSession=null;
    setStudentAdminUI(false);
    await loadPublicStudentsFromSupabase();
    if(activeStudentPortfolio) renderStudentProfile(activeStudentPortfolio.className,activeStudentPortfolio.studentId);
}

function cloudPath(studentId,type,month=null){
    return type==="profile"
        ?`students/${studentId}/profile.jpg`
        :`students/${studentId}/month-${month}.jpg`;
}
async function cloudSignedUrl(path,expiresIn=900){
    const c=initStudentSupabase();
    if(!c) return "";

    const cacheKey=`${path}:${expiresIn}`;
    const cached=studentSignedUrlCache.get(cacheKey);

    if(cached && cached.expiresAt>Date.now()+30000){
        return cached.url;
    }

    const {data,error}=await c.storage
        .from(STUDENT_STORAGE_CONFIG.bucket)
        .createSignedUrl(path,expiresIn);

    if(error || !data || !data.signedUrl){
        return "";
    }

    studentSignedUrlCache.set(cacheKey,{
        url:data.signedUrl,
        expiresAt:Date.now()+(expiresIn*1000)
    });

    return data.signedUrl;
}
function staticUrl(studentId,type,month=null){
    return type==="profile"
        ?`student-photos/${studentId}/profile.jpeg`
        :`student-photos/${studentId}/${month}.jpeg`;
}
async function loadPrivateStudentPhoto(img,missing,studentId,type,month=null){
    if(!img) return;

    const path=cloudPath(studentId,type,month);
    const signed=await cloudSignedUrl(path,900);

    if(signed){
        img.onerror=()=>{
            img.style.display="none";
            if(missing) missing.style.display="flex";
        };
        img.onload=()=>{
            img.style.display="block";
            if(missing) missing.style.display="none";
        };
        img.src=signed;
        return;
    }

    /* Optional legacy local fallback only if Supabase is not configured. */
    if(!studentStorageConfigured()){
        img.onerror=()=>{
            img.style.display="none";
            if(missing) missing.style.display="flex";
        };
        img.onload=()=>{
            img.style.display="block";
            if(missing) missing.style.display="none";
        };
        img.src=staticUrl(studentId,type,month);
        return;
    }

    img.style.display="none";
    if(missing) missing.style.display="flex";
}

async function bindPortfolioImages(student){
    const ph=document.getElementById("studentProfilePhotoHost");
    if(ph){
        ph.innerHTML='<div class="student-main-photo-wrap"><img id="studentMainPhoto" class="student-main-photo" loading="lazy" decoding="async"><div id="studentMainPhotoMissing" class="student-main-photo-placeholder" style="display:none">👤</div></div>';

        await loadPrivateStudentPhoto(
            document.getElementById("studentMainPhoto"),
            document.getElementById("studentMainPhotoMissing"),
            student.studentId,
            "profile"
        );
    }

    const monthImages=Array.from(document.querySelectorAll("[data-student-month-photo]"));

    await Promise.all(
        monthImages.map(async img=>{
            const month=Number(img.dataset.month);
            const missing=img.parentElement?.querySelector(".student-photo-missing");

            await loadPrivateStudentPhoto(
                img,
                missing,
                student.studentId,
                "month",
                month
            );
        })
    );
}

function renderStudentProfile(className,studentId){
    const rollView=document.getElementById("studentRollView");
    const student=getStudentRecord(className,studentId);
    if(!student||!rollView) return;
    activeStudentPortfolio={className,studentId};

    const galleryHTML=Array.from({length:12},(_,i)=>{
        const m=i+1;
        return `<div class="student-photo-item">
            <img data-student-month-photo data-month="${m}" alt="${student.name} Month ${m} progress photo" loading="lazy" decoding="async" onclick="openStudentPhotoGallery('${student.studentId}',${i})">
            <div class="student-photo-missing" style="display:none;">Month ${m}<br>Photo not uploaded yet</div>
            <span class="student-month-label">Month ${m}</span>
            <button type="button" class="student-photo-upload-btn" onclick="event.stopPropagation();chooseStudentPortfolioPhoto('${student.studentId}','month',${m})">Add / Update</button>
        </div>`;
    }).join("");

    rollView.style.display="block";
    rollView.innerHTML=`
        <button class="student-back-btn" onclick="showStudentRolls('${className}')">← Back to ${className}</button>
        <h2 class="student-portfolio-title">🎓 ${student.name}</h2>
        <div class="student-profile">
            <div id="studentProfilePhotoHost"></div>
            <div class="student-profile-photo-admin">
                <button type="button" class="student-admin-login-btn" onclick="chooseStudentPortfolioPhoto('${student.studentId}','profile')">📷 Add / Update Student Photo</button>
            </div>
            <h3>${student.name}</h3>
            <div class="student-profile-row"><strong>Student ID:</strong> ${student.studentId}</div>
            <div class="student-profile-row"><strong>Student Name:</strong> ${student.name}</div>
            <div class="student-profile-row"><strong>Class:</strong> ${student.className}</div>
            <div class="student-profile-row"><strong>Date of Birth:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Parent / Guardian:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Academic Performance:</strong> To be updated</div>
            <div class="student-profile-row"><strong>Remarks:</strong> To be updated</div>
            <div class="student-photo-gallery">
                <h4>📊 Monthly Progress Photos</h4>
                <div class="student-photo-grid">${galleryHTML}</div>
            </div>
            <div id="studentUploadProgress" class="student-upload-progress" role="status" aria-live="polite"></div>
        </div>`;
    bindPortfolioImages(student).catch(err=>console.error('Student photo display error:',err));
}

function ensureStudentUploadStatusBox(){
    let el=document.getElementById("studentUploadProgress");

    if(!el){
        const profile=document.querySelector("#studentRollView .student-profile");
        if(profile){
            el=document.createElement("div");
            el.id="studentUploadProgress";
            el.className="student-upload-progress";
            el.setAttribute("role","status");
            el.setAttribute("aria-live","polite");
            profile.appendChild(el);
        }
    }
    return el;
}

function uploadStatus(message,type="info"){
    const el=ensureStudentUploadStatusBox();
    if(!el) return;
    el.textContent=message;
    el.className=`student-upload-progress show ${type}`;
    el.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function chooseStudentPortfolioPhoto(studentId,type,month=null){
    if(!studentAdminSession){
        openStudentAdminLogin();
        return;
    }

    /*
      Create a fresh file input every time.
      This is more reliable than reusing one hidden input and guarantees
      that selecting the same photo twice still triggers a change event.
    */
    const picker=document.createElement("input");
    picker.type="file";
    picker.accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*";
    picker.style.position="fixed";
    picker.style.left="-9999px";
    picker.style.opacity="0";
    document.body.appendChild(picker);

    picker.addEventListener("change",async()=>{
        const file=picker.files && picker.files[0];

        if(!file){
            picker.remove();
            return;
        }

        studentUploadTarget={studentId,type,month};

        try{
            await uploadStudentPortfolioFile(file,{studentId,type,month});
        }finally{
            studentUploadTarget=null;
            picker.remove();
        }
    },{once:true});

    picker.click();
}

function loadImageForCompression(file){
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();

        reader.onerror=()=>reject(new Error("Could not read the selected photo."));
        reader.onload=()=>{
            const img=new Image();
            img.onload=()=>resolve(img);
            img.onerror=()=>reject(new Error("This image format could not be opened in the browser."));
            img.src=reader.result;
        };

        reader.readAsDataURL(file);
    });
}

async function compressStudentPhoto(file){
    /*
      Browser-compatible compressor.
      Falls back to the original file if the browser cannot decode it.
    */
    try{
        const img=await loadImageForCompression(file);
        const max=1600;

        let w=img.naturalWidth || img.width;
        let h=img.naturalHeight || img.height;

        if(!w || !h) throw new Error("Invalid image dimensions.");

        if(w>max || h>max){
            const r=Math.min(max/w,max/h);
            w=Math.round(w*r);
            h=Math.round(h*r);
        }

        const canvas=document.createElement("canvas");
        canvas.width=w;
        canvas.height=h;

        const ctx=canvas.getContext("2d");
        if(!ctx) throw new Error("Canvas is not available.");

        ctx.drawImage(img,0,0,w,h);

        const blob=await new Promise((resolve,reject)=>{
            canvas.toBlob(
                b=>b?resolve(b):reject(new Error("Photo compression failed.")),
                "image/jpeg",
                0.82
            );
        });

        return blob;
    }catch(error){
        console.warn("Photo compression fallback:",error);
        return file;
    }
}

async function uploadStudentPortfolioFile(file,target){
    if(!studentAdminSession){
        uploadStatus("Admin session expired. Please log in again.","error");
        return;
    }

    if(!file || !file.type || !file.type.startsWith("image/")){
        uploadStatus("Please choose a valid image file.","error");
        return;
    }

    const c=initStudentSupabase();

    if(!c){
        uploadStatus("Supabase Storage is not connected.","error");
        return;
    }

    try{
        uploadStatus("Preparing photo...","info");

        const uploadBlob=await compressStudentPhoto(file);

        /* Keep uploads small enough for the free storage workflow. */
        if(uploadBlob.size > 5*1024*1024){
            throw new Error("Photo is larger than 5 MB after processing.");
        }

        const path=cloudPath(target.studentId,target.type,target.month);

        uploadStatus("Uploading photo...","info");

        const {data,error}=await c.storage
            .from(STUDENT_STORAGE_CONFIG.bucket)
            .upload(path,uploadBlob,{
                contentType:"image/jpeg",
                cacheControl:"3600",
                upsert:true
            });

        if(error){
            throw error;
        }

        console.log("Student photo uploaded:",data);

        studentSignedUrlCache.clear();
        uploadStatus("✓ Photo uploaded successfully.","success");

        if(activeStudentPortfolio &&
           activeStudentPortfolio.studentId===target.studentId){
            setTimeout(()=>{
                renderStudentProfile(
                    activeStudentPortfolio.className,
                    activeStudentPortfolio.studentId
                );
            },500);
        }

    }catch(err){
        console.error("Student photo upload error:",err);

        const msg =
            err && err.message
                ? err.message
                : "Unknown upload error";

        uploadStatus(`Upload failed: ${msg}`,"error");
    }
}

/* Backward-compatible handler kept in case an older hidden input remains. */
async function handleStudentPortfolioPhotoSelected(event){
    const file=event && event.target && event.target.files
        ? event.target.files[0]
        : null;

    if(!file || !studentUploadTarget) return;

    const target={...studentUploadTarget};

    try{
        await uploadStudentPortfolioFile(file,target);
    }finally{
        studentUploadTarget=null;
        if(event.target) event.target.value="";
    }
}

function openStudentPhotoGallery(studentId,startIndex){
    currentPhotos=Array.from({length:12},(_,i)=>{
        const m=i+1;
        const cu=cloudUrl(cloudPath(studentId,"month",m));
        return cu?cu+"?v="+Date.now():staticUrl(studentId,"month",m);
    });
    currentPhotoIndex=startIndex;
    const lightbox=document.getElementById("photoLightbox");
    if(!lightbox) return;
    lightbox.style.display="flex";
    document.body.style.overflow="hidden";
    showCurrentPhoto();
}

async function restoreStudentAdminSession(){
    const c=initStudentSupabase();
    if(!c){setStudentAdminUI(false);return;}
    const {data}=await c.auth.getSession();
    studentAdminSession=isWebsiteAdminSession(data?.session)?data.session:null;
    if(data?.session && !studentAdminSession) await c.auth.signOut();
    setStudentAdminUI(!!studentAdminSession,studentAdminSession?.user?.email||"");

    if(studentAdminSession){
        await loadAdminStudentsFromSupabase();
    }else{
        await loadPublicStudentsFromSupabase();
    }

    c.auth.onAuthStateChange(async (_event,session)=>{
        studentAdminSession=isWebsiteAdminSession(session)?session:null;
        setStudentAdminUI(!!studentAdminSession,studentAdminSession?.user?.email||"");
        if(studentAdminSession){
            await loadAdminStudentsFromSupabase();
        }else{
            await loadPublicStudentsFromSupabase();
        }
    });
}
document.addEventListener("DOMContentLoaded",()=>{
    restoreStudentAdminSession();
    ["studentAdminEmail","studentAdminPassword"].forEach(id=>{
        document.getElementById(id)?.addEventListener("keydown",e=>{
            if(e.key==="Enter"){e.preventDefault();studentAdminLogin();}
        });
    });
});

/* ===== SOURCE SCRIPT BLOCK: website-admin-management-local-test ===== */
/* =========================================================
   WEBSITE ADMIN MANAGEMENT — OFFLINE FALLBACK LAYER
   ---------------------------------------------------------
   One Supabase admin session is reused everywhere.
   This fallback layer does not overwrite the original page data.
========================================================= */

const ADMIN_LOCAL_KEYS={
    staff:"saaf_admin_staff_v1",
    gallery:"saaf_admin_gallery_v1",
    students:"saaf_admin_students_v1",
    notices:"saaf_admin_notices_v1",
    monthly:"saaf_admin_monthly_reports_v1"
};

let adminManagedStaff={};
let adminManagedGallery=[];
let adminManagedStudents=[];
let adminManagedNotices=[];
let adminManagedMonthlyReports={};
const studentAuthenticatedProfiles=new Map();

function deepClone(value){
    return JSON.parse(JSON.stringify(value));
}

function readAdminLocal(key,fallback){
    try{
        const saved=localStorage.getItem(key);
        return saved ? JSON.parse(saved) : deepClone(fallback);
    }catch(error){
        console.warn("Admin local data read error:",error);
        return deepClone(fallback);
    }
}

function writeAdminLocal(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

function initialGalleryFromPage(){
    const items=[];

    document.querySelectorAll("#photoPopup .media-card").forEach((card,index)=>{
        const img=card.querySelector("img");
        const title=card.querySelector("h3");
        if(!img) return;
        items.push({
            id:`photo-${index+1}`,
            type:"photo",
            src:img.getAttribute("src")||"",
            title:title ? title.textContent.trim() : `Photo ${index+1}`,
            description:""
        });
    });

    document.querySelectorAll("#videoPopup .media-card").forEach((card,index)=>{
        const source=card.querySelector("video source");
        const title=card.querySelector("h3");
        if(!source) return;
        items.push({
            id:`video-${index+1}`,
            type:"video",
            src:source.getAttribute("src")||"",
            title:title ? title.textContent.trim() : `Video ${index+1}`,
            description:""
        });
    });

    return items;
}



function initialMonthlyReports(){
    const months=[
        ["baishakh","Baishakh"],["jestha","Jestha"],["ashadh","Ashadh"],
        ["shrawan","Shrawan"],["bhadra","Bhadra"],["ashwin","Ashwin"],
        ["kartik","Kartik"],["mangsir","Mangsir"],["poush","Poush"],
        ["magh","Magh"],["falgun","Falgun"],["chaitra","Chaitra"]
    ];

    const data={};

    months.forEach(([key,label])=>{
        data[key]={
            label,
            photos:[1,2,3].map(number=>({
                slot:number,
                src:`${key}${number}.jpeg`,
                title:`${label} - Activity ${number}`
            }))
        };
    });

    return data;
}

function initialNoticesFromPage(){
    return Array.from(document.querySelectorAll("#notice .notice-box"))
        .map((box,index)=>({
            id:`notice-${index+1}`,
            text:box.textContent.trim()
        }));
}

function initialStudentsFromCode(){
    return STUDENT_DIRECTORY.map(student=>({
        ...deepClone(student),
        dob:student.dob||"",
        guardian:student.guardian||"",
        performance:student.performance||"",
        remarks:student.remarks||""
    }));
}

function initAdminManagedData(){
    adminManagedStaff=readAdminLocal(ADMIN_LOCAL_KEYS.staff,staffDetails);
    adminManagedGallery=readAdminLocal(ADMIN_LOCAL_KEYS.gallery,initialGalleryFromPage());

    /* Students now use Supabase. Hard-coded students are only the instant
       offline/fallback list until the public Supabase list finishes loading. */
    adminManagedStudents=initialStudentsFromCode();

    adminManagedNotices=readAdminLocal(ADMIN_LOCAL_KEYS.notices,initialNoticesFromPage());
    adminManagedMonthlyReports=readAdminLocal(ADMIN_LOCAL_KEYS.monthly,initialMonthlyReports());

    renderManagedStaffGrid();
    renderManagedGallery();
    renderManagedNotices();
    renderManagedMonthlyReport();

    getStudentsByClass=function(className){
        return adminManagedStudents
            .filter(student=>student.className===className)
            .sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:"base"}));
    };

    getStudentRecord=function(className,studentId){
        return studentAuthenticatedProfiles.get(studentId) ||
            adminManagedStudents.find(
                student=>student.className===className && student.studentId===studentId
            ) || null;
    };

    /* Public visitors get only ID/name/class from the RPC; private profile
       fields are returned only after a successful student_login call. */
    loadPublicStudentsFromSupabase();
}

function mapSupabaseStudent(row){
    return {
        dbId:row.id,
        studentId:row.student_id,
        name:row.name,
        className:row.class_name,
        dob:row.dob||"",
        guardian:row.guardian||"",
        performance:row.performance||"",
        remarks:row.remarks||""
    };
}

async function loadPublicStudentsFromSupabase(){
    const c=initStudentSupabase();
    if(!c) return false;

    const {data,error}=await c.rpc("list_students");
    if(error){
        console.warn("Could not load public student list from Supabase:",error.message||error);
        return false;
    }

    if(Array.isArray(data)){
        adminManagedStudents=data.map(row=>({
            studentId:row.student_id,
            name:row.name,
            className:row.class_name,
            dob:"",
            guardian:"",
            performance:"",
            remarks:""
        }));
        return true;
    }
    return false;
}

async function loadAdminStudentsFromSupabase(){
    const c=initStudentSupabase();
    if(!c || !studentAdminSession) return false;

    const {data,error}=await c
        .from("students")
        .select("id,student_id,name,class_name,dob,guardian,performance,remarks")
        .order("class_name",{ascending:true})
        .order("name",{ascending:true});

    if(error){
        console.error("Could not load students for admin:",error);
        alert("Could not load students from Supabase: "+(error.message||"Unknown error"));
        return false;
    }

    adminManagedStudents=(data||[]).map(mapSupabaseStudent);
    renderAdminStudentList();
    return true;
}

function updateGlobalAdminUI(isAdmin,email=""){
    const login=document.getElementById("globalAdminLoginBtn");
    const panel=document.getElementById("globalAdminPanelBtn");
    const logout=document.getElementById("globalAdminLogoutBtn");
    const status=document.getElementById("globalAdminStatus");

    if(login) login.style.display=isAdmin?"none":"inline-block";
    if(panel) panel.style.display=isAdmin?"inline-block":"none";
    if(logout) logout.style.display=isAdmin?"inline-block":"none";

    if(status){
        status.classList.toggle("active",!!isAdmin);
        status.textContent=isAdmin
            ?`Admin logged in${email?" — "+email:""}`
            :"Admin not logged in";
    }
}

/* Extend the already-working Supabase admin UI globally. */
const _websiteOriginalSetStudentAdminUI=setStudentAdminUI;
setStudentAdminUI=function(isAdmin,email=""){
    _websiteOriginalSetStudentAdminUI(isAdmin,email);
    updateGlobalAdminUI(isAdmin,email);
};

function openWebsiteAdminPanel(){
    if(!studentAdminSession){
        openStudentAdminLogin();
        return;
    }
    renderAdminStaffList();
    renderAdminStaffAccountList();
    renderAdminGalleryList();
    renderAdminStudentList();
    renderAdminNoticeList();
    renderAdminMonthlyReportManager();
    showWebsiteAdminTab("staff");
    document.getElementById("websiteAdminPanel").style.display="block";
    document.body.style.overflow="hidden";
}

function closeWebsiteAdminPanel(){
    document.getElementById("websiteAdminPanel").style.display="none";
    document.body.style.overflow="auto";
}

function showWebsiteAdminTab(tab){
    ["staff","staffAccounts","leaveApplications","staffAnnouncements","staffIdeas","marks","videoTutorials","upcomingPlans","gallery","students","notices","monthly"].forEach(name=>{
        const el=document.getElementById(
            name==="staff"?"websiteAdminStaffTab":
            name==="staffAccounts"?"websiteAdminStaffAccountsTab":
            name==="leaveApplications"?"websiteAdminLeaveApplicationsTab":
            name==="staffAnnouncements"?"websiteAdminStaffAnnouncementsTab":
            name==="staffIdeas"?"websiteAdminStaffIdeasTab":
            name==="marks"?"websiteAdminMarksTab":
            name==="videoTutorials"?"websiteAdminVideoTutorialsTab":
            name==="upcomingPlans"?"websiteAdminUpcomingPlansTab":
            name==="gallery"?"websiteAdminGalleryTab":
            name==="students"?"websiteAdminStudentsTab":
            name==="notices"?"websiteAdminNoticesTab":
            "websiteAdminMonthlyTab"
        );
        if(el) el.style.display=name===tab?"block":"none";
    });

    if(tab==="staff") renderAdminStaffList();
    if(tab==="staffAccounts") renderAdminStaffAccountList();
    if(tab==="leaveApplications") renderAdminLeaveApplications();
    if(tab==="staffAnnouncements") renderAdminStaffAnnouncements();
    if(tab==="staffIdeas") renderAdminStaffIdeas();
    if(tab==="marks") renderAdminMarks();
    if(tab==="videoTutorials") renderAdminVideoTutorials();
    if(tab==="upcomingPlans") renderAdminUpcomingPlans();
    if(tab==="gallery") renderAdminGalleryList();
    if(tab==="students") renderAdminStudentList();
    if(tab==="notices") renderAdminNoticeList();
    if(tab==="monthly") renderAdminMonthlyReportManager();
}


/* =========================================================
   ADMIN — STAFF ACCOUNTS UI
   Secure reset backend will be connected to Supabase next.
   ========================================================= */
const ADMIN_RESETTABLE_STAFF_IDS=[
    "suresh","sanjeev","joseph","ranjana","sagar",
    "abhishek","sunyata","sushma","kritika","amisha","swastika",
    "sanjaya","sujata","shekhar","padam","rufina","liza","kalpana","punita"
];

function renderAdminStaffAccountList(){
    const host=document.getElementById("adminStaffAccountList");
    if(!host) return;

    const directory=(typeof STAFF_LOGIN_DIRECTORY!=="undefined" && STAFF_LOGIN_DIRECTORY)
        ? STAFF_LOGIN_DIRECTORY
        : {};

    const rows=ADMIN_RESETTABLE_STAFF_IDS
        .filter(id=>directory[id])
        .map(id=>{
            const staff=directory[id];
            return `
                <div class="staff-account-row">
                    <div>
                        <div class="staff-account-name">${escapeHtml(staff.name||id)}</div>
                        <div class="staff-account-id">${escapeHtml(staff.designation||"Staff")}</div>
                    </div>
                    <div>
                        <strong>Staff ID</strong><br>
                        <span class="staff-account-id">${escapeHtml(id)}</span>
                    </div>
                    <div>
                        <input id="staffResetPassword_${id}" type="password"
                               autocomplete="new-password"
                               placeholder="New password"
                               aria-label="New password for ${escapeHtmlAttr(staff.name||id)}">
                    </div>
                    <button type="button" class="staff-reset-btn"
                            onclick="requestStaffPasswordReset('${id}')">
                        Reset Password
                    </button>
                </div>`;
        }).join("");

    host.innerHTML=rows || '<div class="review-empty">No staff login accounts found.</div>';
}

async function requestStaffPasswordReset(staffId){
    if(!studentAdminSession || !studentAdminSession.access_token){
        alert("Admin login is required.");
        openStudentAdminLogin();
        return;
    }

    const input=document.getElementById(`staffResetPassword_${staffId}`);
    const newPassword=input?.value||"";

    if(newPassword.length<8){
        alert("Please enter a new password with at least 8 characters.");
        input?.focus();
        return;
    }

    const staff=(
        typeof STAFF_LOGIN_DIRECTORY!=="undefined"
        ? STAFF_LOGIN_DIRECTORY[staffId]
        : null
    );

    const staffName=staff?.name||staffId;

    if(!confirm(`Reset password for ${staffName}?`)){
        return;
    }

    const button=input
        ?.closest(".staff-account-row")
        ?.querySelector(".staff-reset-btn");

    const oldText=button?.textContent||"Reset Password";

    try{
        if(button){
            button.disabled=true;
            button.textContent="Resetting...";
        }

        const response=await fetch(
            `${STUDENT_STORAGE_CONFIG.url}/functions/v1/reset-staff-password`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${studentAdminSession.access_token}`,
                    "apikey":STUDENT_STORAGE_CONFIG.anonKey
                },
                body:JSON.stringify({
                    staffId,
                    newPassword
                })
            }
        );

        let result={};
        try{
            result=await response.json();
        }catch(_error){
            result={};
        }

        if(!response.ok){
            throw new Error(
                result.error ||
                result.message ||
                `Password reset failed (${response.status}).`
            );
        }

        if(input) input.value="";

        alert(`✓ Password reset successfully for ${staffName}.`);
    }catch(error){
        console.error("Staff password reset error:",error);

        alert(
            "Password reset failed: " +
            (error?.message || "Unknown error")
        );
    }finally{
        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
}


async function renderAdminLeaveApplications(){
    const host=document.getElementById("adminLeaveApplicationList");
    if(!host) return;

    if(!studentAdminSession?.access_token){
        host.innerHTML='<div class="review-empty">Admin login is required.</div>';
        return;
    }

    host.innerHTML='<div class="review-empty">Loading leave applications...</div>';

    try{
        const db=initStudentSupabase();
        const {data,error}=await db
            .from("leave_applications")
            .select("*")
            .order("created_at",{ascending:false});

        if(error) throw error;

        if(!data?.length){
            host.innerHTML='<div class="review-empty">No leave applications found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>{
            const status=String(row.status||"pending").toLowerCase();
            return `
                <div class="admin-leave-card">
                    <div class="admin-leave-head">
                        <div>
                            <strong>${escapeHtml(row.staff_name||"Staff")}</strong>
                            <div class="staff-account-id">Staff ID: ${escapeHtml(row.staff_id||"—")}</div>
                        </div>
                        <span class="leave-status-badge ${["approved","rejected"].includes(status)?status:"pending"}">${escapeHtml(status)}</span>
                    </div>
                    <div style="margin-top:9px">
                        <strong>Submitted:</strong> ${escapeHtml(row.submitted_date_bs||"—")}<br>
                        <strong>Leave:</strong> ${escapeHtml(row.leave_from_bs||"—")} to ${escapeHtml(row.leave_to_bs||"—")}<br>
                        <strong>Type:</strong> ${escapeHtml(row.leave_type||"—")}<br>
                        <strong>Reason:</strong> ${escapeHtml(row.reason||"—")}
                    </div>
                    <div style="margin-top:12px">
                        <button type="button" class="admin-leave-delete-btn"
                                onclick="adminDeleteLeaveApplication(${Number(row.id)},this)">
                            🗑 Delete Application
                        </button>
                    </div>
                </div>`;
        }).join("");
    }catch(error){
        console.error("Admin leave list error:",error);
        host.innerHTML=`<div class="review-empty">Could not load leave applications: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function adminDeleteLeaveApplication(id,button){
    if(!studentAdminSession?.access_token){
        alert("Admin login is required.");
        return;
    }

    if(!confirm("Delete this leave application permanently?")){
        return;
    }

    const oldText=button?.textContent||"Delete Application";
    if(button){
        button.disabled=true;
        button.textContent="Deleting...";
    }

    try{
        const db=initStudentSupabase();
        const {error}=await db
            .from("leave_applications")
            .delete()
            .eq("id",id);

        if(error) throw error;

        await renderAdminLeaveApplications();
        alert("Leave application deleted successfully.");
    }catch(error){
        console.error("Admin leave delete error:",error);
        alert("Could not delete leave application: "+(error?.message||"Unknown error"));
        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
}

async function renderAdminUpcomingPlans(){
    const host=document.getElementById("adminUpcomingPlanList");
    if(!host) return;

    if(!studentAdminSession?.access_token){
        host.innerHTML='<div class="review-empty">Admin login is required.</div>';
        return;
    }

    host.innerHTML='<div class="review-empty">Loading upcoming plans...</div>';

    try{
        const db=initStudentSupabase();
        const {data,error}=await db
            .from("upcoming_plans")
            .select("id,plan_date_bs,information_date_bs,plan_name,incharge_name,remarks,created_at")
            .order("plan_date_bs",{ascending:true})
            .order("created_at",{ascending:false});

        if(error) throw error;

        if(!data?.length){
            host.innerHTML='<div class="review-empty">No upcoming plans found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>`
            <div class="admin-leave-card">
                <div class="admin-leave-head">
                    <div>
                        <strong>${escapeHtml(row.plan_name||"Plan")}</strong>
                        <div class="staff-account-id">Plan Date (B.S.): ${escapeHtml(row.plan_date_bs||"—")}</div>
                        <div class="staff-account-id">Information Date (B.S.): ${escapeHtml(row.information_date_bs||"—")}</div>
                    </div>
                    <button type="button" class="admin-leave-delete-btn"
                            onclick="adminDeleteUpcomingPlan(${Number(row.id)},this)">
                        🗑 Delete Plan
                    </button>
                </div>
                <div style="margin-top:9px">
                    <strong>Incharge:</strong> ${escapeHtml(row.incharge_name||"—")}
                </div>
                <div style="margin-top:9px;white-space:pre-wrap;overflow-wrap:anywhere">
                    <strong>Remarks:</strong> ${escapeHtml(row.remarks||"—")}
                </div>
            </div>
        `).join("");
    }catch(error){
        console.error("Admin upcoming plan list error:",error);
        host.innerHTML=`<div class="review-empty">Could not load upcoming plans: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function adminDeleteUpcomingPlan(id,button){
    if(!studentAdminSession?.access_token){
        alert("Admin login is required.");
        return;
    }

    if(!confirm("Delete this upcoming plan permanently?")) return;

    const oldText=button?.textContent||"Delete Plan";
    if(button){
        button.disabled=true;
        button.textContent="Deleting...";
    }

    try{
        const db=initStudentSupabase();
        const {error}=await db
            .from("upcoming_plans")
            .delete()
            .eq("id",id);

        if(error) throw error;

        await renderAdminUpcomingPlans();
        alert("Upcoming plan deleted successfully.");
    }catch(error){
        console.error("Admin upcoming plan delete error:",error);
        alert("Could not delete upcoming plan: "+(error?.message||"Unknown error"));
        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
}

function closeAdminEditor(id){
    const el=document.getElementById(id);
    if(el) el.style.display="none";
    document.body.style.overflow="hidden";
}

function fileToCompressedDataUrl(file,maxDimension=900,quality=.78){
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.onerror=()=>reject(new Error("Could not read selected image."));
        reader.onload=()=>{
            const img=new Image();
            img.onerror=()=>reject(new Error("Could not open selected image."));
            img.onload=()=>{
                let w=img.naturalWidth,h=img.naturalHeight;
                if(w>maxDimension||h>maxDimension){
                    const ratio=Math.min(maxDimension/w,maxDimension/h);
                    w=Math.round(w*ratio);h=Math.round(h*ratio);
                }
                const canvas=document.createElement("canvas");
                canvas.width=w;canvas.height=h;
                canvas.getContext("2d").drawImage(img,0,0,w,h);
                resolve(canvas.toDataURL("image/jpeg",quality));
            };
            img.src=reader.result;
        };
        reader.readAsDataURL(file);
    });
}

/* ======================== STAFF ======================== */

function renderManagedStaffGrid(){
    const grid=document.querySelector("#staffPopup .staff-grid");
    if(!grid) return;

    grid.innerHTML=Object.entries(adminManagedStaff).map(([id,staff])=>`
        <div class="staff-card">
            <img src="${escapeHtmlAttr(staff.photo||"")}" alt="${escapeHtmlAttr(staff.name||"Staff")}">
            <h3>${escapeHtml(staff.name||"")}</h3>
            <p class="designation">${escapeHtml(staff.designation||"")}</p>
            ${staff.phone?`<p class="staff-phone">📞 ${escapeHtml(staff.phone)}</p>`:""}
            <button class="more-details-btn" onclick="showStaffDetails('${id}')">More Details</button>
            <button class="admin-inline-edit" onclick="openStaffEditor('${id}')">✏️ Edit</button>
        </div>
    `).join("");
}

function renderAdminStaffList(){
    const host=document.getElementById("adminStaffList");
    if(!host) return;
    host.innerHTML=Object.entries(adminManagedStaff).map(([id,staff])=>`
        <div class="admin-manager-row">
            <img src="${escapeHtmlAttr(staff.photo||"")}" alt="">
            <div>
                <div class="admin-manager-title">${escapeHtml(staff.name||"")}</div>
                <div class="admin-manager-meta">
                    ${escapeHtml(staff.designation||"")}
                    ${staff.phone?` • ${escapeHtml(staff.phone)}`:""}
                    ${staff.experience?` • ${escapeHtml(staff.experience)}`:""}
                </div>
            </div>
            <div class="admin-manager-actions">
                <button onclick="openStaffEditor('${id}')">Edit</button>
                <button class="danger" onclick="deleteStaffItem('${id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

function makeStaffIdFromName(name){
    const base=String(name||"staff")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-+|-+$/g,"") || "staff";

    let id=base;
    let n=2;
    while(adminManagedStaff[id]){
        id=`${base}-${n++}`;
    }
    return id;
}

function openStaffEditor(id=""){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const staff=id ? adminManagedStaff[id] : null;

    document.getElementById("staffEditId").value=id;
    document.getElementById("staffEditName").value=staff?.name||"";
    document.getElementById("staffEditDesignation").value=staff?.designation||"";
    document.getElementById("staffEditPhone").value=staff?.phone||"";
    document.getElementById("staffEditExperience").value=staff?.experience||"";
    document.getElementById("staffEditSubject").value=staff?.subject||"";
    document.getElementById("staffEditPhoto").value=staff?.photo||"";
    document.getElementById("staffEditAbout").value=staff?.about||"";
    document.getElementById("staffEditResponsibility").value=staff?.responsibility||"";
    document.getElementById("staffEditPhotoFile").value="";
    document.getElementById("staffEditorHeading").textContent=
        staff ? "👨‍🏫 Edit Staff Information" : "👨‍🏫 Add New Staff";

    document.getElementById("staffEditorPopup").style.display="block";
    document.body.style.overflow="hidden";
}

async function saveStaffEdit(event){
    event.preventDefault();
    if(!studentAdminSession) return;

    let id=document.getElementById("staffEditId").value;
    const isNew=!id;
    const name=document.getElementById("staffEditName").value.trim();

    if(!name){
        alert("Please enter the staff name.");
        return;
    }

    if(isNew){
        id=makeStaffIdFromName(name);
    }

    const current=adminManagedStaff[id]||{};

    let photo=document.getElementById("staffEditPhoto").value.trim();
    const file=document.getElementById("staffEditPhotoFile").files[0];

    if(file && file.type.startsWith("image/")){
        try{
            photo=await fileToCompressedDataUrl(file,600,.78);
        }catch(error){
            alert(error.message);
            return;
        }
    }

    adminManagedStaff[id]={
        ...current,
        name,
        designation:document.getElementById("staffEditDesignation").value.trim(),
        phone:document.getElementById("staffEditPhone").value.trim(),
        experience:document.getElementById("staffEditExperience").value.trim(),
        subject:document.getElementById("staffEditSubject").value.trim(),
        photo,
        about:document.getElementById("staffEditAbout").value.trim(),
        responsibility:document.getElementById("staffEditResponsibility").value.trim()
    };

    try{
        writeAdminLocal(ADMIN_LOCAL_KEYS.staff,adminManagedStaff);
    }catch(error){
        alert("Local browser storage is full. Use a smaller staff photo for this local test.");
        return;
    }

    renderManagedStaffGrid();
    renderAdminStaffList();
    closeAdminEditor("staffEditorPopup");
}

function deleteStaffItem(id){
    if(!studentAdminSession) return;

    const staff=adminManagedStaff[id];
    if(!staff) return;

    if(!confirm(`Delete ${staff.name} from the local test staff list?`)) return;

    delete adminManagedStaff[id];
    writeAdminLocal(ADMIN_LOCAL_KEYS.staff,adminManagedStaff);
    renderManagedStaffGrid();
    renderAdminStaffList();
}

/* Override staff detail view to use editable managed data. */
showStaffDetails=function(staffId){
    const staff=adminManagedStaff[staffId];
    if(!staff) return;

    document.getElementById("staffDetailPhoto").src=staff.photo||"";
    document.getElementById("staffDetailName").textContent=staff.name||"";
    document.getElementById("staffDetailDesignation").textContent=staff.designation||"";

    const info=document.getElementById("staffDetailPhone");
    if(staff.subject && staff.designation==="Teacher"){
        info.innerHTML="<strong>📚 Subject:</strong> "+escapeHtml(staff.subject);
        info.style.display="block";
    }else if(staff.phone){
        info.innerHTML="<strong>📞 Contact:</strong> "+escapeHtml(staff.phone);
        info.style.display="block";
    }else{
        info.innerHTML="";
        info.style.display="none";
    }

    document.getElementById("staffDetailExperience").innerHTML=
        "<strong>💼 Experience:</strong> "+escapeHtml(staff.experience||"");

    document.getElementById("staffDetailAbout").innerHTML=
        "<strong>👤 About:</strong><br>"+nl2br(staff.about||"");

    document.getElementById("staffDetailResponsibility").innerHTML=
        "<strong>📋 Responsibilities:</strong><br>"+nl2br(staff.responsibility||"");

    const payrollLinks=document.getElementById("payrollLinks");
    if(payrollLinks) payrollLinks.style.display=staffId==="payroll"?"flex":"none";

    document.getElementById("staffDetailsPage").style.display="block";
    document.body.style.overflow="hidden";
};

/* ======================== GALLERY ======================== */

function renderManagedGallery(){
    const photoGrid=document.querySelector("#photoPopup .media-grid");
    const videoGrid=document.querySelector("#videoPopup .media-grid");

    if(photoGrid){
        photoGrid.innerHTML=adminManagedGallery
            .filter(item=>item.type==="photo")
            .map(item=>`
                <div class="media-card">
                    <img src="${escapeHtmlAttr(item.src||"")}" onclick="openPhoto(this.src)" alt="${escapeHtmlAttr(item.title||"Photo")}">
                    <h3>${escapeHtml(item.title||"Photo")}</h3>
                    ${item.description?`<p class="gallery-description">${escapeHtml(item.description)}</p>`:""}
                    <button class="admin-inline-edit" onclick="openGalleryEditor('photo','${item.id}')">✏️ Edit</button>
                </div>
            `).join("");
    }

    if(videoGrid){
        videoGrid.innerHTML=adminManagedGallery
            .filter(item=>item.type==="video")
            .map(item=>`
                <div class="media-card">
                    <video controls src="${escapeHtmlAttr(item.src||"")}"></video>
                    <h3>${escapeHtml(item.title||"Video")}</h3>
                    ${item.description?`<p class="gallery-description">${escapeHtml(item.description)}</p>`:""}
                    <button class="admin-inline-edit" onclick="openGalleryEditor('video','${item.id}')">✏️ Edit</button>
                </div>
            `).join("");
    }
}

function renderAdminGalleryList(){
    const host=document.getElementById("adminGalleryList");
    if(!host) return;

    host.innerHTML=adminManagedGallery.map(item=>`
        <div class="admin-manager-row">
            ${
                item.type==="photo"
                    ?`<img src="${escapeHtmlAttr(item.src||"")}" alt="">`
                    :`<video src="${escapeHtmlAttr(item.src||"")}" muted></video>`
            }
            <div>
                <div class="admin-manager-title">${item.type==="photo"?"📷":"🎥"} ${escapeHtml(item.title||"")}</div>
                <div class="admin-manager-meta">${escapeHtml(item.description||item.src||"")}</div>
            </div>
            <div class="admin-manager-actions">
                <button onclick="openGalleryEditor('${item.type}','${item.id}')">Edit</button>
                <button class="danger" onclick="deleteGalleryItem('${item.id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

function openGalleryEditor(type,id=""){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const item=id ? adminManagedGallery.find(x=>x.id===id) : null;
    document.getElementById("galleryEditId").value=id;
    document.getElementById("galleryEditType").value=type;
    document.getElementById("galleryEditTitle").value=item?.title||"";
    document.getElementById("galleryEditSrc").value=item?.src||"";
    document.getElementById("galleryEditDescription").value=item?.description||"";
    document.getElementById("galleryEditFile").value="";
    document.getElementById("galleryEditorHeading").textContent=
        `${type==="photo"?"📷":"🎥"} ${id?"Edit":"Add"} ${type==="photo"?"Photo":"Video"}`;
    document.getElementById("galleryEditorPopup").style.display="block";
    document.body.style.overflow="hidden";
}

async function saveGalleryEdit(event){
    event.preventDefault();
    if(!studentAdminSession) return;

    const id=document.getElementById("galleryEditId").value;
    const type=document.getElementById("galleryEditType").value;
    let src=document.getElementById("galleryEditSrc").value.trim();
    const file=document.getElementById("galleryEditFile").files[0];

    if(file){
        if(type==="photo" && file.type.startsWith("image/")){
            try{
                src=await fileToCompressedDataUrl(file,1200,.76);
            }catch(error){
                alert(error.message);return;
            }
        }else if(type==="video" && file.type.startsWith("video/")){
            /* Local test preview only. Object URL is intentionally temporary. */
            src=URL.createObjectURL(file);
        }else{
            alert("Please choose the correct photo/video file type.");
            return;
        }
    }

    if(!src){
        alert("Choose a file or enter a file path/URL.");
        return;
    }

    const record={
        id:id||`${type}-${Date.now()}`,
        type,
        src,
        title:document.getElementById("galleryEditTitle").value.trim(),
        description:document.getElementById("galleryEditDescription").value.trim()
    };

    if(id){
        const index=adminManagedGallery.findIndex(x=>x.id===id);
        if(index>=0) adminManagedGallery[index]=record;
    }else{
        /* New gallery items appear first; older items move toward the end. */
        adminManagedGallery.unshift(record);
    }

    try{
        /* Temporary blob video URLs are not persisted across browser restart. */
        const persistent=adminManagedGallery.map(x=>{
            if(x.type==="video" && String(x.src).startsWith("blob:")){
                return {...x,src:""};
            }
            return x;
        });
        writeAdminLocal(ADMIN_LOCAL_KEYS.gallery,persistent);
    }catch(error){
        alert("Local browser storage is full. Use smaller images for this local test.");
    }

    renderManagedGallery();
    renderAdminGalleryList();
    closeAdminEditor("galleryEditorPopup");
}

function deleteGalleryItem(id){
    if(!studentAdminSession) return;
    if(!confirm("Remove this gallery item from the local test view?")) return;
    adminManagedGallery=adminManagedGallery.filter(item=>item.id!==id);
    writeAdminLocal(ADMIN_LOCAL_KEYS.gallery,adminManagedGallery);
    renderManagedGallery();
    renderAdminGalleryList();
}



/* ======================== SCHOOL MONTHLY REPORTS ======================== */

function monthlyReportLabel(monthKey){
    return adminManagedMonthlyReports[monthKey]?.label ||
           (monthKey.charAt(0).toUpperCase()+monthKey.slice(1));
}

function renderManagedMonthlyReport(){
    /* Public monthly report rendering is handled whenever a month is opened. */
}

function renderAdminMonthlyReportManager(){
    const host=document.getElementById("adminMonthlyReportManager");
    const select=document.getElementById("adminMonthlyMonthSelect");
    if(!host || !select) return;

    const monthKey=select.value;
    const month=adminManagedMonthlyReports[monthKey];
    if(!month) return;

    host.innerHTML=month.photos.slice(0,3).map(photo=>`
        <div class="admin-manager-row">
            <img src="${escapeHtmlAttr(photo.src||"")}" alt="" onerror="this.style.opacity='.35'">
            <div>
                <div class="admin-manager-title">${escapeHtml(month.label)} — Photo ${photo.slot}</div>
                <div class="admin-manager-meta">${escapeHtml(photo.title||"")}</div>
            </div>
            <div class="admin-manager-actions">
                <button onclick="chooseMonthlyReportPhoto('${monthKey}',${photo.slot})">Upload / Replace</button>
                <button class="danger" onclick="clearMonthlyReportPhoto('${monthKey}',${photo.slot})">Clear</button>
            </div>
        </div>
    `).join("");
}

function chooseMonthlyReportPhoto(monthKey,slot){
    if(!studentAdminSession){
        openStudentAdminLogin();
        return;
    }

    const picker=document.createElement("input");
    picker.type="file";
    picker.accept="image/*";
    picker.style.position="fixed";
    picker.style.left="-9999px";
    document.body.appendChild(picker);

    picker.addEventListener("change",async()=>{
        const file=picker.files?.[0];

        if(file){
            try{
                const dataUrl=await fileToCompressedDataUrl(file,1400,.78);
                const month=adminManagedMonthlyReports[monthKey];
                const item=month?.photos.find(p=>p.slot===slot);

                if(item){
                    item.src=dataUrl;
                    writeAdminLocal(ADMIN_LOCAL_KEYS.monthly,adminManagedMonthlyReports);
                    renderAdminMonthlyReportManager();

                    const currentTitle=document.querySelector("#monthlyPhotos .report-title");
                    if(currentTitle && currentTitle.textContent.includes(month.label)){
                        showMonthReport(month.label,monthKey);
                    }
                }
            }catch(error){
                alert(error.message||"Could not prepare the photo.");
            }
        }

        picker.remove();
    },{once:true});

    picker.click();
}

function clearMonthlyReportPhoto(monthKey,slot){
    if(!studentAdminSession) return;

    const month=adminManagedMonthlyReports[monthKey];
    const item=month?.photos.find(p=>p.slot===slot);
    if(!item) return;

    if(!confirm(`Clear ${month.label} Photo ${slot} from the local test view?`)) return;

    item.src="";
    writeAdminLocal(ADMIN_LOCAL_KEYS.monthly,adminManagedMonthlyReports);
    renderAdminMonthlyReportManager();

    const currentTitle=document.querySelector("#monthlyPhotos .report-title");
    if(currentTitle && currentTitle.textContent.includes(month.label)){
        showMonthReport(month.label,monthKey);
    }
}


/* ======================== NOTICES ======================== */

function renderManagedNotices(){
    const section=document.getElementById("notice");
    if(!section) return;

    section.querySelectorAll(".notice-box").forEach(box=>box.remove());

    const divider=section.querySelector(".section-divider");
    const anchor=divider || section.querySelector("h2");

    adminManagedNotices.forEach(notice=>{
        const box=document.createElement("div");
        box.className="notice-box";
        box.textContent=notice.text || "";
        if(anchor && anchor.parentNode){
            anchor.parentNode.appendChild(box);
        }
    });
}

function renderAdminNoticeList(){
    const host=document.getElementById("adminNoticeList");
    if(!host) return;

    host.innerHTML=adminManagedNotices.map((notice,index)=>`
        <div class="admin-manager-row">
            <div style="width:58px;height:52px;border-radius:10px;background:#fff4d6;display:flex;align-items:center;justify-content:center;font-size:25px;">📢</div>
            <div>
                <div class="admin-manager-title">Notice ${index+1}</div>
                <div class="admin-manager-meta">${escapeHtml(notice.text||"")}</div>
            </div>
            <div class="admin-manager-actions">
                <button onclick="openNoticeEditor('${notice.id}')">Edit</button>
                <button class="danger" onclick="deleteNoticeItem('${notice.id}')">Delete</button>
            </div>
        </div>
    `).join("") || '<p style="text-align:center;color:#667085;padding:20px;">No notices yet.</p>';
}

function openNoticeEditor(id=""){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const notice=id ? adminManagedNotices.find(n=>n.id===id) : null;

    document.getElementById("noticeEditId").value=id;
    document.getElementById("noticeEditText").value=notice?.text||"";
    document.getElementById("noticeEditorHeading").textContent=
        notice ? "📢 Edit Notice" : "📢 Add Notice";

    document.getElementById("noticeEditorPopup").style.display="block";
    document.body.style.overflow="hidden";
}

function saveNoticeEdit(event){
    event.preventDefault();
    if(!studentAdminSession) return;

    const id=document.getElementById("noticeEditId").value;
    const noticeText=document.getElementById("noticeEditText").value.trim();

    if(!noticeText){
        alert("Please write the notice.");
        return;
    }

    if(id){
        const index=adminManagedNotices.findIndex(n=>n.id===id);
        if(index>=0){
            adminManagedNotices[index]={
                ...adminManagedNotices[index],
                text:noticeText
            };
        }
    }else{
        adminManagedNotices.unshift({
            id:`notice-${Date.now()}`,
            text:noticeText
        });
    }

    writeAdminLocal(ADMIN_LOCAL_KEYS.notices,adminManagedNotices);
    renderManagedNotices();
    renderAdminNoticeList();
    closeAdminEditor("noticeEditorPopup");
}

function deleteNoticeItem(id){
    if(!studentAdminSession) return;

    const notice=adminManagedNotices.find(n=>n.id===id);
    if(!notice) return;

    if(!confirm("Delete this notice from the local test view?")) return;

    adminManagedNotices=adminManagedNotices.filter(n=>n.id!==id);
    writeAdminLocal(ADMIN_LOCAL_KEYS.notices,adminManagedNotices);
    renderManagedNotices();
    renderAdminNoticeList();
}


/* ======================== STUDENTS ======================== */

function renderAdminStudentList(){
    const host=document.getElementById("adminStudentList");
    if(!host) return;

    const classFilter=document.getElementById("adminStudentClassFilter")?.value||"ALL";
    const q=(document.getElementById("adminStudentSearch")?.value||"").trim().toLowerCase();

    const students=adminManagedStudents
        .filter(s=>classFilter==="ALL"||s.className===classFilter)
        .filter(s=>!q||s.name.toLowerCase().includes(q)||s.studentId.toLowerCase().includes(q))
        .sort((a,b)=>a.className.localeCompare(b.className)||a.name.localeCompare(b.name));

    host.innerHTML=students.map(student=>`
        <div class="admin-manager-row">
            <div style="width:58px;height:52px;border-radius:10px;background:#e8eef5;display:flex;align-items:center;justify-content:center;font-size:26px;">👤</div>
            <div>
                <div class="admin-manager-title">${escapeHtml(student.name)}</div>
                <div class="admin-manager-meta">
                    ${escapeHtml(student.className)} • ${escapeHtml(student.studentId)}
                    ${student.dob?` • DOB ${escapeHtml(student.dob)}`:""}
                </div>
            </div>
            <div class="admin-manager-actions">
                <button onclick="openStudentDataEditor('${student.studentId}')">Edit</button>
                <button class="danger" onclick="deleteStudentItem('${student.studentId}')">Delete</button>
            </div>
        </div>
    `).join("") || '<p style="text-align:center;color:#667085;padding:20px;">No students found.</p>';
}

function openStudentDataEditor(studentId=""){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const student=studentId
        ?adminManagedStudents.find(s=>s.studentId===studentId)
        :null;

    document.getElementById("studentOriginalId").value=student?.studentId||"";
    document.getElementById("studentEditId").value=student?.studentId||"";
    document.getElementById("studentEditId").readOnly=!!student;
    document.getElementById("studentEditClass").value=student?.className||"Nursery";
    document.getElementById("studentEditName").value=student?.name||"";
    document.getElementById("studentEditDob").value=student?.dob||"";
    document.getElementById("studentEditGuardian").value=student?.guardian||"";
    document.getElementById("studentEditPerformance").value=student?.performance||"";
    document.getElementById("studentEditRemarks").value=student?.remarks||"";
    document.getElementById("studentEditPassword").value="";
    document.getElementById("studentEditorHeading").textContent=
        student?"🎓 Edit Student":"🎓 Add New Student";

    document.getElementById("studentDataEditorPopup").style.display="block";
    document.body.style.overflow="hidden";
}

async function saveStudentDataEdit(event){
    event.preventDefault();
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const c=initStudentSupabase();
    if(!c){alert("Supabase is not connected.");return;}

    const originalId=document.getElementById("studentOriginalId").value;
    const studentId=document.getElementById("studentEditId").value.trim().toUpperCase();
    const password=document.getElementById("studentEditPassword").value;
    const existing=originalId
        ?adminManagedStudents.find(s=>s.studentId===originalId)
        :null;

    if(!/^[A-Z0-9-]{2,24}$/.test(studentId)){
        alert("Student ID may contain only letters, numbers and hyphens.");
        return;
    }
    if(!existing && !password.trim()){
        alert("Please set a password for the new student.");
        return;
    }

    const payload={
        p_student_id:studentId,
        p_name:document.getElementById("studentEditName").value.trim(),
        p_class_name:document.getElementById("studentEditClass").value,
        p_dob:document.getElementById("studentEditDob").value||null,
        p_guardian:document.getElementById("studentEditGuardian").value.trim()||null,
        p_performance:document.getElementById("studentEditPerformance").value.trim()||null,
        p_remarks:document.getElementById("studentEditRemarks").value.trim()||null,
        p_password:password.trim()||null
    };

    const {error}=await c.rpc("admin_save_student",payload);
    if(error){
        console.error("Student save error:",error);
        alert("Student could not be saved: "+(error.message||"Unknown error"));
        return;
    }

    await loadAdminStudentsFromSupabase();

    const rollView=document.getElementById("studentRollView");
    if(rollView && getComputedStyle(rollView).display!=="none"){
        showStudentRolls(payload.p_class_name);
    }

    closeAdminEditor("studentDataEditorPopup");
    alert(existing?"Student updated successfully.":"Student added successfully.");
}

async function deleteStudentItem(studentId){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const student=adminManagedStudents.find(s=>s.studentId===studentId);
    if(!student) return;

    if(!confirm(`Delete ${student.name} (${student.studentId}) permanently from Supabase?`)) return;

    const c=initStudentSupabase();
    if(!c){alert("Supabase is not connected.");return;}

    const {error}=await c.from("students").delete().eq("student_id",studentId);
    if(error){
        console.error("Student delete error:",error);
        alert("Student could not be deleted: "+(error.message||"Unknown error"));
        return;
    }

    studentAuthenticatedProfiles.delete(studentId);
    await loadAdminStudentsFromSupabase();

    const rollView=document.getElementById("studentRollView");
    if(rollView && getComputedStyle(rollView).display!=="none"){
        showStudentRolls(student.className);
    }
}

function renderManagedStudentProfile(className,studentId){
    const rollView=document.getElementById("studentRollView");
    const student=getStudentRecord(className,studentId);
    if(!student||!rollView) return;

    activeStudentPortfolio={className,studentId};

    const galleryHTML=Array.from({length:12},(_,i)=>{
        const m=i+1;
        return `<div class="student-photo-item">
            <img data-student-month-photo data-month="${m}" alt="${escapeHtmlAttr(student.name)} Month ${m} progress photo" loading="lazy" decoding="async" onclick="openStudentPhotoGallery('${student.studentId}',${i})">
            <div class="student-photo-missing" style="display:none;">Month ${m}<br>Photo not uploaded yet</div>
            <span class="student-month-label">Month ${m}</span>
            <button type="button" class="student-photo-upload-btn" onclick="event.stopPropagation();chooseStudentPortfolioPhoto('${student.studentId}','month',${m})">Add / Update</button>
        </div>`;
    }).join("");

    rollView.style.display="block";
    rollView.innerHTML=`
        <button class="student-back-btn" onclick="showStudentRolls('${className}')">← Back to ${escapeHtml(className)}</button>
        <h2 class="student-portfolio-title">🎓 ${escapeHtml(student.name)}</h2>
        <div class="student-profile">
            <div id="studentProfilePhotoHost"></div>

            <div class="student-profile-photo-admin">
                <button type="button" class="student-admin-login-btn" onclick="chooseStudentPortfolioPhoto('${student.studentId}','profile')">📷 Add / Update Student Photo</button>
            </div>

            <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                <button class="admin-student-profile-edit" type="button" onclick="openStudentDataEditor('${student.studentId}')">✏️ Edit Student Information</button>
                <button class="admin-student-profile-edit" type="button" style="background:#b42318;color:#fff;" onclick="deleteStudentItem('${student.studentId}')">🗑 Delete Student</button>
            </div>

            <h3>${escapeHtml(student.name)}</h3>
            <div class="student-profile-row"><strong>Student ID:</strong> ${escapeHtml(student.studentId)}</div>
            <div class="student-profile-row"><strong>Student Name:</strong> ${escapeHtml(student.name)}</div>
            <div class="student-profile-row"><strong>Class:</strong> ${escapeHtml(student.className)}</div>
            <div class="student-profile-row"><strong>Date of Birth:</strong> ${escapeHtml(student.dob||"To be updated")}</div>
            <div class="student-profile-row"><strong>Parent / Guardian:</strong> ${escapeHtml(student.guardian||"To be updated")}</div>
            <div class="student-profile-row"><strong>Academic Performance:</strong> ${escapeHtml(student.performance||"To be updated")}</div>
            <div class="student-profile-row"><strong>Remarks:</strong> ${escapeHtml(student.remarks||"To be updated")}</div>

            <div class="student-photo-gallery">
                <h4>📊 Monthly Progress Photos</h4>
                <div class="student-photo-grid">${galleryHTML}</div>
            </div>
            <div id="studentUploadProgress" class="student-upload-progress" role="status" aria-live="polite"></div>
        </div>`;

    bindPortfolioImages(student).catch(err=>console.error("Student photo display error:",err));
}

/* Keep the current password/admin logic, only replace the profile data rendering. */
renderStudentProfile=renderManagedStudentProfile;

/* ======================== SAFE HTML HELPERS ======================== */

function escapeHtml(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}
function escapeHtmlAttr(value){return escapeHtml(value);}
function nl2br(value){return escapeHtml(value).replace(/\n/g,"<br>");}

document.addEventListener("DOMContentLoaded",()=>{
    initAdminManagedData();

    /* Synchronize global admin buttons with any restored Supabase session. */
    setTimeout(()=>{
        updateGlobalAdminUI(
            !!studentAdminSession,
            studentAdminSession?.user?.email||""
        );
    },700);
});

/* ===== SOURCE SCRIPT BLOCK: supabase-all-content-connection ===== */
/* =========================================================
   FINAL SUPABASE CONNECTION
   Students + Staff + Gallery + Notices + Monthly Reports
   ========================================================= */

function contentDb(){
    return initStudentSupabase();
}

async function loadAllManagedContentFromSupabase(){
    const db=contentDb();
    if(!db) return;

    try{
        const [staffRes,galleryRes,noticeRes,monthlyRes]=await Promise.all([
            db.from("staff").select("*").order("id",{ascending:true}),
            db.from("gallery").select("*").order("id",{ascending:true}),
            db.from("notices").select("*").order("id",{ascending:true}),
            db.from("monthly_reports").select("*").order("slot",{ascending:true})
        ]);

        if(staffRes.error) throw staffRes.error;
        if(galleryRes.error) throw galleryRes.error;
        if(noticeRes.error) throw noticeRes.error;
        if(monthlyRes.error) throw monthlyRes.error;

        adminManagedStaff={};
        (staffRes.data||[]).forEach(row=>{
            const key=row.staff_key || `staff-${row.id}`;
            adminManagedStaff[key]={
                dbId:row.id,
                staffKey:key,
                name:row.name||"",
                designation:row.designation||"",
                phone:row.phone||"",
                experience:row.experience||"",
                subject:row.subject||"",
                photo:row.photo_url||"",
                about:row.about||"",
                responsibility:row.responsibility||""
            };
        });

        adminManagedGallery=(galleryRes.data||[]).map(row=>({
            id:String(row.id),
            dbId:row.id,
            type:row.type||"photo",
            src:row.file_url||"",
            title:row.title||"",
            description:row.description||""
        }));

        adminManagedNotices=(noticeRes.data||[]).map(row=>({
            id:String(row.id),
            dbId:row.id,
            text:row.notice_text||""
        }));

        const monthLabels={
            baishakh:"Baishakh",jestha:"Jestha",ashadh:"Ashadh",shrawan:"Shrawan",
            bhadra:"Bhadra",ashwin:"Ashwin",kartik:"Kartik",mangsir:"Mangsir",
            poush:"Poush",magh:"Magh",falgun:"Falgun",chaitra:"Chaitra"
        };
        adminManagedMonthlyReports={};
        Object.entries(monthLabels).forEach(([key,label])=>{
            adminManagedMonthlyReports[key]={label,photos:[]};
        });
        (monthlyRes.data||[]).forEach(row=>{
            const key=String(row.month||"").toLowerCase();
            if(!adminManagedMonthlyReports[key]){
                adminManagedMonthlyReports[key]={
                    label:key.charAt(0).toUpperCase()+key.slice(1),
                    photos:[]
                };
            }
            adminManagedMonthlyReports[key].photos.push({
                dbId:row.id,
                slot:Number(row.slot),
                src:row.photo_url||"",
                title:row.title||""
            });
        });
        Object.values(adminManagedMonthlyReports).forEach(month=>{
            for(let slot=1;slot<=3;slot++){
                if(!month.photos.some(p=>p.slot===slot)){
                    month.photos.push({slot,src:"",title:`${month.label} - Activity ${slot}`});
                }
            }
            month.photos.sort((a,b)=>a.slot-b.slot);
        });

        renderManagedStaffGrid();
        renderManagedGallery();
        renderManagedNotices();
        renderManagedMonthlyReport();
        if(document.getElementById("websiteAdminStaffTab")?.style.display!=="none") renderAdminStaffList();
        if(document.getElementById("websiteAdminGalleryTab")?.style.display!=="none") renderAdminGalleryList();
        if(document.getElementById("websiteAdminNoticesTab")?.style.display!=="none") renderAdminNoticeList();
        if(document.getElementById("websiteAdminMonthlyTab")?.style.display!=="none") renderAdminMonthlyReportManager();
    }catch(error){
        console.error("Supabase content load error:",error);
    }
}

/* ---------- STAFF: Supabase save/delete ---------- */
saveStaffEdit=async function(event){
    event.preventDefault();
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const db=contentDb();
    let key=document.getElementById("staffEditId").value;
    const isNew=!key;
    const name=document.getElementById("staffEditName").value.trim();
    if(!name){alert("Please enter the staff name.");return;}
    if(isNew) key=makeStaffIdFromName(name);

    const current=adminManagedStaff[key]||{};
    let photo=document.getElementById("staffEditPhoto").value.trim();
    const file=document.getElementById("staffEditPhotoFile").files[0];
    if(file && file.type.startsWith("image/")){
        try{ photo=await fileToCompressedDataUrl(file,600,.78); }
        catch(error){alert(error.message);return;}
    }

    const payload={
        staff_key:key,
        name,
        designation:document.getElementById("staffEditDesignation").value.trim(),
        phone:document.getElementById("staffEditPhone").value.trim(),
        experience:document.getElementById("staffEditExperience").value.trim(),
        subject:document.getElementById("staffEditSubject").value.trim(),
        photo_url:photo,
        about:document.getElementById("staffEditAbout").value.trim(),
        responsibility:document.getElementById("staffEditResponsibility").value.trim()
    };

    const result=current.dbId
        ? await db.from("staff").update(payload).eq("id",current.dbId).select().single()
        : await db.from("staff").insert(payload).select().single();

    if(result.error){alert("Staff save failed: "+result.error.message);return;}
    closeAdminEditor("staffEditorPopup");
    await loadAllManagedContentFromSupabase();
};

deleteStaffItem=async function(key){
    if(!studentAdminSession) return;
    const staff=adminManagedStaff[key];
    if(!staff || !confirm(`Delete ${staff.name} from Staff?`)) return;
    const db=contentDb();
    const result=await db.from("staff").delete().eq("id",staff.dbId);
    if(result.error){alert("Staff delete failed: "+result.error.message);return;}
    await loadAllManagedContentFromSupabase();
};

/* ---------- GALLERY: Supabase save/delete ---------- */
saveGalleryEdit=async function(event){
    event.preventDefault();
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const db=contentDb();
    const id=document.getElementById("galleryEditId").value;
    const type=document.getElementById("galleryEditType").value;
    let src=document.getElementById("galleryEditSrc").value.trim();
    const file=document.getElementById("galleryEditFile").files[0];

    if(file){
        if(type==="photo" && file.type.startsWith("image/")){
            try{src=await fileToCompressedDataUrl(file,1200,.76);}
            catch(error){alert(error.message);return;}
        }else if(type==="video"){
            alert("For videos, enter the permanent video file path/URL in File Path / URL.");
            return;
        }
    }
    if(!src){alert("Choose a photo or enter a file path/URL.");return;}

    const payload={
        type,
        title:document.getElementById("galleryEditTitle").value.trim(),
        file_url:src,
        description:document.getElementById("galleryEditDescription").value.trim()
    };

    const result=id
        ? await db.from("gallery").update(payload).eq("id",Number(id)).select().single()
        : await db.from("gallery").insert(payload).select().single();

    if(result.error){alert("Gallery save failed: "+result.error.message);return;}
    closeAdminEditor("galleryEditorPopup");
    await loadAllManagedContentFromSupabase();
};

deleteGalleryItem=async function(id){
    if(!studentAdminSession || !confirm("Delete this gallery item?")) return;
    const db=contentDb();
    const result=await db.from("gallery").delete().eq("id",Number(id));
    if(result.error){alert("Gallery delete failed: "+result.error.message);return;}
    await loadAllManagedContentFromSupabase();
};

/* ---------- NOTICES: Supabase save/delete ---------- */
saveNoticeEdit=async function(event){
    event.preventDefault();
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const db=contentDb();
    const id=document.getElementById("noticeEditId").value;
    const noticeText=document.getElementById("noticeEditText").value.trim();
    if(!noticeText){alert("Please write the notice.");return;}

    const result=id
        ? await db.from("notices").update({notice_text:noticeText}).eq("id",Number(id)).select().single()
        : await db.from("notices").insert({notice_text:noticeText}).select().single();

    if(result.error){alert("Notice save failed: "+result.error.message);return;}
    closeAdminEditor("noticeEditorPopup");
    await loadAllManagedContentFromSupabase();
};

deleteNoticeItem=async function(id){
    if(!studentAdminSession || !confirm("Delete this notice?")) return;
    const db=contentDb();
    const result=await db.from("notices").delete().eq("id",Number(id));
    if(result.error){alert("Notice delete failed: "+result.error.message);return;}
    await loadAllManagedContentFromSupabase();
};

/* ---------- MONTHLY REPORTS: Supabase save/clear ---------- */
chooseMonthlyReportPhoto=function(monthKey,slot){
    if(!studentAdminSession){openStudentAdminLogin();return;}

    const picker=document.createElement("input");
    picker.type="file";
    picker.accept="image/*";
    picker.style.position="fixed";
    picker.style.left="-9999px";
    document.body.appendChild(picker);

    picker.addEventListener("change",async()=>{
        const file=picker.files?.[0];
        if(file){
            try{
                const dataUrl=await fileToCompressedDataUrl(file,1400,.78);
                const month=adminManagedMonthlyReports[monthKey];
                const item=month?.photos.find(p=>p.slot===slot);
                const db=contentDb();
                const payload={
                    month:monthKey,
                    slot,
                    photo_url:dataUrl,
                    title:item?.title || `${month?.label||monthKey} - Activity ${slot}`
                };
                const result=item?.dbId
                    ? await db.from("monthly_reports").update(payload).eq("id",item.dbId)
                    : await db.from("monthly_reports").insert(payload);
                if(result.error){alert("Monthly report save failed: "+result.error.message);}
                else{
                    await loadAllManagedContentFromSupabase();
                    renderAdminMonthlyReportManager();
                    const currentTitle=document.querySelector("#monthlyPhotos .report-title");
                    if(currentTitle && currentTitle.textContent.includes(month.label)){
                        showMonthReport(month.label,monthKey);
                    }
                }
            }catch(error){alert(error.message||"Could not prepare the photo.");}
        }
        picker.remove();
    },{once:true});
    picker.click();
};

clearMonthlyReportPhoto=async function(monthKey,slot){
    if(!studentAdminSession) return;
    const month=adminManagedMonthlyReports[monthKey];
    const item=month?.photos.find(p=>p.slot===slot);
    if(!item || !confirm(`Clear ${month.label} Photo ${slot}?`)) return;

    const db=contentDb();
    const result=item.dbId
        ? await db.from("monthly_reports").update({photo_url:""}).eq("id",item.dbId)
        : {error:null};

    if(result.error){alert("Monthly report clear failed: "+result.error.message);return;}
    await loadAllManagedContentFromSupabase();
    renderAdminMonthlyReportManager();
    const currentTitle=document.querySelector("#monthlyPhotos .report-title");
    if(currentTitle && currentTitle.textContent.includes(month.label)){
        showMonthReport(month.label,monthKey);
    }
};

/* Reload online content after the original page initialization. */
window.addEventListener("load",()=>{
    setTimeout(loadAllManagedContentFromSupabase,250);
});

/* ===== SOURCE SCRIPT BLOCK: student-report-lightbox-and-single-video-fix ===== */
/* =========================================================
   FIX 1: STUDENT MONTHLY REPORT — OPEN ONLY CLICKED PHOTO
   FIX 2: ONLY ONE VIDEO CAN PLAY AT A TIME
   Visual design/content unchanged.
   ========================================================= */

function restoreNormalPhotoLightboxControls(){
    const prev=document.querySelector("#photoLightbox .photo-prev");
    const next=document.querySelector("#photoLightbox .photo-next");
    const counter=document.getElementById("photoCounter");
    if(prev) prev.style.display="flex";
    if(next) next.style.display="flex";
    if(counter) counter.style.display="block";
}

if(typeof openPhoto==="function"){
    const originalOpenPhoto=openPhoto;
    openPhoto=function(src){
        restoreNormalPhotoLightboxControls();
        return originalOpenPhoto(src);
    };
}

openStudentPhotoGallery=async function(studentId,startIndex){
    try{
        const month=Number(startIndex)+1;
        const url=await cloudSignedUrl(
            cloudPath(studentId,"month",month),
            900
        );

        if(!url){
            if(typeof uploadStatus==="function"){
                uploadStatus(`Month ${month} photo has not been uploaded yet.`,"info");
            }
            return;
        }

        const lightbox=document.getElementById("photoLightbox");
        const lightboxImg=document.getElementById("largePhoto");
        const prev=document.querySelector("#photoLightbox .photo-prev");
        const next=document.querySelector("#photoLightbox .photo-next");
        const counter=document.getElementById("photoCounter");

        if(!lightbox || !lightboxImg){
            console.error("Student report lightbox elements were not found.");
            return;
        }

        photoList=[url];
        currentPhotoIndex=0;
        lightboxImg.src=url;

        if(prev) prev.style.display="none";
        if(next) next.style.display="none";
        if(counter){
            counter.style.display="block";
            counter.textContent=`Month ${month}`;
        }

        lightbox.style.display="flex";
        document.body.style.overflow="hidden";
    }catch(error){
        console.error("Could not open student monthly report:",error);
        if(typeof uploadStatus==="function"){
            uploadStatus("Could not open this monthly report.","error");
        }
    }
};

document.addEventListener("play",function(event){
    const playingVideo=event.target;
    if(!playingVideo || playingVideo.tagName!=="VIDEO") return;

    document.querySelectorAll("video").forEach(function(video){
        if(video!==playingVideo && !video.paused){
            video.pause();
        }
    });
},true);

document.addEventListener("click",function(event){
    const closeButton=event.target.closest && event.target.closest(".close-btn");
    if(!closeButton) return;

    const popup=closeButton.closest(".popup");
    if(!popup) return;

    popup.querySelectorAll("video").forEach(function(video){
        video.pause();
    });
});

/* ===== SOURCE SCRIPT BLOCK: staff-login-leave-js ===== */
/* =========================================================
   SECURE STAFF LOGIN
   Visible login uses Staff ID + password.
   Internally Supabase Auth uses an internal email alias.
   IMPORTANT: passwords are NOT stored in this HTML.
   ========================================================= */

const STAFF_LOGIN_DIRECTORY={"suresh": {"name": "SURESH RAI", "designation": "Chief Executive Officer"}, "sanjeev": {"name": "SANJEEV RAI", "designation": "Managing Director"}, "joseph": {"name": "JOSEPH SHANKER", "designation": "Principal"}, "ranjana": {"name": "RANJANA RAI", "designation": "Vice Principal"}, "sagar": {"name": "SAGAR ADHIKARI", "designation": "Payroll Department"}, "abhishek": {"name": "ABHISHEK KALIKOTAY", "designation": "Teacher"}, "sunyata": {"name": "SUNYATA RAI", "designation": "Teacher"}, "sushma": {"name": "SUSHMA RAI", "designation": "Teacher"}, "kritika": {"name": "KRITIKA MAGAR", "designation": "Teacher"}, "amisha": {"name": "AMISHA RAI", "designation": "Teacher"}, "swastika": {"name": "SWASTIKA LIMBU", "designation": "Teacher"}, "sanjaya": {"name": "SANJAYA RAI", "designation": "Teacher"}, "sujata": {"name": "SUJATA RAI", "designation": "Teacher"}, "shekhar": {"name": "SHEKHAR KUMAR ACHARYA", "designation": "Teacher"}, "padam": {"name": "PADAM KARKI", "designation": "Teacher"}, "rufina": {"name": "RUFINA PRADHAN", "designation": "Teacher"}, "liza": {"name": "LIZA RAI", "designation": "Teacher"}, "kalpana": {"name": "KALPANA RAI", "designation": "Teacher"}, "punita": {"name": "PUNITA RAI", "designation": "Teacher"}, "devi": {"name": "DEVI MAYA TAMANG", "designation": "School Support Staff"}, "lila": {"name": "LILA RAI", "designation": "School Support Staff"}, "sabina": {"name": "SABINA LIMBU", "designation": "School Support Staff"}, "amit": {"name": "AMIT RAI", "designation": "Driver"}, "bhupendra": {"name": "BHUPENDRA RAI", "designation": "Driver"}};
const STAFF_INTERNAL_DOMAIN="staff.staugustine.edu.np";

let staffSupabase=null;
let staffAuthSession=null;
let loggedInStaff=null;

function initStaffSupabase(){
    if(staffSupabase) return staffSupabase;
    if(!window.supabase || !window.supabase.createClient) return null;

    staffSupabase=window.supabase.createClient(
        STUDENT_STORAGE_CONFIG.url,
        STUDENT_STORAGE_CONFIG.anonKey,
        {
            auth:{
                persistSession:true,
                autoRefreshToken:true,
                detectSessionInUrl:false,
                storageKey:"staugustine-staff-auth"
            }
        }
    );
    return staffSupabase;
}

function normalizeStaffId(value){
    return String(value||"").trim().toLowerCase().replace(/\s+/g,"");
}

function staffInternalEmail(username){
    return `${username}@${STAFF_INTERNAL_DOMAIN}`;
}

function showStaffMessage(message,type="error"){
    const box=document.getElementById("staffLoginMessage");
    if(!box) return;
    box.textContent=message;
    box.className=`staff-login-message show ${type}`;
}

function clearStaffMessage(){
    const box=document.getElementById("staffLoginMessage");
    if(box){
        box.textContent="";
        box.className="staff-login-message";
    }
}

function updateStaffLoginUI(){
    const login=document.getElementById("staffLoginOpenBtn");
    const leave=document.getElementById("staffLeaveOpenBtn");
    const logout=document.getElementById("staffLogoutBtn");
    const status=document.getElementById("staffLoginStatus");

    const active=!!loggedInStaff;
    if(login) login.style.display=active?"none":"inline-block";
    if(leave) leave.style.display=active?"inline-block":"none";
    if(logout) logout.style.display=active?"inline-block":"none";

    if(status){
        status.textContent=active
            ? `Logged in: ${loggedInStaff.name}`
            : "Staff not logged in";
    }
}

function openStaffLogin(){
    clearStaffMessage();
    const popup=document.getElementById("staffLoginPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
}

function closeStaffLogin(){
    const popup=document.getElementById("staffLoginPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function staffLogin(){
    const username=normalizeStaffId(document.getElementById("staffUsername")?.value);
    const password=document.getElementById("staffPassword")?.value||"";

    if(!username || !password){
        showStaffMessage("Enter your Staff ID and password.");
        return;
    }

    const staff=STAFF_LOGIN_DIRECTORY[username];
    if(!staff){
        showStaffMessage("Staff ID not recognized.");
        return;
    }

    const client=initStaffSupabase();
    if(!client){
        showStaffMessage("Staff login service is not available.");
        return;
    }

    showStaffMessage("Signing in...","success");

    const {data,error}=await client.auth.signInWithPassword({
        email:staffInternalEmail(username),
        password
    });

    if(error || !data?.session){
        showStaffMessage("Login failed. Check Staff ID and password.");
        return;
    }

    const sessionUsername=normalizeStaffId((data.user?.email||"").split("@")[0]);
    if(sessionUsername!==username || !STAFF_LOGIN_DIRECTORY[sessionUsername]){
        await client.auth.signOut();
        showStaffMessage("This account is not authorized for staff access.");
        return;
    }

    staffAuthSession=data.session;
    loggedInStaff={
        username:sessionUsername,
        ...STAFF_LOGIN_DIRECTORY[sessionUsername]
    };

    const passwordBox=document.getElementById("staffPassword");
    if(passwordBox) passwordBox.value="";

    updateStaffLoginUI();
    closeStaffLogin();
    openStaffDashboard();
}

async function staffLogout(){
    const client=initStaffSupabase();
    if(client) await client.auth.signOut();
    staffAuthSession=null;
    loggedInStaff=null;
    updateStaffLoginUI();
    closeStaffLeaveForm();
}

function openStaffLeaveForm(){
    if(!loggedInStaff){
        openStaffLogin();
        return;
    }

    const name=document.getElementById("leaveStaffName");
    const designation=document.getElementById("leaveStaffDesignation");
    const hiddenName=document.getElementById("leaveStaffNameHidden");
    const hiddenDesignation=document.getElementById("leaveDesignationHidden");
    const hiddenId=document.getElementById("leaveStaffIdHidden");
    const subject=document.getElementById("leaveEmailSubject");

    if(name) name.textContent=loggedInStaff.name;
    if(designation) designation.textContent=loggedInStaff.designation;
    if(hiddenName) hiddenName.value=loggedInStaff.name;
    if(hiddenDesignation) hiddenDesignation.value=loggedInStaff.designation;
    if(hiddenId) hiddenId.value=loggedInStaff.username;
    if(subject) subject.value=`Leave Application - ${loggedInStaff.name}`;

    const popup=document.getElementById("staffLeavePopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
}

function closeStaffLeaveForm(){
    const popup=document.getElementById("staffLeavePopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function restoreStaffSession(){
    const client=initStaffSupabase();
    if(!client) return;

    const {data}=await client.auth.getSession();
    const session=data?.session||null;

    if(session?.user?.email){
        const username=normalizeStaffId(session.user.email.split("@")[0]);
        if(STAFF_LOGIN_DIRECTORY[username]){
            staffAuthSession=session;
            loggedInStaff={
                username,
                ...STAFF_LOGIN_DIRECTORY[username]
            };
        }else{
            await client.auth.signOut();
            staffAuthSession=null;
            loggedInStaff=null;
        }
    }

    updateStaffLoginUI();

    client.auth.onAuthStateChange((_event,session)=>{
        if(session?.user?.email){
            const username=normalizeStaffId(session.user.email.split("@")[0]);
            if(STAFF_LOGIN_DIRECTORY[username]){
                staffAuthSession=session;
                loggedInStaff={
                    username,
                    ...STAFF_LOGIN_DIRECTORY[username]
                };
            }else{
                staffAuthSession=null;
                loggedInStaff=null;
            }
        }else{
            staffAuthSession=null;
            loggedInStaff=null;
        }
        updateStaffLoginUI();
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    restoreStaffSession();

    ["staffUsername","staffPassword"].forEach(id=>{
        document.getElementById(id)?.addEventListener("keydown",event=>{
            if(event.key==="Enter"){
                event.preventDefault();
                staffLogin();
            }
        });
    });

    const leaveForm=document.getElementById("staffLeaveForm");
    if(leaveForm){
        leaveForm.addEventListener("submit",event=>{
            if(!loggedInStaff || !staffAuthSession){
                event.preventDefault();
                alert("Your staff session has expired. Please log in again.");
                openStaffLogin();
                return;
            }

            const submitted=document.getElementById("leaveSubmittedDate")?.value.trim();
            const from=document.getElementById("leaveFromDate")?.value.trim();
            const to=document.getElementById("leaveToDate")?.value.trim();
            const bsDatePattern=/^\d{4}-\d{2}-\d{2}$/;

            if(!bsDatePattern.test(submitted) || !bsDatePattern.test(from) || !bsDatePattern.test(to)){
                event.preventDefault();
                alert("Please enter all B.S. dates in YYYY-MM-DD format, for example 2083-05-10.");
                return;
            }

            if(to<from){
                event.preventDefault();
                alert("Leave To (B.S.) date cannot be earlier than Leave From (B.S.) date.");
                return;
            }

            document.getElementById("leaveStaffNameHidden").value=loggedInStaff.name;
            document.getElementById("leaveDesignationHidden").value=loggedInStaff.designation;
            document.getElementById("leaveStaffIdHidden").value=loggedInStaff.username;

            const btn=document.getElementById("staffLeaveSubmitBtn");
            if(btn){
                btn.disabled=true;
                btn.textContent="Submitting...";
            }
        });
    }
});

/* ===== SOURCE SCRIPT BLOCK: leave-approval-workflow-js ===== */
/* =========================================================
   COMPLETE LEAVE WORKFLOW
   - Staff: submit to Supabase as pending + FormSubmit Gmail
   - Staff: view own application status/history
   - Principal (joseph): Leave Requests only, Approve / Reject
   ========================================================= */

const PRINCIPAL_STAFF_ID="joseph";

function leaveStatusClass(status){
    const s=String(status||"pending").toLowerCase();
    return ["approved","rejected"].includes(s)?s:"pending";
}

function formatLeaveValue(value,fallback="—"){
    return value===null || value===undefined || value==="" ? fallback : String(value);
}

function formatApprovedLeaveDate(row){
    const from=formatLeaveValue(row?.leave_from_bs);
    const to=formatLeaveValue(row?.leave_to_bs);
    return !to || to==="—" || from===to ? from : `${from} – ${to}`;
}

function closeApprovedStaffLeaves(){
    const popup=document.getElementById("approvedStaffLeavePopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function openApprovedStaffLeaves(){
    if(!loggedInStaff || !staffAuthSession){
        openStaffLogin();
        return;
    }

    const popup=document.getElementById("approvedStaffLeavePopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await loadApprovedStaffLeaves();
}

async function loadApprovedStaffLeaves(){
    const host=document.getElementById("approvedStaffLeaveList");
    if(!host) return;

    if(!loggedInStaff || !staffAuthSession){
        host.innerHTML='<div class="approved-leave-empty">Staff login is required.</div>';
        return;
    }

    host.innerHTML='<div class="approved-leave-empty">Loading approved leave...</div>';

    const db=initStaffSupabase();
    if(!db){
        host.innerHTML='<div class="approved-leave-empty">Could not connect to approved leave records.</div>';
        return;
    }

    const {data,error}=await db
        .from("leave_applications")
        .select("staff_name,leave_from_bs,leave_to_bs,created_at")
        .eq("status","approved")
        .order("leave_from_bs",{ascending:true})
        .order("created_at",{ascending:false});

    if(error){
        console.error("Approved leave load error:",error);
        host.innerHTML='<div class="approved-leave-empty">Could not load approved leave.</div>';
        return;
    }

    const rows=data||[];
    if(!rows.length){
        host.innerHTML='<div class="approved-leave-empty">No approved leave found.</div>';
        return;
    }

    host.innerHTML=rows.map(row=>`
        <div class="approved-leave-row">
            <span class="approved-leave-name">${escapeHtml(formatLeaveValue(row.staff_name,"Staff"))}</span>
            <span class="approved-leave-date">${escapeHtml(formatApprovedLeaveDate(row))}</span>
        </div>
    `).join("");
}

/* Add the staff history area once. */
function ensureStaffLeaveHistoryUI(){
    const box=document.querySelector("#staffLeavePopup .staff-leave-box");
    const form=document.getElementById("staffLeaveForm");
    if(!box || !form || document.getElementById("staffLeaveHistory")) return;

    const history=document.createElement("div");
    history.id="staffLeaveHistory";
    history.className="staff-leave-history";
    history.innerHTML=`
        <h3>My Leave Applications</h3>
        <div id="staffLeaveHistoryList" class="leave-history-list">
            <div class="leave-history-empty">No leave applications yet.</div>
        </div>
    `;
    form.insertAdjacentElement("afterend",history);
}

async function loadOwnLeaveApplications(){
    ensureStaffLeaveHistoryUI();
    const host=document.getElementById("staffLeaveHistoryList");
    if(!host || !loggedInStaff || !staffAuthSession) return;

    if(loggedInStaff.username===PRINCIPAL_STAFF_ID){
        host.innerHTML="";
        return;
    }

    host.innerHTML='<div class="leave-history-empty">Loading...</div>';

    const db=initStaffSupabase();
    if(!db){
        host.innerHTML='<div class="leave-history-empty">Could not connect to leave records.</div>';
        return;
    }

    const {data,error}=await db
        .from("leave_applications")
        .select("*")
        .eq("user_id",staffAuthSession.user.id)
        .order("created_at",{ascending:false});

    if(error){
        console.error("Own leave load error:",error);
        host.innerHTML=`<div class="leave-history-empty">Could not load leave status: ${escapeHtml(error.message||"Unknown error")}</div>`;
        return;
    }

    const rows=data||[];
    if(!rows.length){
        host.innerHTML='<div class="leave-history-empty">No leave applications yet.</div>';
        return;
    }

    host.innerHTML=rows.map(row=>{
        const status=leaveStatusClass(row.status);
        return `
            <div class="leave-status-card">
                <div class="leave-status-head">
                    <div class="leave-status-name">${escapeHtml(formatLeaveValue(row.leave_type,"Leave Application"))}</div>
                    <span class="leave-status-badge ${status}">${escapeHtml(status)}</span>
                </div>
                <div class="leave-status-meta">
                    <strong>Submitted:</strong> ${escapeHtml(formatLeaveValue(row.submitted_date_bs))}<br>
                    <strong>Leave:</strong> ${escapeHtml(formatLeaveValue(row.leave_from_bs))}
                    to ${escapeHtml(formatLeaveValue(row.leave_to_bs))}
                </div>
                <div class="leave-status-reason">
                    <strong>Reason:</strong><br>${escapeHtml(formatLeaveValue(row.reason))}
                </div>
            </div>`;
    }).join("");
}

function closePrincipalLeaveRequests(){
    const popup=document.getElementById("principalLeavePopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function openPrincipalLeaveRequests(){
    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID){
        alert("Principal login is required.");
        return;
    }

    const popup=document.getElementById("principalLeavePopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";

    await loadPrincipalLeaveRequests();
}

async function loadPrincipalLeaveRequests(){
    const host=document.getElementById("principalLeaveRequestList");
    if(!host) return;

    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID || !staffAuthSession){
        host.innerHTML='<div class="principal-leave-empty">Principal login is required.</div>';
        return;
    }

    host.innerHTML='<div class="principal-leave-empty">Loading leave requests...</div>';

    const db=initStaffSupabase();
    if(!db){
        host.innerHTML='<div class="principal-leave-empty">Could not connect to leave records.</div>';
        return;
    }

    const {data,error}=await db
        .from("leave_applications")
        .select("*")
        .order("created_at",{ascending:false});

    if(error){
        console.error("Principal leave load error:",error);
        host.innerHTML=`<div class="principal-leave-empty">Could not load requests: ${escapeHtml(error.message||"Unknown error")}</div>`;
        return;
    }

    const rows=data||[];
    if(!rows.length){
        host.innerHTML='<div class="principal-leave-empty">No leave applications have been submitted.</div>';
        return;
    }

    host.innerHTML=rows.map(row=>{
        const status=leaveStatusClass(row.status);
        const pending=status==="pending";
        return `
            <div class="principal-leave-card">
                <div class="principal-leave-head">
                    <div>
                        <div class="leave-status-name">${escapeHtml(formatLeaveValue(row.staff_name,"Staff"))}</div>
                        <div class="leave-status-meta">
                            <strong>Staff ID:</strong> ${escapeHtml(formatLeaveValue(row.staff_id))}<br>
                            <strong>Designation:</strong> ${escapeHtml(formatLeaveValue(row.designation))}<br>
                            <strong>Submitted Date (B.S.):</strong> ${escapeHtml(formatLeaveValue(row.submitted_date_bs))}<br>
                            <strong>Leave From (B.S.):</strong> ${escapeHtml(formatLeaveValue(row.leave_from_bs))}<br>
                            <strong>Leave To (B.S.):</strong> ${escapeHtml(formatLeaveValue(row.leave_to_bs))}<br>
                            <strong>Leave Type:</strong> ${escapeHtml(formatLeaveValue(row.leave_type))}<br>
                            <strong>Contact Number:</strong> ${escapeHtml(formatLeaveValue(row.contact_number))}
                        </div>
                    </div>
                    <span class="leave-status-badge ${status}">${escapeHtml(status)}</span>
                </div>

                <div class="leave-status-reason">
                    <strong>Reason for Leave:</strong><br>
                    ${escapeHtml(formatLeaveValue(row.reason))}
                </div>

                ${row.remarks ? `
                <div class="leave-status-reason">
                    <strong>Additional Remarks:</strong><br>
                    ${escapeHtml(formatLeaveValue(row.remarks))}
                </div>` : ""}

                <div class="principal-leave-actions">
                    ${pending ? `
                    <button type="button" class="principal-approve-btn"
                            onclick="principalSetLeaveStatus(${Number(row.id)},'approved',this)">
                        ✓ APPROVE
                    </button>
                    <button type="button" class="principal-reject-btn"
                            onclick="principalSetLeaveStatus(${Number(row.id)},'rejected',this)">
                        ✕ REJECT
                    </button>` : ""}
                    <button type="button" class="principal-reject-btn"
                            onclick="principalDeleteLeaveApplication(${Number(row.id)},this)">
                        🗑 DELETE
                    </button>
                </div>
            </div>`;
    }).join("");
}

async function principalDeleteLeaveApplication(id,button){
    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID || !staffAuthSession?.user?.id){
        alert("Principal login is required.");
        return;
    }
    if(!confirm("Delete this leave application permanently?")) return;

    const card=button?.closest(".principal-leave-card");
    const buttons=card?.querySelectorAll("button")||[];
    buttons.forEach(btn=>btn.disabled=true);
    const oldText=button?.textContent||"DELETE";
    if(button) button.textContent="Deleting...";

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error}=await db
            .from("leave_applications")
            .delete()
            .eq("id",Number(id))
            .select("id");

        if(error) throw error;
        if(!data?.length) throw new Error("This Principal account does not currently have Supabase DELETE permission for leave applications.");

        await Promise.all([
            loadPrincipalLeaveRequests(),
            loadApprovedStaffLeaves(),
            loadStaffDashboardLeaves()
        ]);
        alert("Leave application deleted successfully.");
    }catch(error){
        console.error("Principal leave delete error:",error);
        alert("Could not delete leave application: "+(error?.message||"Unknown error"));
        buttons.forEach(btn=>btn.disabled=false);
        if(button) button.textContent=oldText;
    }
}

async function principalSetLeaveStatus(id,status,button){
    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID || !staffAuthSession){
        alert("Principal login is required.");
        return;
    }

    if(!["approved","rejected"].includes(status)) return;

    const action=status==="approved"?"APPROVE":"REJECT";
    if(!confirm(`${action} this leave application?`)) return;

    const card=button?.closest(".principal-leave-card");
    const buttons=card?.querySelectorAll(".principal-leave-actions button")||[];
    buttons.forEach(btn=>btn.disabled=true);

    try{
        const db=initStaffSupabase();
        const {error}=await db
            .from("leave_applications")
            .update({status})
            .eq("id",id);

        if(error) throw error;

        await loadPrincipalLeaveRequests();
    }catch(error){
        console.error("Leave decision error:",error);
        alert("Could not update leave status: "+(error?.message||"Unknown error"));
        buttons.forEach(btn=>btn.disabled=false);
    }
}

/* Principal gets Leave Requests only; normal staff get Leave Application. */
const originalUpdateStaffLoginUI=updateStaffLoginUI;
updateStaffLoginUI=function(){
    originalUpdateStaffLoginUI();

    const leave=document.getElementById("staffLeaveOpenBtn");
    const approved=document.getElementById("staffApprovedLeaveOpenBtn");
    if(approved) approved.style.display=loggedInStaff?"inline-block":"none";
    if(!leave) return;

    if(loggedInStaff?.username===PRINCIPAL_STAFF_ID){
        leave.textContent="📋 LEAVE REQUESTS";
        leave.setAttribute("onclick","openPrincipalLeaveRequests()");
    }else{
        leave.textContent="📝 LEAVE APPLICATION";
        leave.setAttribute("onclick","openStaffLeaveForm()");
    }
};

const originalOpenStaffLeaveForm=openStaffLeaveForm;
openStaffLeaveForm=function(){
    if(loggedInStaff?.username===PRINCIPAL_STAFF_ID){
        openPrincipalLeaveRequests();
        return;
    }

    originalOpenStaffLeaveForm();
    ensureStaffLeaveHistoryUI();
    loadOwnLeaveApplications();
};

const originalStaffLogout=staffLogout;
staffLogout=async function(){
    closePrincipalLeaveRequests();
    closeApprovedStaffLeaves();
    await originalStaffLogout();
};

/*
 * Capture the Leave form submit BEFORE the older FormSubmit handler.
 * First save a pending record in Supabase. If successful, continue the
 * existing Gmail submission using the native form submit.
 */
document.addEventListener("submit",async function(event){
    const form=event.target;
    if(!form || form.id!=="staffLeaveForm") return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if(!loggedInStaff || !staffAuthSession?.user?.id){
        alert("Your staff session has expired. Please log in again.");
        openStaffLogin();
        return;
    }

    if(loggedInStaff.username===PRINCIPAL_STAFF_ID){
        alert("The Principal account is for reviewing leave requests only.");
        openPrincipalLeaveRequests();
        return;
    }

    if(!form.checkValidity()){
        form.reportValidity();
        return;
    }

    const submitted=document.getElementById("leaveSubmittedDate")?.value.trim()||"";
    const from=document.getElementById("leaveFromDate")?.value.trim()||"";
    const to=document.getElementById("leaveToDate")?.value.trim()||"";
    const bsDatePattern=/^\d{4}-\d{2}-\d{2}$/;

    if(!bsDatePattern.test(submitted) || !bsDatePattern.test(from) || !bsDatePattern.test(to)){
        alert("Please enter all B.S. dates in YYYY-MM-DD format, for example 2083-05-10.");
        return;
    }

    if(to<from){
        alert("Leave To (B.S.) date cannot be earlier than Leave From (B.S.) date.");
        return;
    }

    const btn=document.getElementById("staffLeaveSubmitBtn");
    const oldText=btn?.textContent||"SUBMIT LEAVE APPLICATION";

    if(btn){
        btn.disabled=true;
        btn.textContent="Saving application...";
    }

    try{
        const payload={
            user_id:staffAuthSession.user.id,
            staff_id:loggedInStaff.username,
            staff_name:loggedInStaff.name,
            designation:loggedInStaff.designation||"",
            submitted_date_bs:submitted,
            leave_from_bs:from,
            leave_to_bs:to,
            leave_type:document.getElementById("leaveType")?.value||"",
            contact_number:document.getElementById("leaveContact")?.value.trim()||null,
            reason:document.getElementById("leaveReason")?.value.trim()||"",
            remarks:document.getElementById("leaveRemarks")?.value.trim()||null,
            status:"pending"
        };

        const db=initStaffSupabase();
        const {error}=await db
            .from("leave_applications")
            .insert(payload);

        if(error) throw error;

        /* Keep the Gmail message complete and readable. */
        document.getElementById("leaveStaffNameHidden").value=loggedInStaff.name;
        document.getElementById("leaveDesignationHidden").value=loggedInStaff.designation||"";
        document.getElementById("leaveStaffIdHidden").value=loggedInStaff.username;

        let statusHidden=form.querySelector('input[name="Status"]');
        if(!statusHidden){
            statusHidden=document.createElement("input");
            statusHidden.type="hidden";
            statusHidden.name="Status";
            form.appendChild(statusHidden);
        }
        statusHidden.value="Pending";

        if(btn) btn.textContent="Sending notification...";

        /*
         * Native submission intentionally bypasses submit listeners.
         * The form targets a hidden frame, so Gmail notification continues
         * without navigating staff away from the website.
         */
        form.submit();

        /* Supabase has confirmed the application, so acknowledge it now. */
        form.reset();
        if(btn){
            btn.disabled=false;
            btn.textContent=oldText;
        }
        closeStaffLeaveForm();
        await loadOwnLeaveApplications();
        openLeaveSuccessPopup();
    }catch(error){
        console.error("Leave application save error:",error);
        alert("Leave application could not be saved: "+(error?.message||"Unknown error"));
        if(btn){
            btn.disabled=false;
            btn.textContent=oldText;
        }
    }
},true);

document.addEventListener("DOMContentLoaded",()=>{
    ensureStaffLeaveHistoryUI();

    /* If a staff session was restored, refresh the role-specific UI shortly after auth restore. */
    setTimeout(()=>{
        updateStaffLoginUI();
        if(loggedInStaff && loggedInStaff.username!==PRINCIPAL_STAFF_ID){
            loadOwnLeaveApplications();
        }
    },900);
});

/* ===== SOURCE SCRIPT BLOCK: upcoming-plan-js ===== */
/* =========================================================
   UPCOMING PLAN
   - Principal (joseph): publish Plan Date + Information Date + Plan Name + Incharge + optional Remarks
   - Every logged-in staff member: read
   - Website Admin: read and delete from Admin Control Center
   ========================================================= */

function showUpcomingPlanMessage(message,type="error"){
    const box=document.getElementById("upcomingPlanMessage");
    if(!box) return;
    box.textContent=message;
    box.className=`upcoming-plan-message show ${type}`;
}

function clearUpcomingPlanMessage(){
    const box=document.getElementById("upcomingPlanMessage");
    if(!box) return;
    box.textContent="";
    box.className="upcoming-plan-message";
}

function closeUpcomingPlans(){
    const popup=document.getElementById("upcomingPlanPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
    clearUpcomingPlanMessage();
}

async function openUpcomingPlans(){
    if(!loggedInStaff || !staffAuthSession){
        openStaffLogin();
        return;
    }

    const principalForm=document.getElementById("principalUpcomingPlanForm");
    if(principalForm){
        principalForm.classList.toggle("show",loggedInStaff.username===PRINCIPAL_STAFF_ID);
    }

    clearUpcomingPlanMessage();
    const popup=document.getElementById("upcomingPlanPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await loadUpcomingPlans();
}

async function loadUpcomingPlans(){
    const host=document.getElementById("upcomingPlanList");
    if(!host) return;

    if(!loggedInStaff || !staffAuthSession){
        host.innerHTML='<div class="upcoming-plan-empty">Staff login is required.</div>';
        return;
    }

    host.innerHTML='<div class="upcoming-plan-empty">Loading upcoming plans...</div>';

    const db=initStaffSupabase();
    if(!db){
        host.innerHTML='<div class="upcoming-plan-empty">Could not connect to upcoming plans.</div>';
        return;
    }

    const {data,error}=await db
        .from("upcoming_plans")
        .select("id,plan_date_bs,information_date_bs,plan_name,incharge_name,remarks,created_at")
        .order("plan_date_bs",{ascending:true})
        .order("created_at",{ascending:false});

    if(error){
        console.error("Upcoming plan load error:",error);
        host.innerHTML='<div class="upcoming-plan-empty">Could not load upcoming plans.</div>';
        return;
    }

    const rows=data||[];
    if(!rows.length){
        host.innerHTML='<div class="upcoming-plan-empty">No upcoming plans found.</div>';
        return;
    }

    host.innerHTML=rows.map(row=>`
        <div class="upcoming-plan-row">
            <span class="upcoming-plan-date">${escapeHtml(formatLeaveValue(row.plan_date_bs))}</span>
            <span class="upcoming-plan-information-date">${escapeHtml(formatLeaveValue(row.information_date_bs))}</span>
            <span class="upcoming-plan-name">${escapeHtml(formatLeaveValue(row.plan_name,"Plan"))}</span>
            <span class="upcoming-plan-incharge">${escapeHtml(formatLeaveValue(row.incharge_name))}</span>
            <span class="upcoming-plan-remarks">
                ${escapeHtml(formatLeaveValue(row.remarks))}
                ${loggedInStaff?.username===PRINCIPAL_STAFF_ID?`
                    <button type="button" class="staff-dashboard-notice-delete"
                            style="margin-left:8px;"
                            onclick="principalDeleteUpcomingPlan(${Number(row.id)},this)">
                        🗑 Delete
                    </button>`:""}
            </span>
        </div>
    `).join("");
}

async function principalDeleteUpcomingPlan(id,button){
    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID || !staffAuthSession?.user?.id){
        alert("Principal login is required.");
        return;
    }
    if(!confirm("Delete this upcoming plan permanently?")) return;

    const oldText=button?.textContent||"Delete";
    if(button){button.disabled=true;button.textContent="Deleting...";}

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error}=await db
            .from("upcoming_plans")
            .delete()
            .eq("id",Number(id))
            .select("id");

        if(error) throw error;
        if(!data?.length) throw new Error("This Principal account does not currently have Supabase DELETE permission for upcoming plans.");

        await Promise.all([loadUpcomingPlans(),loadStaffDashboardPlans()]);
        showUpcomingPlanMessage("Upcoming plan deleted successfully.","success");
    }catch(error){
        console.error("Principal upcoming plan delete error:",error);
        alert("Could not delete upcoming plan: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function submitUpcomingPlan(event){
    event.preventDefault();

    if(!loggedInStaff || loggedInStaff.username!==PRINCIPAL_STAFF_ID || !staffAuthSession?.user?.id){
        showUpcomingPlanMessage("Principal login is required.");
        return;
    }

    const form=document.getElementById("upcomingPlanForm");
    if(!form?.checkValidity()){
        form?.reportValidity();
        return;
    }

    const planDate=document.getElementById("upcomingPlanDate")?.value.trim()||"";
    const informationDate=document.getElementById("upcomingPlanInformationDate")?.value.trim()||"";
    const planName=document.getElementById("upcomingPlanName")?.value.trim()||"";
    const inchargeName=document.getElementById("upcomingPlanIncharge")?.value.trim()||"";
    const remarks=document.getElementById("upcomingPlanRemarks")?.value.trim()||"";

    if(!/^\d{4}-\d{2}-\d{2}$/.test(planDate)){
        showUpcomingPlanMessage("Enter the Plan Date (B.S.) in YYYY-MM-DD format.");
        return;
    }

    if(!/^\d{4}-\d{2}-\d{2}$/.test(informationDate)){
        showUpcomingPlanMessage("Enter the Information Date (B.S.) in YYYY-MM-DD format.");
        return;
    }

    if(!planName || !inchargeName){
        showUpcomingPlanMessage("Enter the plan name and incharge name.");
        return;
    }

    const button=document.getElementById("upcomingPlanSubmitBtn");
    const oldText=button?.textContent||"PUBLISH UPCOMING PLAN";

    if(button){
        button.disabled=true;
        button.textContent="Publishing...";
    }

    try{
        const db=initStaffSupabase();
        const {error}=await db
            .from("upcoming_plans")
            .insert({
                plan_date_bs:planDate,
                information_date_bs:informationDate,
                plan_name:planName,
                incharge_name:inchargeName,
                remarks:remarks||null,
                created_by:staffAuthSession.user.id
            });

        if(error) throw error;

        form.reset();
        showUpcomingPlanMessage("Upcoming plan published successfully.","success");
        await loadUpcomingPlans();
    }catch(error){
        console.error("Upcoming plan publish error:",error);
        showUpcomingPlanMessage("Could not publish upcoming plan: "+(error?.message||"Unknown error"));
    }finally{
        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
}

/* Add Upcoming Plan beside the existing logged-in staff actions. */
const upcomingOriginalUpdateStaffLoginUI=updateStaffLoginUI;
updateStaffLoginUI=function(){
    upcomingOriginalUpdateStaffLoginUI();
    const upcoming=document.getElementById("staffUpcomingPlanOpenBtn");
    if(upcoming) upcoming.style.display=loggedInStaff?"inline-block":"none";
};

const upcomingOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeUpcomingPlans();
    await upcomingOriginalStaffLogout();
};

/* ===== SOURCE SCRIPT BLOCK: smart-staff-dashboard-js ===== */
/* =========================================================
   ST. AUGUSTINE SMART STAFF DASHBOARD
   - Opens immediately after a successful staff login
   - Principal publishes live announcements
   - All authenticated staff read announcements, approved leave and plans
   - Website Admin can read and delete old announcements
   ========================================================= */

let staffDashboardClockTimer=null;
let staffDashboardRealtimeChannel=null;
let staffDashboardToastTimer=null;
let staffAnnouncementAcknowledgementCache=new Map();
let staffAnnouncementRecordCache=new Map();
let staffAnnouncementReadStatusId=null;

function staffDashboardIsPrincipal(){
    return !!loggedInStaff && loggedInStaff.username===PRINCIPAL_STAFF_ID;
}

function staffDashboardFormatPublished(value){
    if(!value) return "Just now";
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-GB",{
        day:"2-digit",month:"short",year:"numeric",
        hour:"2-digit",minute:"2-digit",hour12:true,
        timeZone:"Asia/Kathmandu"
    }).format(date);
}

function staffDashboardFormatMeetingTime(value){
    if(!value) return "";
    const parts=String(value).split(":");
    const hour=Number(parts[0]);
    const minute=Number(parts[1]||0);
    if(!Number.isInteger(hour) || hour<0 || hour>23 || !Number.isInteger(minute)) return String(value);
    const period=hour>=12?"PM":"AM";
    const displayHour=hour%12||12;
    return `${displayHour}:${String(minute).padStart(2,"0")} ${period}`;
}

function staffDashboardRequiredStaff(){
    return Object.entries(STAFF_LOGIN_DIRECTORY)
        .filter(([staffId])=>staffId!==PRINCIPAL_STAFF_ID)
        .map(([staffId,staff])=>({staffId,...staff}));
}

function staffDashboardEventDetailsHtml(row){
    const items=[];
    if(row.event_date_bs) items.push(["📅 Date (B.S.)",row.event_date_bs]);
    if(row.event_day) items.push(["🗓 Day / बार",row.event_day]);
    if(row.event_time) items.push(["🕘 Time",staffDashboardFormatMeetingTime(row.event_time)]);
    if(row.venue) items.push(["📍 Meeting Place",row.venue]);
    if(!items.length) return "";

    return `<div class="staff-dashboard-event-details">
        ${items.map(([label,value])=>`
            <div class="staff-dashboard-event-detail">
                <span class="staff-dashboard-event-label">${escapeHtml(label)}</span>
                <span class="staff-dashboard-event-value">${escapeHtml(value)}</span>
            </div>`).join("")}
    </div>`;
}

function staffDashboardAcknowledgementHtml(row,acknowledgements){
    if(staffDashboardIsPrincipal()){
        const required=staffDashboardRequiredStaff();
        const respondedIds=new Set((acknowledgements||[]).map(item=>normalizeStaffId(item.staff_id)));
        const responded=required.filter(item=>respondedIds.has(item.staffId)).length;
        return `
            <div class="staff-announcement-acknowledgement">
                <span class="staff-announcement-ack-note">
                    <strong>${responded} of ${required.length}</strong> staff responded
                </span>
                <button type="button" class="staff-announcement-principal-status"
                        onclick="openAnnouncementReadStatus(${Number(row.id)})">
                    VIEW WHO READ / NOT READ
                </button>
            </div>`;
    }

    const own=(acknowledgements||[]).find(item=>normalizeStaffId(item.staff_id)===loggedInStaff?.username);
    if(own){
        const label=own.response==="yes_sir"?"YES SIR":"READ";
        return `
            <div class="staff-announcement-acknowledgement">
                <span class="staff-announcement-ack-done">✓ Acknowledged: ${label}</span>
                <span class="staff-announcement-ack-note">${escapeHtml(staffDashboardFormatPublished(own.acknowledged_at))}</span>
            </div>`;
    }

    return `
        <div class="staff-announcement-acknowledgement">
            <span class="staff-announcement-ack-note">Please confirm that you have read this announcement.</span>
            <div class="staff-announcement-ack-actions">
                <button type="button" class="staff-announcement-ack-btn read"
                        onclick="acknowledgeStaffAnnouncement(${Number(row.id)},'read',this)">✓ READ</button>
                <button type="button" class="staff-announcement-ack-btn yes-sir"
                        onclick="acknowledgeStaffAnnouncement(${Number(row.id)},'yes_sir',this)">YES SIR</button>
            </div>
        </div>`;
}

function staffDashboardGreeting(){
    const hour=Number(new Intl.DateTimeFormat("en-GB",{
        hour:"2-digit",hour12:false,timeZone:"Asia/Kathmandu"
    }).format(new Date()).replace(/^24$/,"0"));

    if(hour<12) return "Good Morning";
    if(hour<17) return "Good Afternoon";
    return "Good Evening";
}

function updateStaffDashboardClock(){
    const now=new Date();
    const time=document.getElementById("staffDashboardTime");
    const date=document.getElementById("staffDashboardDate");
    const greeting=document.getElementById("staffDashboardGreeting");
    const role=document.getElementById("staffDashboardRole");

    if(time){
        time.textContent=new Intl.DateTimeFormat("en-US",{
            hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true,
            timeZone:"Asia/Kathmandu"
        }).format(now);
    }
    if(date){
        date.textContent=new Intl.DateTimeFormat("en-GB",{
            weekday:"long",day:"2-digit",month:"long",year:"numeric",
            timeZone:"Asia/Kathmandu"
        }).format(now);
    }
    if(greeting){
        greeting.textContent=`${staffDashboardGreeting()}, ${loggedInStaff?.name||"Staff"}`;
    }
    if(role){
        role.textContent=`${loggedInStaff?.designation||"Staff Member"} • Smart Staff Dashboard`;
    }
}

function startStaffDashboardClock(){
    if(staffDashboardClockTimer) clearInterval(staffDashboardClockTimer);
    updateStaffDashboardClock();
    staffDashboardClockTimer=setInterval(updateStaffDashboardClock,1000);
}

function stopStaffDashboardClock(){
    if(staffDashboardClockTimer){
        clearInterval(staffDashboardClockTimer);
        staffDashboardClockTimer=null;
    }
}

function showStaffDashboardToast(message){
    const toast=document.getElementById("staffDashboardToast");
    if(!toast) return;
    toast.textContent=message;
    toast.classList.add("show");
    if(staffDashboardToastTimer) clearTimeout(staffDashboardToastTimer);
    staffDashboardToastTimer=setTimeout(()=>toast.classList.remove("show"),3200);
}

function showStaffAnnouncementMessage(message,type="error"){
    const box=document.getElementById("staffAnnouncementMessageBox");
    if(!box) return;
    box.textContent=message;
    box.className=`staff-announcement-message show ${type}`;
}

function clearStaffAnnouncementMessage(){
    const box=document.getElementById("staffAnnouncementMessageBox");
    if(!box) return;
    box.textContent="";
    box.className="staff-announcement-message";
}

function getLoggedInStaffPhoto(){
    const fallbackPhoto="logo.jpeg";
    if(!loggedInStaff) return fallbackPhoto;

    const username=normalizeStaffId(loggedInStaff.username);
    const staffKeyAliases={
        suresh:"ceo",
        sanjeev:"md",
        joseph:"principal",
        ranjana:"viceprincipal",
        sagar:"payroll"
    };
    const possibleKeys=[username,staffKeyAliases[username]].filter(Boolean);
    const managedSource=(typeof adminManagedStaff==="object" && adminManagedStaff)
        ? adminManagedStaff
        : {};
    const staticSource=(typeof staffDetails==="object" && staffDetails)
        ? staffDetails
        : {};

    for(const source of [managedSource,staticSource]){
        for(const key of possibleKeys){
            const staff=source[key];
            const photo=staff?.photo || staff?.photo_url;
            if(photo) return photo;
        }
    }

    const loginName=String(loggedInStaff.name||"").trim().toLowerCase();
    for(const source of [managedSource,staticSource]){
        const matched=Object.values(source).find(staff=>
            String(staff?.name||"").trim().toLowerCase()===loginName
        );
        const photo=matched?.photo || matched?.photo_url;
        if(photo) return photo;
    }

    return fallbackPhoto;
}

function updateStaffDashboardProfilePhoto(){
    const photo=document.getElementById("staffDashboardProfilePhoto");
    if(!photo) return;

    const fallbackPhoto="logo.jpeg";
    photo.onerror=function(){
        this.onerror=null;
        this.src=fallbackPhoto;
        this.alt="St. Augustine logo";
    };
    photo.src=getLoggedInStaffPhoto();
    photo.alt=loggedInStaff?.name
        ? `${loggedInStaff.name} profile photo`
        : "Staff profile photo";
}

async function openStaffDashboard(){
    if(!loggedInStaff || !staffAuthSession){
        openStaffLogin();
        return;
    }

    const popup=document.getElementById("staffDashboardPopup");
    const form=document.getElementById("staffAnnouncementForm");
    const leaveAction=document.getElementById("staffDashboardLeaveAction");

    if(form) form.classList.toggle("show",staffDashboardIsPrincipal());
    if(leaveAction){
        leaveAction.textContent=staffDashboardIsPrincipal()
            ? "📋 Review Leave Requests"
            : "📝 Leave Application";
    }

    updateStaffDashboardProfilePhoto();

    clearStaffAnnouncementMessage();
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    startStaffDashboardClock();
    subscribeStaffDashboardRealtime();
    await refreshStaffDashboard(false);
}

function closeStaffDashboard(){
    const popup=document.getElementById("staffDashboardPopup");
    const readStatus=document.getElementById("announcementReadStatusPopup");
    if(popup) popup.style.display="none";
    if(readStatus) readStatus.style.display="none";
    staffAnnouncementReadStatusId=null;
    document.body.style.overflow="auto";
    stopStaffDashboardClock();
}

function openDashboardFeature(feature){
    closeStaffDashboard();
    if(feature==="approved"){
        openApprovedStaffLeaves();
        return;
    }
    if(feature==="plans"){
        openUpcomingPlans();
        return;
    }
    if(feature==="ideas"){
        openStaffIdeaHub();
        return;
    }
    if(feature==="leave"){
        if(staffDashboardIsPrincipal()) openPrincipalLeaveRequests();
        else openStaffLeaveForm();
    }
}

async function refreshStaffDashboard(showConfirmation=true){
    if(!loggedInStaff || !staffAuthSession) return;
    await Promise.all([
        loadStaffDashboardAnnouncements(),
        loadStaffDashboardLeaves(),
        loadStaffDashboardPlans(),
        loadStaffDashboardIdeas()
    ]);
    if(showConfirmation) showStaffDashboardToast("Dashboard updated successfully.");
}

async function loadStaffDashboardAnnouncements(){
    const host=document.getElementById("staffDashboardAnnouncementList");
    const counter=document.getElementById("staffDashboardNoticeCount");
    if(!host) return;

    host.innerHTML='<div class="staff-dashboard-empty">Loading staff announcements...</div>';

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error,count}=await db
            .from("staff_announcements")
            .select("id,title,message,remarks,priority,event_date_bs,event_day,event_time,venue,published_at,created_at",{count:"exact"})
            .order("published_at",{ascending:false})
            .limit(6);

        if(error) throw error;
        if(counter) counter.textContent=String(count??data?.length??0);

        if(!data?.length){
            staffAnnouncementAcknowledgementCache=new Map();
            staffAnnouncementRecordCache=new Map();
            host.innerHTML='<div class="staff-dashboard-empty">No staff announcements have been published.</div>';
            return;
        }

        staffAnnouncementRecordCache=new Map(data.map(row=>[String(row.id),row]));
        const acknowledgementIds=data.map(row=>Number(row.id));
        let acknowledgementRows=[];

        if(acknowledgementIds.length){
            const {data:ackData,error:ackError}=await db
                .from("staff_announcement_acknowledgements")
                .select("announcement_id,staff_id,staff_name,response,acknowledged_at")
                .in("announcement_id",acknowledgementIds);

            if(ackError){
                console.error("Announcement acknowledgement load error:",ackError);
            }else{
                acknowledgementRows=ackData||[];
            }
        }

        staffAnnouncementAcknowledgementCache=new Map();
        acknowledgementRows.forEach(item=>{
            const key=String(item.announcement_id);
            if(!staffAnnouncementAcknowledgementCache.has(key)){
                staffAnnouncementAcknowledgementCache.set(key,[]);
            }
            staffAnnouncementAcknowledgementCache.get(key).push(item);
        });

        const now=Date.now();
        host.innerHTML=data.map(row=>{
            const priority=["urgent","important"].includes(String(row.priority||"").toLowerCase())
                ? String(row.priority).toLowerCase()
                : "normal";
            const published=row.published_at||row.created_at;
            const publishedTime=new Date(published||0).getTime();
            const isNew=Number.isFinite(publishedTime) && now-publishedTime<48*60*60*1000;
            const acknowledgements=staffAnnouncementAcknowledgementCache.get(String(row.id))||[];
            return `
                <article class="staff-dashboard-notice ${priority}">
                    <div class="staff-dashboard-notice-top">
                        <div class="staff-dashboard-notice-title">
                            ${escapeHtml(row.title||"Staff Announcement")}
                            ${isNew?'<span class="staff-dashboard-new">NEW</span>':""}
                        </div>
                        <span class="staff-dashboard-priority">${escapeHtml(priority)}</span>
                    </div>
                    <div class="staff-dashboard-notice-message">${escapeHtml(row.message||"")}</div>
                    ${staffDashboardEventDetailsHtml(row)}
                    ${row.remarks?`
                        <div class="staff-dashboard-notice-message">
                            <strong>Remarks:</strong> ${escapeHtml(row.remarks)}
                        </div>`:""}
                    ${staffDashboardAcknowledgementHtml(row,acknowledgements)}
                    <div class="staff-dashboard-notice-meta">
                        <span>Principal • ${escapeHtml(staffDashboardFormatPublished(published))}</span>
                        ${staffDashboardIsPrincipal()?`
                            <button type="button" class="staff-dashboard-notice-delete"
                                    onclick="deleteStaffAnnouncement(${Number(row.id)},this)">Delete</button>`:""}
                    </div>
                </article>`;
        }).join("");
    }catch(error){
        console.error("Staff dashboard announcement load error:",error);
        if(counter) counter.textContent="0";
        staffAnnouncementAcknowledgementCache=new Map();
        staffAnnouncementRecordCache=new Map();
        host.innerHTML='<div class="staff-dashboard-empty">No staff announcements have been published.</div>';
    }
}

async function loadStaffDashboardLeaves(){
    const host=document.getElementById("staffDashboardLeavePreview");
    const counter=document.getElementById("staffDashboardLeaveCount");
    if(!host) return;

    host.innerHTML='<div class="staff-dashboard-empty">Loading approved leave...</div>';
    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error,count}=await db
            .from("leave_applications")
            .select("staff_name,leave_from_bs,leave_to_bs",{count:"exact"})
            .eq("status","approved")
            .order("leave_from_bs",{ascending:true})
            .limit(3);

        if(error) throw error;
        if(counter) counter.textContent=String(count??data?.length??0);
        if(!data?.length){
            host.innerHTML='<div class="staff-dashboard-empty">No approved leave found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>`
            <div class="staff-dashboard-preview">
                <strong>${escapeHtml(formatLeaveValue(row.staff_name,"Staff"))}</strong>
                <span>Leave: ${escapeHtml(formatApprovedLeaveDate(row))}</span>
            </div>`).join("");
    }catch(error){
        console.error("Staff dashboard leave load error:",error);
        if(counter) counter.textContent="0";
        host.innerHTML='<div class="staff-dashboard-empty">Approved leave could not be loaded.</div>';
    }
}

async function loadStaffDashboardPlans(){
    const host=document.getElementById("staffDashboardPlanPreview");
    const counter=document.getElementById("staffDashboardPlanCount");
    if(!host) return;

    host.innerHTML='<div class="staff-dashboard-empty">Loading upcoming plans...</div>';
    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error,count}=await db
            .from("upcoming_plans")
            .select("plan_date_bs,plan_name,incharge_name",{count:"exact"})
            .order("plan_date_bs",{ascending:true})
            .limit(3);

        if(error) throw error;
        if(counter) counter.textContent=String(count??data?.length??0);
        if(!data?.length){
            host.innerHTML='<div class="staff-dashboard-empty">No upcoming plans found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>`
            <div class="staff-dashboard-preview">
                <strong>${escapeHtml(formatLeaveValue(row.plan_name,"Plan"))}</strong>
                <span>${escapeHtml(formatLeaveValue(row.plan_date_bs))} • Incharge: ${escapeHtml(formatLeaveValue(row.incharge_name))}</span>
            </div>`).join("");
    }catch(error){
        console.error("Staff dashboard plan load error:",error);
        if(counter) counter.textContent="0";
        host.innerHTML='<div class="staff-dashboard-empty">Upcoming plans could not be loaded.</div>';
    }
}

async function loadStaffDashboardIdeas(){
    const host=document.getElementById("staffDashboardIdeaPreview");
    const counter=document.getElementById("staffDashboardIdeaCount");
    if(!host) return;

    host.innerHTML='<div class="staff-dashboard-empty">Loading staff ideas...</div>';
    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error,count}=await db
            .from("staff_ideas")
            .select("title,staff_name,status,created_at",{count:"exact"})
            .order("created_at",{ascending:false})
            .limit(3);

        if(error) throw error;
        if(counter) counter.textContent=String(count??data?.length??0);
        if(!data?.length){
            host.innerHTML='<div class="staff-dashboard-empty">No staff ideas have been shared yet.</div>';
            return;
        }

        host.innerHTML=data.map(row=>`
            <div class="staff-dashboard-preview">
                <strong>${escapeHtml(row.title||"Staff Idea")}</strong>
                <span>${escapeHtml(row.staff_name||"Staff")} • ${escapeHtml(staffIdeaStatusLabel(row.status))}</span>
            </div>`).join("");
    }catch(error){
        console.error("Staff dashboard idea load error:",error);
        if(counter) counter.textContent="0";
        host.innerHTML='<div class="staff-dashboard-empty">Staff ideas could not be loaded.</div>';
    }
}

async function submitStaffAnnouncement(event){
    event.preventDefault();

    if(!staffDashboardIsPrincipal() || !staffAuthSession?.user?.id){
        showStaffAnnouncementMessage("Principal login is required.");
        return;
    }

    const form=document.getElementById("staffAnnouncementForm");
    if(!form?.checkValidity()){
        form?.reportValidity();
        return;
    }

    const title=document.getElementById("staffAnnouncementTitle")?.value.trim()||"";
    const message=document.getElementById("staffAnnouncementMessage")?.value.trim()||"";
    const remarks=document.getElementById("staffAnnouncementRemarks")?.value.trim()||"";
    const priority=document.getElementById("staffAnnouncementPriority")?.value||"normal";
    const eventDate=document.getElementById("staffAnnouncementEventDate")?.value.trim()||"";
    const eventDay=document.getElementById("staffAnnouncementEventDay")?.value||"";
    const eventTime=document.getElementById("staffAnnouncementEventTime")?.value||"";
    const venue=document.getElementById("staffAnnouncementVenue")?.value.trim()||"";
    const button=document.getElementById("staffAnnouncementSubmitBtn");
    const oldText=button?.textContent||"PUBLISH ANNOUNCEMENT";

    if(!title || !message){
        showStaffAnnouncementMessage("Enter the announcement title and message.");
        return;
    }

    if(eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)){
        showStaffAnnouncementMessage("Enter the Meeting/Event Date (B.S.) in YYYY-MM-DD format.");
        return;
    }

    if(button){
        button.disabled=true;
        button.textContent="Publishing...";
    }

    try{
        const db=initStaffSupabase();
        const {error}=await db
            .from("staff_announcements")
            .insert({
                title,
                message,
                remarks:remarks||null,
                priority:["normal","important","urgent"].includes(priority)?priority:"normal",
                event_date_bs:eventDate||null,
                event_day:eventDay||null,
                event_time:eventTime||null,
                venue:venue||null,
                created_by:staffAuthSession.user.id
            });

        if(error) throw error;
        form.reset();
        showStaffAnnouncementMessage("Announcement published successfully.","success");
        showStaffDashboardToast("New announcement is now live for all staff.");
        await loadStaffDashboardAnnouncements();
    }catch(error){
        console.error("Staff announcement publish error:",error);
        showStaffAnnouncementMessage("Could not publish announcement: "+(error?.message||"Unknown error"));
    }finally{
        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
}

async function acknowledgeStaffAnnouncement(announcementId,response,button){
    if(!loggedInStaff || !staffAuthSession?.user?.id || staffDashboardIsPrincipal()){
        alert("A valid staff login is required.");
        return;
    }

    const announcement=staffAnnouncementRecordCache.get(String(announcementId));
    if(!announcement){
        alert("Announcement information could not be found. Please refresh the dashboard.");
        return;
    }

    const safeResponse=response==="yes_sir"?"yes_sir":"read";
    const actionBox=button?.closest(".staff-announcement-ack-actions");
    const buttons=actionBox?.querySelectorAll("button")||[];
    buttons.forEach(item=>item.disabled=true);

    try{
        const db=initStaffSupabase();
        const {error}=await db
            .from("staff_announcement_acknowledgements")
            .upsert({
                announcement_id:Number(announcementId),
                user_id:staffAuthSession.user.id,
                staff_id:loggedInStaff.username,
                staff_name:loggedInStaff.name,
                response:safeResponse,
                acknowledged_at:new Date().toISOString()
            },{onConflict:"announcement_id,staff_id"});

        if(error) throw error;
        await loadStaffDashboardAnnouncements();
        showStaffDashboardToast(safeResponse==="yes_sir"
            ? "Your YES SIR response was recorded."
            : "Your READ response was recorded.");
    }catch(error){
        console.error("Announcement acknowledgement error:",error);
        alert("Your response could not be saved: "+(error?.message||"Unknown error"));
        buttons.forEach(item=>item.disabled=false);
    }
}

function openAnnouncementReadStatus(announcementId){
    if(!staffDashboardIsPrincipal()){
        alert("Principal login is required.");
        return;
    }

    const announcement=staffAnnouncementRecordCache.get(String(announcementId));
    if(!announcement){
        alert("Announcement information could not be found. Please refresh the dashboard.");
        return;
    }

    staffAnnouncementReadStatusId=Number(announcementId);

    const required=staffDashboardRequiredStaff();
    const acknowledgements=staffAnnouncementAcknowledgementCache.get(String(announcementId))||[];
    const responseByStaffId=new Map(
        acknowledgements.map(item=>[normalizeStaffId(item.staff_id),item])
    );
    const responded=required.filter(item=>responseByStaffId.has(item.staffId)).length;

    const title=document.getElementById("announcementReadStatusTitle");
    const subtitle=document.getElementById("announcementReadStatusSubtitle");
    const total=document.getElementById("announcementReadTotal");
    const read=document.getElementById("announcementReadCount");
    const unread=document.getElementById("announcementUnreadCount");
    const host=document.getElementById("announcementReadStatusList");

    if(title) title.textContent="Announcement Read Status";
    if(subtitle) subtitle.textContent=announcement.title||"Important Announcement";
    if(total) total.textContent=String(required.length);
    if(read) read.textContent=String(responded);
    if(unread) unread.textContent=String(Math.max(0,required.length-responded));

    if(host){
        host.innerHTML=required.map(staff=>{
            const acknowledgement=responseByStaffId.get(staff.staffId);
            const response=acknowledgement?.response==="yes_sir"
                ? "yes_sir"
                : acknowledgement?"read":"unread";
            const label=response==="yes_sir"?"✓ YES SIR":response==="read"?"✓ READ":"○ NOT READ";
            return `
                <div class="announcement-read-status-row">
                    <div>
                        <div class="announcement-read-staff-name">${escapeHtml(staff.name||staff.staffId)}</div>
                        <div class="announcement-read-staff-role">${escapeHtml(staff.designation||"Staff")}</div>
                    </div>
                    <div class="announcement-read-result">
                        <span class="announcement-read-badge ${response}">${label}</span>
                        ${acknowledgement?`
                            <span class="announcement-read-time">${escapeHtml(staffDashboardFormatPublished(acknowledgement.acknowledged_at))}</span>`:""}
                    </div>
                </div>`;
        }).join("");
    }

    const popup=document.getElementById("announcementReadStatusPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
}

function closeAnnouncementReadStatus(){
    const popup=document.getElementById("announcementReadStatusPopup");
    if(popup) popup.style.display="none";
    staffAnnouncementReadStatusId=null;
    const dashboard=document.getElementById("staffDashboardPopup");
    document.body.style.overflow=dashboard?.style.display==="block"?"hidden":"auto";
}

async function deleteStaffAnnouncement(id,button){
    if(!staffDashboardIsPrincipal() || !staffAuthSession){
        alert("Principal login is required.");
        return;
    }
    if(!confirm("Delete this staff announcement permanently?")) return;

    const oldText=button?.textContent||"Delete";
    if(button){button.disabled=true;button.textContent="Deleting...";}

    try{
        const db=initStaffSupabase();
        const {error}=await db.from("staff_announcements").delete().eq("id",id);
        if(error) throw error;
        await loadStaffDashboardAnnouncements();
        showStaffDashboardToast("Announcement deleted.");
    }catch(error){
        console.error("Staff announcement delete error:",error);
        alert("Could not delete announcement: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

function subscribeStaffDashboardRealtime(){
    const db=initStaffSupabase();
    if(!db || !staffAuthSession?.user?.id) return;

    if(staffDashboardRealtimeChannel){
        db.removeChannel(staffDashboardRealtimeChannel);
        staffDashboardRealtimeChannel=null;
    }

    staffDashboardRealtimeChannel=db
        .channel(`staff-dashboard-${staffAuthSession.user.id}`)
        .on("postgres_changes",{
            event:"*",schema:"public",table:"staff_announcements"
        },()=>{
            loadStaffDashboardAnnouncements();
            const popup=document.getElementById("staffDashboardPopup");
            if(popup?.style.display==="block"){
                showStaffDashboardToast("Staff announcement updated live.");
            }
        })
        .on("postgres_changes",{
            event:"*",schema:"public",table:"staff_announcement_acknowledgements"
        },()=>{
            loadStaffDashboardAnnouncements().then(()=>{
                if(staffAnnouncementReadStatusId && staffDashboardIsPrincipal()){
                    openAnnouncementReadStatus(staffAnnouncementReadStatusId);
                }
            });
            const popup=document.getElementById("staffDashboardPopup");
            if(popup?.style.display==="block" && staffDashboardIsPrincipal()){
                showStaffDashboardToast("A staff response was received live.");
            }
        })
        .on("postgres_changes",{
            event:"*",schema:"public",table:"staff_ideas"
        },()=>{
            loadStaffDashboardIdeas();
            const hub=document.getElementById("staffIdeaHubPopup");
            if(hub?.style.display==="block") loadStaffIdeas();
        })
        .on("postgres_changes",{
            event:"*",schema:"public",table:"staff_idea_helpers"
        },()=>{
            loadStaffDashboardIdeas();
            const hub=document.getElementById("staffIdeaHubPopup");
            if(hub?.style.display==="block") loadStaffIdeas();
        })
        .on("postgres_changes",{
            event:"*",schema:"public",table:"marks_projects"
        },()=>{
            if(!staffDashboardIsPrincipal()) return;
            loadPrincipalMarksNotifications();
            const popup=document.getElementById("staffDashboardPopup");
            if(popup?.style.display==="block"){
                showStaffDashboardToast("Marks submission information was updated live.");
            }
        })
        .subscribe();
}

function unsubscribeStaffDashboardRealtime(){
    const db=initStaffSupabase();
    if(db && staffDashboardRealtimeChannel) db.removeChannel(staffDashboardRealtimeChannel);
    staffDashboardRealtimeChannel=null;
}

/* The launch view shows one clean Dashboard button; detailed actions live inside it. */
const dashboardOriginalUpdateStaffLoginUI=updateStaffLoginUI;
updateStaffLoginUI=function(){
    dashboardOriginalUpdateStaffLoginUI();
    const dashboard=document.getElementById("staffDashboardOpenBtn");
    const leave=document.getElementById("staffLeaveOpenBtn");
    const approved=document.getElementById("staffApprovedLeaveOpenBtn");
    const upcoming=document.getElementById("staffUpcomingPlanOpenBtn");
    const active=!!loggedInStaff;

    if(dashboard) dashboard.style.display=active?"inline-block":"none";
    if(leave) leave.style.display="none";
    if(approved) approved.style.display="none";
    if(upcoming) upcoming.style.display="none";
};

const dashboardOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeStaffDashboard();
    unsubscribeStaffDashboardRealtime();
    await dashboardOriginalStaffLogout();
};

/* Website Admin: read and delete announcements without changing Principal publishing rights. */
async function renderAdminStaffAnnouncements(){
    const host=document.getElementById("adminStaffAnnouncementList");
    if(!host) return;
    if(!studentAdminSession?.access_token){
        host.innerHTML='<div class="review-empty">Admin login is required.</div>';
        return;
    }

    host.innerHTML='<div class="review-empty">Loading staff announcements...</div>';
    try{
        const db=initStudentSupabase();
        const {data,error}=await db
            .from("staff_announcements")
            .select("id,title,message,remarks,priority,event_date_bs,event_day,event_time,venue,published_at,created_at")
            .order("published_at",{ascending:false});

        if(error) throw error;
        if(!data?.length){
            host.innerHTML='<div class="review-empty">No staff announcements found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>`
            <div class="admin-leave-card">
                <div class="admin-leave-head">
                    <div>
                        <strong>${escapeHtml(row.title||"Staff Announcement")}</strong>
                        <div class="staff-account-id">
                            ${escapeHtml(String(row.priority||"normal").toUpperCase())} •
                            ${escapeHtml(staffDashboardFormatPublished(row.published_at||row.created_at))}
                        </div>
                    </div>
                    <button type="button" class="admin-leave-delete-btn"
                            onclick="adminDeleteStaffAnnouncement(${Number(row.id)},this)">
                        🗑 Delete Announcement
                    </button>
                </div>
                <div style="margin-top:10px;white-space:pre-wrap;overflow-wrap:anywhere">
                    ${escapeHtml(row.message||"—")}
                </div>
                ${staffDashboardEventDetailsHtml(row)}
                ${row.remarks?`
                    <div style="margin-top:10px;white-space:pre-wrap;overflow-wrap:anywhere">
                        <strong>Remarks:</strong> ${escapeHtml(row.remarks)}
                    </div>`:""}
            </div>`).join("");
    }catch(error){
        console.error("Admin staff announcement list error:",error);
        host.innerHTML=`<div class="review-empty">Could not load staff announcements: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function adminDeleteStaffAnnouncement(id,button){
    if(!studentAdminSession?.access_token){
        alert("Admin login is required.");
        return;
    }
    if(!confirm("Delete this staff announcement permanently?")) return;

    const oldText=button?.textContent||"Delete Announcement";
    if(button){button.disabled=true;button.textContent="Deleting...";}

    try{
        const db=initStudentSupabase();
        const {error}=await db.from("staff_announcements").delete().eq("id",id);
        if(error) throw error;
        await renderAdminStaffAnnouncements();
        alert("Staff announcement deleted successfully.");
    }catch(error){
        console.error("Admin staff announcement delete error:",error);
        alert("Could not delete staff announcement: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

/* ===== SOURCE SCRIPT BLOCK: staff-idea-hub-js ===== */
/* =========================================================
   STAFF IDEA HUB
   - Every authenticated staff member can share and read ideas
   - A colleague can select I CAN HELP once per idea
   - Principal manages idea status
   - Website Admin can read and delete ideas
   ========================================================= */

function staffIdeaStatusClass(value){
    const status=String(value||"new").toLowerCase();
    return ["under_discussion","approved","completed"].includes(status)?status:"new";
}

function staffIdeaStatusLabel(value){
    const status=staffIdeaStatusClass(value);
    return status==="under_discussion"
        ? "Under Discussion"
        : status.charAt(0).toUpperCase()+status.slice(1);
}

function showStaffIdeaMessage(message,type="error"){
    const box=document.getElementById("staffIdeaMessage");
    if(!box) return;
    box.textContent=message;
    box.className=`staff-idea-message show ${type}`;
}

function clearStaffIdeaMessage(){
    const box=document.getElementById("staffIdeaMessage");
    if(!box) return;
    box.textContent="";
    box.className="staff-idea-message";
}

async function openStaffIdeaHub(){
    if(!loggedInStaff || !staffAuthSession?.user?.id){
        openStaffLogin();
        return;
    }

    const author=document.getElementById("staffIdeaAuthorName");
    const designation=document.getElementById("staffIdeaAuthorDesignation");
    if(author) author.textContent=loggedInStaff.name||"Staff";
    if(designation) designation.textContent=loggedInStaff.designation||"Staff Member";

    clearStaffIdeaMessage();
    const popup=document.getElementById("staffIdeaHubPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await loadStaffIdeas();
}

function closeStaffIdeaHub(){
    const popup=document.getElementById("staffIdeaHubPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function submitStaffIdea(event){
    event.preventDefault();

    if(!loggedInStaff || !staffAuthSession?.user?.id){
        showStaffIdeaMessage("Your staff session has expired. Please log in again.");
        return;
    }

    const form=document.getElementById("staffIdeaForm");
    if(!form?.checkValidity()){
        form?.reportValidity();
        return;
    }

    const title=document.getElementById("staffIdeaTitle")?.value.trim()||"";
    const description=document.getElementById("staffIdeaDescription")?.value.trim()||"";
    const schoolUse=document.getElementById("staffIdeaSchoolUse")?.value.trim()||"";
    const supportNeeded=document.getElementById("staffIdeaSupportNeeded")?.value.trim()||"";
    const button=document.getElementById("staffIdeaSubmitBtn");
    const oldText=button?.textContent||"SHARE IDEA";

    if(!title || !description || !schoolUse){
        showStaffIdeaMessage("Enter the idea title, description and how the school can use it.");
        return;
    }

    if(button){button.disabled=true;button.textContent="Sharing...";}
    clearStaffIdeaMessage();

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {error}=await db.from("staff_ideas").insert({
            created_by:staffAuthSession.user.id,
            staff_id:loggedInStaff.username,
            staff_name:loggedInStaff.name,
            designation:loggedInStaff.designation,
            title,
            description,
            school_use:schoolUse,
            support_needed:supportNeeded||null,
            status:"new"
        });

        if(error) throw error;
        form.reset();
        showStaffIdeaMessage("Your idea was shared successfully.","success");
        await Promise.all([loadStaffIdeas(),loadStaffDashboardIdeas()]);
    }catch(error){
        console.error("Staff idea submit error:",error);
        showStaffIdeaMessage("Could not share the idea: "+(error?.message||"Unknown error"));
    }finally{
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function loadStaffIdeas(){
    const host=document.getElementById("staffIdeaList");
    if(!host) return;

    if(!loggedInStaff || !staffAuthSession?.user?.id){
        host.innerHTML='<div class="staff-idea-empty">Staff login is required.</div>';
        return;
    }

    host.innerHTML='<div class="staff-idea-empty">Loading staff ideas...</div>';

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data:ideas,error}=await db
            .from("staff_ideas")
            .select("id,staff_id,staff_name,designation,title,description,school_use,support_needed,status,created_at,updated_at")
            .order("created_at",{ascending:false});

        if(error) throw error;
        if(!ideas?.length){
            host.innerHTML='<div class="staff-idea-empty">No ideas have been shared yet. Be the first to share one.</div>';
            return;
        }

        const ideaIds=ideas.map(row=>Number(row.id)).filter(Number.isFinite);
        let helpers=[];
        if(ideaIds.length){
            const {data:helperData,error:helperError}=await db
                .from("staff_idea_helpers")
                .select("idea_id,user_id,staff_id,staff_name,created_at")
                .in("idea_id",ideaIds)
                .order("created_at",{ascending:true});
            if(helperError) throw helperError;
            helpers=helperData||[];
        }

        const helpersByIdea=new Map();
        helpers.forEach(item=>{
            const key=String(item.idea_id);
            if(!helpersByIdea.has(key)) helpersByIdea.set(key,[]);
            helpersByIdea.get(key).push(item);
        });

        host.innerHTML=ideas.map(row=>{
            const status=staffIdeaStatusClass(row.status);
            const ideaHelpers=helpersByIdea.get(String(row.id))||[];
            const isOwnIdea=normalizeStaffId(row.staff_id)===loggedInStaff.username;
            const alreadyHelping=ideaHelpers.some(item=>
                String(item.user_id||"")===String(staffAuthSession.user.id) ||
                normalizeStaffId(item.staff_id)===loggedInStaff.username
            );
            const helperNames=ideaHelpers.map(item=>item.staff_name||item.staff_id||"Staff");
            const helperText=helperNames.length
                ? `<strong>Ready to help (${helperNames.length}):</strong> ${helperNames.map(name=>escapeHtml(name)).join(", ")}`
                : "No staff member has offered help yet.";

            return `
                <article class="staff-idea-card">
                    <div class="staff-idea-card-head">
                        <div>
                            <div class="staff-idea-title">${escapeHtml(row.title||"Staff Idea")}</div>
                            <div class="staff-idea-meta">
                                ${escapeHtml(row.staff_name||"Staff")} • ${escapeHtml(row.designation||"Staff Member")} •
                                ${escapeHtml(staffDashboardFormatPublished(row.created_at))}
                            </div>
                        </div>
                        <span class="staff-idea-status ${status}">${escapeHtml(staffIdeaStatusLabel(status))}</span>
                    </div>

                    <div class="staff-idea-section">
                        <strong>Idea / Project Description</strong>${escapeHtml(row.description||"—")}
                    </div>
                    <div class="staff-idea-section">
                        <strong>How Can We Use This Idea?</strong>${escapeHtml(row.school_use||"—")}
                    </div>
                    ${row.support_needed?`
                        <div class="staff-idea-section">
                            <strong>Support Needed</strong>${escapeHtml(row.support_needed)}
                        </div>`:""}

                    <div class="staff-idea-footer">
                        <div class="staff-idea-helpers">${helperText}</div>
                        ${isOwnIdea
                            ? '<span class="staff-idea-own-note">Shared by you</span>'
                            : `<button type="button" class="staff-idea-help-btn ${alreadyHelping?"done":""}"
                                       onclick="supportStaffIdea(${Number(row.id)},this)" ${alreadyHelping?"disabled":""}>
                                   ${alreadyHelping?"✓ YOU CAN HELP":"I CAN HELP"}
                               </button>`}
                    </div>

                    ${staffDashboardIsPrincipal()?`
                        <div class="staff-idea-principal-controls">
                            <label for="staffIdeaStatus_${Number(row.id)}">Principal Status</label>
                            <select id="staffIdeaStatus_${Number(row.id)}"
                                    onchange="principalSetStaffIdeaStatus(${Number(row.id)},this.value,this)">
                                <option value="new" ${status==="new"?"selected":""}>New</option>
                                <option value="under_discussion" ${status==="under_discussion"?"selected":""}>Under Discussion</option>
                                <option value="approved" ${status==="approved"?"selected":""}>Approved</option>
                                <option value="completed" ${status==="completed"?"selected":""}>Completed</option>
                            </select>
                            <button type="button" class="admin-leave-delete-btn"
                                    style="margin-top:8px;"
                                    onclick="principalDeleteStaffIdea(${Number(row.id)},this)">
                                🗑 Delete Idea
                            </button>
                        </div>`:""}
                </article>`;
        }).join("");
    }catch(error){
        console.error("Staff idea load error:",error);
        host.innerHTML=`<div class="staff-idea-empty">Could not load staff ideas: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function supportStaffIdea(ideaId,button){
    if(!loggedInStaff || !staffAuthSession?.user?.id){
        alert("A valid staff login is required.");
        return;
    }

    const oldText=button?.textContent||"I CAN HELP";
    if(button){button.disabled=true;button.textContent="Saving...";}

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {error}=await db.from("staff_idea_helpers").insert({
            idea_id:Number(ideaId),
            user_id:staffAuthSession.user.id,
            staff_id:loggedInStaff.username,
            staff_name:loggedInStaff.name
        });

        if(error && error.code!=="23505") throw error;
        await Promise.all([loadStaffIdeas(),loadStaffDashboardIdeas()]);
        showStaffIdeaMessage("Your offer to help was recorded.","success");
    }catch(error){
        console.error("Staff idea help error:",error);
        alert("Could not save your offer to help: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function principalDeleteStaffIdea(ideaId,button){
    if(!staffDashboardIsPrincipal() || !staffAuthSession?.user?.id){
        alert("Principal login is required.");
        return;
    }
    if(!confirm("Delete this staff idea permanently?")) return;

    const oldText=button?.textContent||"Delete Idea";
    if(button){button.disabled=true;button.textContent="Deleting...";}

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {data,error}=await db
            .from("staff_ideas")
            .delete()
            .eq("id",Number(ideaId))
            .select("id");

        if(error) throw error;
        if(!data?.length) throw new Error("This Principal account does not currently have Supabase DELETE permission for staff ideas.");

        await Promise.all([loadStaffIdeas(),loadStaffDashboardIdeas()]);
        showStaffIdeaMessage("Staff idea deleted successfully.","success");
    }catch(error){
        console.error("Principal staff idea delete error:",error);
        alert("Could not delete staff idea: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function principalSetStaffIdeaStatus(ideaId,status,select){
    if(!staffDashboardIsPrincipal() || !staffAuthSession?.user?.id){
        alert("Principal login is required.");
        await loadStaffIdeas();
        return;
    }

    const safeStatus=staffIdeaStatusClass(status);
    if(select) select.disabled=true;

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Connection unavailable");

        const {error}=await db
            .from("staff_ideas")
            .update({status:safeStatus})
            .eq("id",Number(ideaId));

        if(error) throw error;
        await Promise.all([loadStaffIdeas(),loadStaffDashboardIdeas()]);
        showStaffIdeaMessage(`Idea status changed to ${staffIdeaStatusLabel(safeStatus)}.`,"success");
    }catch(error){
        console.error("Staff idea status error:",error);
        alert("Could not update idea status: "+(error?.message||"Unknown error"));
        await loadStaffIdeas();
    }finally{
        if(select) select.disabled=false;
    }
}

async function renderAdminStaffIdeas(){
    const host=document.getElementById("adminStaffIdeaList");
    if(!host) return;
    if(!studentAdminSession?.access_token){
        host.innerHTML='<div class="review-empty">Admin login is required.</div>';
        return;
    }

    host.innerHTML='<div class="review-empty">Loading staff ideas...</div>';
    try{
        const db=initStudentSupabase();
        const {data,error}=await db
            .from("staff_ideas")
            .select("id,staff_id,staff_name,designation,title,description,school_use,support_needed,status,created_at")
            .order("created_at",{ascending:false});

        if(error) throw error;
        if(!data?.length){
            host.innerHTML='<div class="review-empty">No staff ideas found.</div>';
            return;
        }

        host.innerHTML=data.map(row=>{
            const status=staffIdeaStatusClass(row.status);
            return `
                <div class="admin-leave-card">
                    <div class="admin-leave-head">
                        <div>
                            <strong>${escapeHtml(row.title||"Staff Idea")}</strong>
                            <div class="staff-account-id">
                                ${escapeHtml(row.staff_name||"Staff")} • ${escapeHtml(row.designation||"Staff Member")} •
                                ${escapeHtml(staffDashboardFormatPublished(row.created_at))}
                            </div>
                        </div>
                        <span class="staff-idea-status ${status}">${escapeHtml(staffIdeaStatusLabel(status))}</span>
                    </div>
                    <div style="margin-top:10px;white-space:pre-wrap;overflow-wrap:anywhere">
                        <strong>Idea:</strong> ${escapeHtml(row.description||"—")}
                    </div>
                    <div style="margin-top:9px;white-space:pre-wrap;overflow-wrap:anywhere">
                        <strong>School Use:</strong> ${escapeHtml(row.school_use||"—")}
                    </div>
                    ${row.support_needed?`
                        <div style="margin-top:9px;white-space:pre-wrap;overflow-wrap:anywhere">
                            <strong>Support Needed:</strong> ${escapeHtml(row.support_needed)}
                        </div>`:""}
                    <div style="margin-top:12px">
                        <button type="button" class="admin-leave-delete-btn"
                                onclick="adminDeleteStaffIdea(${Number(row.id)},this)">
                            🗑 Delete Idea
                        </button>
                    </div>
                </div>`;
        }).join("");
    }catch(error){
        console.error("Admin staff idea list error:",error);
        host.innerHTML=`<div class="review-empty">Could not load staff ideas: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function adminDeleteStaffIdea(ideaId,button){
    if(!studentAdminSession?.access_token){
        alert("Admin login is required.");
        return;
    }
    if(!confirm("Delete this staff idea permanently?")) return;

    const oldText=button?.textContent||"Delete Idea";
    if(button){button.disabled=true;button.textContent="Deleting...";}

    try{
        const db=initStudentSupabase();
        const {error}=await db.from("staff_ideas").delete().eq("id",Number(ideaId));
        if(error) throw error;
        await renderAdminStaffIdeas();
        alert("Staff idea deleted successfully.");
    }catch(error){
        console.error("Admin staff idea delete error:",error);
        alert("Could not delete staff idea: "+(error?.message||"Unknown error"));
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

const staffIdeaOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeStaffIdeaHub();
    await staffIdeaOriginalStaffLogout();
};

/* ===== SOURCE SCRIPT BLOCK: supabase-school-rating-js ===== */
/* =========================================================
   SCHOOL RATING — SUPABASE TOTAL + FORMSUBMIT NOTIFICATION
   - Saves the selected 1–5 stars through a protected RPC.
   - Starts the public total at 127 and keeps increasing it.
   - Continues the existing Gmail notification after saving.
   ========================================================= */

function formatPublicRatingTotal(value){
    const total=Math.max(0,Number(value)||0);

    if(total<1000) return String(Math.round(total));

    if(total<1000000){
        const thousands=total/1000;
        const text=thousands>=10 || Number.isInteger(thousands)
            ? String(Math.round(thousands))
            : thousands.toFixed(1).replace(/\.0$/,"");
        return `${text}K`;
    }

    const millions=total/1000000;
    const text=millions>=10 || Number.isInteger(millions)
        ? String(Math.round(millions))
        : millions.toFixed(1).replace(/\.0$/,"");
    return `${text}M`;
}

async function loadSchoolRatingTotal(){
    const output=document.getElementById("ratingTotalStars");
    if(!output) return;

    try{
        const db=initStudentSupabase();
        if(!db) throw new Error("Supabase is not connected.");

        const {data,error}=await db.rpc("get_school_rating_summary");
        if(error) throw error;

        const summary=Array.isArray(data)?data[0]:data;
        output.textContent=formatPublicRatingTotal(summary?.total_stars??127);
    }catch(error){
        console.error("Rating total load error:",error);
        output.textContent="127";
    }
}

document.addEventListener("submit",async function(event){
    const form=event.target;
    if(!form || form.id!=="reviewForm") return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if(!form.checkValidity()){
        form.reportValidity();
        return;
    }

    const selected=form.querySelector('input[name="School Rating"]:checked');
    const stars=Number.parseInt(selected?.value||"",10);
    const button=document.getElementById("reviewSubmit");
    const status=document.getElementById("reviewStatus");
    const oldText=button?.textContent||"⭐ Submit Rating";

    if(!Number.isInteger(stars) || stars<1 || stars>5){
        alert("Please select a rating from 1 to 5 stars.");
        return;
    }

    if(button){
        button.disabled=true;
        button.textContent="Saving rating...";
    }

    if(status){
        status.className="form-submit-status";
        status.style.display="block";
        status.textContent="Saving your rating securely...";
    }

    try{
        const db=initStudentSupabase();
        if(!db) throw new Error("Supabase is not connected.");

        const {error}=await db.rpc("submit_school_rating",{p_stars:stars});
        if(error) throw error;

        await loadSchoolRatingTotal();

        if(button) button.textContent="Sending notification...";
        if(status) status.textContent="Rating saved. Sending notification...";

        /* Supabase is saved; now continue the existing Gmail submission. */
        form.submit();
    }catch(error){
        console.error("Rating save error:",error);

        if(status){
            status.className="form-submit-status error";
            status.style.display="block";
            status.textContent="Rating could not be saved: "+(error?.message||"Unknown error");
        }

        if(button){
            button.disabled=false;
            button.textContent=oldText;
        }
    }
},true);

document.addEventListener("DOMContentLoaded",loadSchoolRatingTotal);

/* ===== SOURCE SCRIPT BLOCK: leave-success-professional-js ===== */
function closeLeaveSuccessPopup(){
  const popup=document.getElementById("leaveSuccessPopup");
  if(popup) popup.classList.remove("show");
  document.body.style.overflow="auto";
}
function openLeaveSuccessPopup(){
  const popup=document.getElementById("leaveSuccessPopup");
  if(popup){popup.classList.add("show");document.body.style.overflow="hidden";}
}
(function showLeaveSuccessAfterRedirect(){
  const params=new URLSearchParams(window.location.search);
  if(params.get("submitted")!=="1" || params.get("form")!=="leave") return;
  window.addEventListener("DOMContentLoaded",function(){
    openLeaveSuccessPopup();
    if(window.history && window.history.replaceState){
      window.history.replaceState({},document.title,window.location.pathname+window.location.hash);
    }
  });
})();

/* ===== SOURCE SCRIPT BLOCK: secure-marks-entry-js ===== */
/* =========================================================
   SECURE MARKS ENTRY SYSTEM
   - Class access comes from Supabase assignments, never from the browser alone.
   - Full Marks lives on each component and applies to every student.
   - No Grade or GPA calculation.
========================================================= */
const MARKS_CLASS_ORDER=[
    "Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5",
    "Class 6","Class 7","Class 8","Class 9","Class 10"
];

let marksTeacherAssignments=[];
let marksTeacherProjects=[];
let marksActiveProject=null;
let marksActiveComponents=[];
let marksActiveEntries=[];
let marksActiveStudents=[];
let marksAdminAssignments=[];
let marksAdminProjects=[];
let marksAdminActiveData=null;

function marksStatusLabel(status){
    return status==="submitted"?"Submitted to Admin":status==="returned"?"Returned for Correction":"Draft";
}
function marksStatusHtml(status){
    const safe=["draft","submitted","returned"].includes(status)?status:"draft";
    return `<span class="marks-status ${safe}">${escapeHtml(marksStatusLabel(safe))}</span>`;
}
function marksNumber(value){
    if(value===null || value===undefined || value==="") return "";
    const number=Number(value);
    if(!Number.isFinite(number)) return "";
    return Number.isInteger(number)?String(number):String(Number(number.toFixed(2)));
}
function marksProjectEditable(project=marksActiveProject){
    return !!project && ["draft","returned"].includes(project.status);
}
function marksFormatDate(value){
    if(!value) return "—";
    if(typeof staffDashboardFormatPublished==="function") return staffDashboardFormatPublished(value);
    return new Date(value).toLocaleString();
}
function marksShowTeacherMessage(message,type="error"){
    const box=document.getElementById("marksTeacherMessage");
    if(!box) return;
    box.textContent=message;
    box.className=`marks-inline-message show ${type}`;
}
function marksClearTeacherMessage(){
    const box=document.getElementById("marksTeacherMessage");
    if(box){box.textContent="";box.className="marks-inline-message";}
}
function marksSortedStudents(rows){
    return [...(rows||[])].sort((a,b)=>{
        const nameCompare=String(a.name||a.student_name||"").localeCompare(
            String(b.name||b.student_name||""),undefined,{sensitivity:"base"}
        );
        if(nameCompare!==0) return nameCompare;
        return String(a.studentId||a.student_id||"").localeCompare(
            String(b.studentId||b.student_id||""),undefined,{numeric:true,sensitivity:"base"}
        );
    });
}
async function marksFetchStudents(db,className){
    try{
        const {data,error}=await db.rpc("list_students");
        if(error) throw error;
        return marksSortedStudents((data||[])
            .filter(row=>row.class_name===className)
            .map(row=>({studentId:row.student_id,name:row.name,className:row.class_name})));
    }catch(error){
        console.warn("Marks student list RPC fallback:",error?.message||error);
        const fallback=typeof getStudentsByClass==="function"?getStudentsByClass(className):[];
        return marksSortedStudents(fallback.map(row=>({
            studentId:row.studentId||row.student_id,
            name:row.name,
            className:row.className||row.class_name
        })));
    }
}

async function openMarksEntryHub(){
    if(!loggedInStaff || !staffAuthSession?.user?.id){
        openStaffLogin();
        return;
    }
    closeStaffDashboard();
    marksClearTeacherMessage();
    const popup=document.getElementById("marksEntryPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await loadMarksTeacherAssignments();
}
function closeMarksEntryHub(){
    const popup=document.getElementById("marksEntryPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function loadMarksTeacherAssignments(){
    const identity=document.getElementById("marksTeacherIdentity");
    const none=document.getElementById("marksTeacherNoAssignment");
    const workspace=document.getElementById("marksTeacherWorkspace");
    if(identity) identity.textContent=`${loggedInStaff?.name||"Staff"} • Checking assigned class...`;

    try{
        const db=initStaffSupabase();
        if(!db) throw new Error("Supabase connection is unavailable.");
        const {data,error}=await db
            .from("marks_teacher_assignments")
            .select("class_name,staff_id,staff_name")
            .eq("staff_id",loggedInStaff.username)
            .in("class_name",["Class 6","Class 7","Class 8","Class 9","Class 10"])
            .order("class_name",{ascending:true});
        if(error) throw error;

        marksTeacherAssignments=data||[];
        if(identity){
            const classText=marksTeacherAssignments.map(row=>row.class_name).join(", ")||"No class assigned";
            identity.innerHTML=`<span>👩‍🏫 ${escapeHtml(loggedInStaff.name)}</span><span>Assigned Class: ${escapeHtml(classText)}</span>`;
        }
        if(!marksTeacherAssignments.length){
            if(none) none.style.display="block";
            if(workspace) workspace.style.display="none";
            return;
        }

        if(none) none.style.display="none";
        if(workspace) workspace.style.display="block";
        const classSelect=document.getElementById("marksProjectClass");
        if(classSelect){
            classSelect.innerHTML=marksTeacherAssignments.map(row=>
                `<option value="${escapeHtml(row.class_name)}">${escapeHtml(row.class_name)}</option>`
            ).join("");
        }
        await loadMarksTeacherProjects();
    }catch(error){
        console.error("Marks assignment load error:",error);
        if(identity) identity.textContent="Marks Entry could not be opened.";
        if(none){
            none.style.display="block";
            none.textContent="Marks Entry database is not ready. Run the supplied Marks SQL in Supabase first.";
        }
        if(workspace) workspace.style.display="none";
    }
}

async function createMarksProject(event){
    event.preventDefault();
    if(!loggedInStaff || !staffAuthSession?.user?.id) return;

    const className=document.getElementById("marksProjectClass")?.value||"";
    const projectName=document.getElementById("marksProjectName")?.value.trim()||"";
    const session=document.getElementById("marksProjectSession")?.value.trim()||"";
    const button=document.getElementById("marksCreateProjectBtn");
    if(!className||!projectName||!session) return;

    const oldText=button?.textContent||"CREATE PROJECT";
    if(button){button.disabled=true;button.textContent="CREATING...";}
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("marks_projects").insert({
            created_by:staffAuthSession.user.id,
            staff_id:loggedInStaff.username,
            staff_name:loggedInStaff.name,
            class_name:className,
            project_name:projectName,
            academic_session:session,
            status:"draft"
        }).select("id,created_by,staff_id,staff_name,class_name,project_name,academic_session,status,admin_note,submitted_at,created_at,updated_at").single();
        if(error) throw error;

        document.getElementById("marksProjectForm")?.reset();
        marksShowTeacherMessage("Marks Project created. Add Subjects and Components below.","success");
        await loadMarksTeacherProjects(data.id);
    }catch(error){
        console.error("Create Marks Project error:",error);
        marksShowTeacherMessage("Could not create the Marks Project: "+(error?.message||"Unknown error"));
    }finally{
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function loadMarksTeacherProjects(preferredId=null){
    const select=document.getElementById("marksTeacherProjectSelect");
    const empty=document.getElementById("marksTeacherProjectEmpty");
    const detail=document.getElementById("marksTeacherProjectDetail");
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("marks_projects")
            .select("id,created_by,staff_id,staff_name,class_name,project_name,academic_session,status,admin_note,submitted_at,created_at,updated_at")
            .in("class_name",["Class 6","Class 7","Class 8","Class 9","Class 10"])
            .order("created_at",{ascending:false});
        if(error) throw error;
        marksTeacherProjects=data||[];

        if(!marksTeacherProjects.length){
            if(select) select.innerHTML='<option value="">No Marks Projects</option>';
            if(empty) empty.style.display="block";
            if(detail) detail.style.display="none";
            marksActiveProject=null;
            return;
        }

        if(empty) empty.style.display="none";
        if(select){
            select.innerHTML=marksTeacherProjects.map(row=>
                `<option value="${Number(row.id)}">${escapeHtml(row.class_name)} — ${escapeHtml(row.project_name)} [${escapeHtml(marksStatusLabel(row.status))}]</option>`
            ).join("");
        }
        const activeId=Number(preferredId||select?.value||marksTeacherProjects[0].id);
        if(select) select.value=String(activeId);
        await loadMarksTeacherProject(activeId);
    }catch(error){
        console.error("Teacher Marks Projects load error:",error);
        marksShowTeacherMessage("Could not load Marks Projects: "+(error?.message||"Unknown error"));
    }
}

async function loadMarksTeacherProject(projectId){
    const id=Number(projectId);
    if(!id) return;
    marksClearTeacherMessage();
    try{
        const db=initStaffSupabase();
        const project=marksTeacherProjects.find(row=>Number(row.id)===id);
        if(!project) throw new Error("Marks Project was not found.");

        const [componentResult,entryResult,students]=await Promise.all([
            db.from("marks_components").select("id,project_id,subject_name,component_name,full_marks,display_order,created_at,updated_at").eq("project_id",id).order("display_order").order("id"),
            db.from("marks_entries").select("id,project_id,component_id,student_id,student_name,obtained_marks,is_absent,updated_at").eq("project_id",id),
            marksFetchStudents(db,project.class_name)
        ]);
        if(componentResult.error) throw componentResult.error;
        if(entryResult.error) throw entryResult.error;

        marksActiveProject=project;
        marksActiveComponents=componentResult.data||[];
        marksActiveEntries=entryResult.data||[];
        marksActiveStudents=students||[];
        renderMarksTeacherProject();
    }catch(error){
        console.error("Teacher Marks Project detail error:",error);
        marksShowTeacherMessage("Could not open this Marks Project: "+(error?.message||"Unknown error"));
    }
}

function renderMarksTeacherProject(){
    const detail=document.getElementById("marksTeacherProjectDetail");
    if(!detail||!marksActiveProject) return;
    detail.style.display="block";

    const project=marksActiveProject;
    const summary=document.getElementById("marksTeacherProjectSummary");
    if(summary){
        summary.innerHTML=`
            <div class="marks-summary-item">Project<strong>${escapeHtml(project.project_name)}</strong></div>
            <div class="marks-summary-item">Class<strong>${escapeHtml(project.class_name)}</strong></div>
            <div class="marks-summary-item">Session<strong>${escapeHtml(project.academic_session)}</strong></div>
            <div class="marks-summary-item">Students<strong>${marksActiveStudents.length}</strong></div>
            <div class="marks-summary-item">Status<strong>${marksStatusHtml(project.status)}</strong></div>`;
    }

    const note=document.getElementById("marksTeacherReturnNote");
    if(note){
        note.style.display=project.status==="returned"?"block":"none";
        note.innerHTML=project.status==="returned"
            ?`<strong>Admin returned this project for correction.</strong><br>${escapeHtml(project.admin_note||"Please check the Marks and submit again.")}`:"";
    }

    const editable=marksProjectEditable(project);
    const manager=document.getElementById("marksComponentManager");
    const actions=document.getElementById("marksTeacherActions");
    if(manager) manager.style.display=editable?"block":"none";
    if(actions) actions.style.display=editable?"flex":"none";
    renderMarksComponentList();
    renderMarksTeacherTable();
}

function renderMarksComponentList(){
    const host=document.getElementById("marksComponentList");
    if(!host) return;
    if(!marksActiveComponents.length){
        host.innerHTML='<span style="color:#667085;font-size:11px;">No Subjects added yet.</span>';
        return;
    }
    const editable=marksProjectEditable();
    host.innerHTML=marksActiveComponents.map(row=>`
        <div class="marks-component-chip">
            <span>${escapeHtml(row.subject_name)} — ${escapeHtml(row.component_name)} • Full ${escapeHtml(marksNumber(row.full_marks))}</span>
            ${editable?`<button type="button" onclick="editMarksComponentFullMarks(${Number(row.id)})">EDIT</button>
            <button type="button" class="delete" onclick="deleteMarksComponent(${Number(row.id)})">DELETE</button>`:""}
        </div>`).join("");
}

async function addMarksComponent(event){
    event.preventDefault();
    if(!marksProjectEditable()) return;
    const subject=document.getElementById("marksSubjectName")?.value.trim()||"";
    const component=document.getElementById("marksComponentName")?.value.trim()||"";
    const fullMarks=Number(document.getElementById("marksFullMarks")?.value);
    if(!subject||!component||!Number.isFinite(fullMarks)||fullMarks<=0||fullMarks>1200){
        marksShowTeacherMessage("Enter a Subject, Component and Full Marks from 0.01 to 1200.");
        return;
    }
    try{
        const db=initStaffSupabase();
        const {error}=await db.from("marks_components").insert({
            project_id:Number(marksActiveProject.id),
            subject_name:subject,
            component_name:component,
            full_marks:fullMarks,
            display_order:marksActiveComponents.length
        });
        if(error) throw error;
        document.getElementById("marksComponentForm")?.reset();
        marksShowTeacherMessage(`${subject} — ${component} added. Full Marks ${marksNumber(fullMarks)} applies to every student.`,"success");
        await loadMarksTeacherProject(marksActiveProject.id);
    }catch(error){
        console.error("Add Marks component error:",error);
        const duplicate=error?.code==="23505"?"This Subject and Component already exists.":(error?.message||"Unknown error");
        marksShowTeacherMessage("Could not add the Subject/Component: "+duplicate);
    }
}

async function editMarksComponentFullMarks(componentId){
    if(!marksProjectEditable()) return;
    const row=marksActiveComponents.find(item=>Number(item.id)===Number(componentId));
    if(!row) return;
    const input=prompt(`New Full Marks for ${row.subject_name} — ${row.component_name}:`,marksNumber(row.full_marks));
    if(input===null) return;
    const fullMarks=Number(input);
    if(!Number.isFinite(fullMarks)||fullMarks<=0||fullMarks>1200){
        alert("Full Marks must be from 0.01 to 1200.");
        return;
    }
    try{
        const db=initStaffSupabase();
        const {error}=await db.from("marks_components").update({full_marks:fullMarks}).eq("id",Number(componentId));
        if(error) throw error;
        await loadMarksTeacherProject(marksActiveProject.id);
        marksShowTeacherMessage("Full Marks updated for every student.","success");
    }catch(error){
        alert("Full Marks could not be updated: "+(error?.message||"Unknown error"));
    }
}

async function deleteMarksComponent(componentId){
    if(!marksProjectEditable()) return;
    const row=marksActiveComponents.find(item=>Number(item.id)===Number(componentId));
    if(!row) return;
    if(!confirm(`Delete ${row.subject_name} — ${row.component_name}? Its entered Marks will also be deleted.`)) return;
    try{
        const db=initStaffSupabase();
        const {error}=await db.from("marks_components").delete().eq("id",Number(componentId));
        if(error) throw error;
        await loadMarksTeacherProject(marksActiveProject.id);
        marksShowTeacherMessage("Subject/Component deleted.","success");
    }catch(error){
        alert("Subject/Component could not be deleted: "+(error?.message||"Unknown error"));
    }
}

function renderMarksTeacherTable(){
    const host=document.getElementById("marksTeacherTableHost");
    if(!host) return;
    if(!marksActiveStudents.length){
        host.innerHTML='<div class="marks-empty" style="margin-top:14px;">No students were found in this assigned class.</div>';
        return;
    }
    if(!marksActiveComponents.length){
        host.innerHTML='<div class="marks-empty" style="margin-top:14px;">Add a Subject and Component to open the Marks table.</div>';
        return;
    }

    const editable=marksProjectEditable();
    const entryMap=new Map(marksActiveEntries.map(row=>[`${row.component_id}|${row.student_id}`,row]));
    const headers=marksActiveComponents.map(row=>`
        <th>${escapeHtml(row.subject_name)}<small>${escapeHtml(row.component_name)} • Full ${escapeHtml(marksNumber(row.full_marks))}</small></th>`).join("");
    const rows=marksActiveStudents.map((student,index)=>{
        const cells=marksActiveComponents.map(component=>{
            const entry=entryMap.get(`${component.id}|${student.studentId}`)||null;
            const absent=!!entry?.is_absent;
            const value=absent?"":marksNumber(entry?.obtained_marks);
            return `<td>
                <div class="marks-cell" data-component-id="${Number(component.id)}" data-student-id="${escapeHtml(student.studentId)}" data-student-name="${escapeHtml(student.name)}" data-full-marks="${escapeHtml(marksNumber(component.full_marks))}">
                    <input class="marks-obtained" type="number" min="0" max="${escapeHtml(marksNumber(component.full_marks))}" step="0.01"
                           value="${escapeHtml(value)}" ${editable&&!absent?"":"disabled"} aria-label="${escapeHtml(student.name)} ${escapeHtml(component.subject_name)} ${escapeHtml(component.component_name)} Marks">
                    <label><input class="marks-absent" type="checkbox" ${absent?"checked":""} ${editable?"":"disabled"} onchange="marksToggleAbsent(this)"> AB</label>
                </div>
            </td>`;
        }).join("");
        return `<tr><td>${index+1}</td><td>${escapeHtml(student.studentId)}</td><td class="student-name">${escapeHtml(student.name)}</td>${cells}</tr>`;
    }).join("");

    host.innerHTML=`
        <div class="marks-table-wrap">
            <table class="marks-table">
                <thead><tr><th>Roll No.</th><th>Student ID</th><th>Student Name</th>${headers}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

function marksToggleAbsent(checkbox){
    const cell=checkbox.closest(".marks-cell");
    const input=cell?.querySelector(".marks-obtained");
    if(!input) return;
    input.disabled=checkbox.checked;
    if(checkbox.checked) input.value="";
    else input.focus();
}

function collectMarksEntries(requireComplete=false){
    const cells=[...document.querySelectorAll("#marksTeacherTableHost .marks-cell")];
    if(!cells.length) throw new Error("Add at least one Subject/Component first.");
    return cells.map(cell=>{
        const input=cell.querySelector(".marks-obtained");
        const absent=!!cell.querySelector(".marks-absent")?.checked;
        const raw=input?.value.trim()||"";
        const fullMarks=Number(cell.dataset.fullMarks);
        if(requireComplete && !absent && raw===""){
            throw new Error(`Enter Marks or AB for ${cell.dataset.studentName}.`);
        }
        const obtained=raw===""?null:Number(raw);
        if(!absent && obtained!==null && (!Number.isFinite(obtained)||obtained<0||obtained>fullMarks)){
            throw new Error(`${cell.dataset.studentName}: Marks must be between 0 and ${marksNumber(fullMarks)}.`);
        }
        return {
            project_id:Number(marksActiveProject.id),
            component_id:Number(cell.dataset.componentId),
            student_id:cell.dataset.studentId,
            student_name:cell.dataset.studentName,
            obtained_marks:absent?null:obtained,
            is_absent:absent
        };
    });
}

async function saveMarksDraft(options={}){
    const {silent=false,requireComplete=false}=options;
    if(!marksProjectEditable()) return false;
    try{
        const rows=collectMarksEntries(requireComplete);
        const db=initStaffSupabase();
        const {error}=await db.from("marks_entries").upsert(rows,{onConflict:"component_id,student_id"});
        if(error) throw error;
        if(!silent) marksShowTeacherMessage("Draft saved successfully. You can continue editing later.","success");
        const {data}=await db.from("marks_entries")
            .select("id,project_id,component_id,student_id,student_name,obtained_marks,is_absent,updated_at")
            .eq("project_id",Number(marksActiveProject.id));
        if(data) marksActiveEntries=data;
        return true;
    }catch(error){
        console.error("Save Marks draft error:",error);
        marksShowTeacherMessage(error?.message||"Marks Draft could not be saved.");
        return false;
    }
}

async function submitMarksProject(){
    if(!marksProjectEditable()) return;
    const saved=await saveMarksDraft({silent:true,requireComplete:true});
    if(!saved) return;
    if(!confirm("Submit this complete Marks Project to Admin? It will be locked until Admin returns it for correction.")) return;
    try{
        const db=initStaffSupabase();
        const {error}=await db.from("marks_projects")
            .update({status:"submitted",submitted_at:new Date().toISOString()})
            .eq("id",Number(marksActiveProject.id));
        if(error) throw error;
        await loadMarksTeacherProjects(marksActiveProject.id);
        marksShowTeacherMessage("Marks submitted successfully to Admin.","success");
    }catch(error){
        console.error("Submit Marks Project error:",error);
        marksShowTeacherMessage("Project could not be submitted: "+(error?.message||"Unknown error"));
    }
}

function marksPopulateClassSelect(select,includeAll=false){
    if(!select) return;
    select.innerHTML=(includeAll?'<option value="ALL">All Classes</option>':"")+MARKS_CLASS_ORDER.map(name=>
        `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    ).join("");
}
function marksPopulateAdminStaffSelect(){
    const select=document.getElementById("marksAdminAssignmentStaff");
    if(!select||typeof STAFF_LOGIN_DIRECTORY!=="object") return;
    const teachers=Object.entries(STAFF_LOGIN_DIRECTORY)
        .filter(([,staff])=>/teacher/i.test(staff.designation||""))
        .sort((a,b)=>a[1].name.localeCompare(b[1].name));
    select.innerHTML=teachers.map(([staffId,staff])=>
        `<option value="${escapeHtml(staffId)}">${escapeHtml(staff.name)} — ${escapeHtml(staffId)}</option>`
    ).join("");
}

async function renderAdminMarks(){
    if(!studentAdminSession?.access_token){
        openStudentAdminLogin();
        return;
    }
    marksPopulateClassSelect(document.getElementById("marksAdminAssignmentClass"));
    marksPopulateClassSelect(document.getElementById("marksAdminClassFilter"),true);
    marksPopulateAdminStaffSelect();
    await Promise.all([loadAdminMarksAssignments(),loadAdminMarksProjects()]);
}

async function loadAdminMarksAssignments(){
    const host=document.getElementById("marksAdminAssignmentList");
    if(host) host.innerHTML='<div class="review-empty">Loading assignments...</div>';
    try{
        const db=initStudentSupabase();
        const {data,error}=await db.from("marks_teacher_assignments")
            .select("class_name,staff_id,staff_name,updated_at")
            .order("class_name");
        if(error) throw error;
        marksAdminAssignments=data||[];
        renderAdminMarksAssignmentList();
    }catch(error){
        if(host) host.innerHTML=`<div class="review-empty">Could not load assignments: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}
function renderAdminMarksAssignmentList(){
    const host=document.getElementById("marksAdminAssignmentList");
    if(!host) return;
    if(!marksAdminAssignments.length){
        host.innerHTML='<div class="review-empty">No class teachers assigned.</div>';
        return;
    }
    const classIndex=name=>MARKS_CLASS_ORDER.indexOf(name);
    host.innerHTML=[...marksAdminAssignments].sort((a,b)=>classIndex(a.class_name)-classIndex(b.class_name)).map(row=>`
        <div class="marks-assignment-row">
            <strong>${escapeHtml(row.class_name)}</strong>
            <span>${escapeHtml(row.staff_name)} • Staff ID: ${escapeHtml(row.staff_id)}</span>
            <button type="button" class="marks-danger" onclick="deleteMarksTeacherAssignment('${escapeHtml(row.class_name)}',this)">DELETE</button>
        </div>`).join("");
}

async function saveMarksTeacherAssignment(event){
    event.preventDefault();
    if(!studentAdminSession?.access_token) return;
    const className=document.getElementById("marksAdminAssignmentClass")?.value||"";
    const staffId=document.getElementById("marksAdminAssignmentStaff")?.value||"";
    const staff=STAFF_LOGIN_DIRECTORY[staffId];
    if(!className||!staff) return;
    try{
        const db=initStudentSupabase();
        const {error}=await db.from("marks_teacher_assignments").upsert({
            class_name:className,
            staff_id:staffId,
            staff_name:staff.name
        },{onConflict:"class_name"});
        if(error) throw error;
        await loadAdminMarksAssignments();
        alert(`${staff.name} assigned to ${className}.`);
    }catch(error){
        alert("Assignment could not be saved: "+(error?.message||"Unknown error"));
    }
}

async function deleteMarksTeacherAssignment(className,button=null){
    if(!studentAdminSession?.access_token) return;
    const oldText=button?.textContent||"DELETE";
    let deletedProjects=0;
    try{
        const db=initStudentSupabase();
        const related=await db.from("marks_projects")
            .select("id,project_name,status")
            .eq("class_name",className)
            .order("created_at",{ascending:false});
        if(related.error) throw related.error;

        const projects=related.data||[];
        const warning=projects.length
            ?`Remove the class teacher assignment for ${className}?\n\nWARNING: ${projects.length} related Marks Project${projects.length===1?"":"s"}, including all Subjects, Components and student Marks, will also be permanently deleted. Export anything you need before continuing.`
            :`Remove the class teacher assignment for ${className}?`;
        if(!confirm(warning)) return;

        if(button){button.disabled=true;button.textContent="DELETING...";}

        for(const project of projects){
            const result=await marksDeleteProjectTree(db,project.id);
            if(!result.alreadyDeleted) deletedProjects++;
        }

        const assignmentDelete=await db.from("marks_teacher_assignments")
            .delete()
            .eq("class_name",className)
            .select("class_name")
            .maybeSingle();
        if(assignmentDelete.error) throw assignmentDelete.error;

        if(!assignmentDelete.data){
            const check=await db.from("marks_teacher_assignments")
                .select("class_name")
                .eq("class_name",className)
                .maybeSingle();
            if(check.error) throw check.error;
            if(check.data) throw new Error("Assignment could not be removed. Check the Admin DELETE policy for marks_teacher_assignments.");
        }

        if(marksAdminActiveData?.project?.class_name===className){
            marksAdminActiveData=null;
            const detail=document.getElementById("marksAdminProjectDetail");
            if(detail) detail.style.display="none";
        }
        marksFinalAdminClassData=null;
        await Promise.all([loadAdminMarksAssignments(),loadAdminMarksProjects()]);
        alert(projects.length
            ?`Assignment and ${projects.length} related Marks Project${projects.length===1?"":"s"} deleted successfully.`
            :"Assignment deleted successfully.");
    }catch(error){
        await Promise.all([loadAdminMarksAssignments(),loadAdminMarksProjects()]).catch(()=>{});
        const partial=deletedProjects
            ?`\n\n${deletedProjects} related Marks Project${deletedProjects===1?" was":"s were"} deleted before the error. The lists have been refreshed.`
            :"";
        alert("Assignment could not be deleted: "+(error?.message||"Unknown error")+partial);
    }finally{
        if(button?.isConnected){button.disabled=false;button.textContent=oldText;}
    }
}

async function loadAdminMarksProjects(){
    const host=document.getElementById("marksAdminProjectList");
    if(host) host.innerHTML='<div class="review-empty">Loading Marks Projects...</div>';
    try{
        const db=initStudentSupabase();
        const {data,error}=await db.from("marks_projects")
            .select("id,created_by,staff_id,staff_name,class_name,project_name,academic_session,status,admin_note,submitted_at,created_at,updated_at")
            .in("class_name",["Class 6","Class 7","Class 8","Class 9","Class 10"])
            .order("created_at",{ascending:false});
        if(error) throw error;
        marksAdminProjects=data||[];
        renderAdminMarksProjectList();
    }catch(error){
        if(host) host.innerHTML=`<div class="review-empty">Could not load Marks Projects: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

function renderAdminMarksProjectList(){
    const host=document.getElementById("marksAdminProjectList");
    if(!host) return;
    const classFilter=document.getElementById("marksAdminClassFilter")?.value||"ALL";
    const statusFilter=document.getElementById("marksAdminStatusFilter")?.value||"ALL";
    const rows=marksAdminProjects.filter(row=>(classFilter==="ALL"||row.class_name===classFilter)&&(statusFilter==="ALL"||row.status===statusFilter));
    if(!rows.length){
        host.innerHTML='<div class="review-empty">No Marks Projects match this filter.</div>';
        return;
    }
    host.innerHTML=rows.map(row=>`
        <article class="marks-admin-card">
            <div class="marks-admin-card-head">
                <div>
                    <div class="marks-admin-card-title">${escapeHtml(row.project_name)}</div>
                    <div class="marks-admin-card-meta">
                        ${escapeHtml(row.class_name)} • ${escapeHtml(row.academic_session)} •
                        ${escapeHtml(row.staff_name)} (${escapeHtml(row.staff_id)})<br>
                        Created: ${escapeHtml(marksFormatDate(row.created_at))}${row.submitted_at?` • Submitted: ${escapeHtml(marksFormatDate(row.submitted_at))}`:""}
                    </div>
                </div>
                ${marksStatusHtml(row.status)}
            </div>
            <div class="marks-admin-card-actions">
                <button type="button" class="marks-primary" onclick="viewAdminMarksProject(${Number(row.id)})">VIEW MARKS</button>
                <button type="button" class="marks-secondary" onclick="exportAdminMarksProject(${Number(row.id)})">EXPORT EXCEL</button>
                ${row.status==="submitted"?`<button type="button" class="marks-secondary" onclick="adminReturnMarksProject(${Number(row.id)})">RETURN FOR CORRECTION</button>`:""}
                <button type="button" class="marks-danger" onclick="adminDeleteMarksProject('${escapeHtml(String(row.id))}',this)">DELETE PROJECT</button>
            </div>
        </article>`).join("");
}

async function getAdminMarksProjectData(projectId){
    const id=Number(projectId);
    const db=initStudentSupabase();
    let project=marksAdminProjects.find(row=>Number(row.id)===id)||null;
    if(!project){
        const result=await db.from("marks_projects")
            .select("id,created_by,staff_id,staff_name,class_name,project_name,academic_session,status,admin_note,submitted_at,created_at,updated_at")
            .eq("id",id).single();
        if(result.error) throw result.error;
        project=result.data;
    }
    const [componentResult,entryResult,students]=await Promise.all([
        db.from("marks_components").select("id,project_id,subject_name,component_name,full_marks,display_order").eq("project_id",id).order("display_order").order("id"),
        db.from("marks_entries").select("project_id,component_id,student_id,student_name,obtained_marks,is_absent").eq("project_id",id),
        marksFetchStudents(db,project.class_name)
    ]);
    if(componentResult.error) throw componentResult.error;
    if(entryResult.error) throw entryResult.error;
    return {project,components:componentResult.data||[],entries:entryResult.data||[],students:students||[]};
}

async function viewAdminMarksProject(projectId){
    const host=document.getElementById("marksAdminProjectDetail");
    if(host){host.style.display="block";host.innerHTML='<div class="review-empty">Loading Marks...</div>';}
    try{
        marksAdminActiveData=await getAdminMarksProjectData(projectId);
        renderAdminMarksProjectDetail();
        host?.scrollIntoView({behavior:"smooth",block:"start"});
    }catch(error){
        if(host) host.innerHTML=`<div class="review-empty">Could not open Marks: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

function renderAdminMarksProjectDetail(){
    const host=document.getElementById("marksAdminProjectDetail");
    if(!host||!marksAdminActiveData) return;
    const {project,components,entries,students}=marksAdminActiveData;
    const entryMap=new Map(entries.map(row=>[`${row.component_id}|${row.student_id}`,row]));
    const headers=components.map(row=>`<th>${escapeHtml(row.subject_name)}<small>${escapeHtml(row.component_name)} • Full ${escapeHtml(marksNumber(row.full_marks))}</small></th>`).join("");
    const body=students.map((student,index)=>{
        const cells=components.map(component=>{
            const entry=entryMap.get(`${component.id}|${student.studentId}`);
            const value=entry?.is_absent?"AB":marksNumber(entry?.obtained_marks)||"—";
            return `<td>${escapeHtml(value)}</td>`;
        }).join("");
        return `<tr><td>${index+1}</td><td>${escapeHtml(student.studentId)}</td><td class="student-name">${escapeHtml(student.name)}</td>${cells}</tr>`;
    }).join("");
    host.innerHTML=`
        <div class="marks-admin-detail-head">
            <div><h4>${escapeHtml(project.project_name)}</h4><div class="marks-admin-card-meta">${escapeHtml(project.class_name)} • ${escapeHtml(project.academic_session)} • ${escapeHtml(project.staff_name)}</div></div>
            <div class="marks-admin-card-actions">
                <button type="button" class="marks-secondary" onclick="exportAdminMarksProject(${Number(project.id)})">EXPORT EXCEL</button>
                <button type="button" class="marks-danger" onclick="document.getElementById('marksAdminProjectDetail').style.display='none'">CLOSE</button>
            </div>
        </div>
        ${project.admin_note?`<div class="marks-return-note"><strong>Admin Note:</strong><br>${escapeHtml(project.admin_note)}</div>`:""}
        ${components.length&&students.length?`<div class="marks-table-wrap"><table class="marks-table"><thead><tr><th>Roll No.</th><th>Student ID</th><th>Student Name</th>${headers}</tr></thead><tbody>${body}</tbody></table></div>`:'<div class="marks-empty">No Marks have been entered in this project yet.</div>'}`;
}

async function adminReturnMarksProject(projectId){
    if(!studentAdminSession?.access_token) return;
    const note=prompt("Write the correction note for the teacher:","Please check the entered Marks and submit again.");
    if(note===null) return;
    try{
        const db=initStudentSupabase();
        const {error}=await db.from("marks_projects").update({status:"returned",admin_note:note.trim()||null}).eq("id",Number(projectId));
        if(error) throw error;
        await loadAdminMarksProjects();
        if(Number(marksAdminActiveData?.project?.id)===Number(projectId)) await viewAdminMarksProject(projectId);
        alert("Marks Project returned to the teacher for correction.");
    }catch(error){
        alert("Project could not be returned: "+(error?.message||"Unknown error"));
    }
}

function marksSameProjectId(left,right){
    return String(left??"")===String(right??"");
}

async function marksDeleteProjectTree(db,projectId){
    const id=String(projectId??"").trim();
    if(!id) throw new Error("Invalid Marks Project ID.");

    /*
       Delete children while their parent project still exists. This avoids
       the child-record security trigger losing sight of the project during
       an automatic ON DELETE CASCADE operation.
    */
    const existing=await db.from("marks_projects")
        .select("id")
        .eq("id",id)
        .maybeSingle();
    if(existing.error) throw existing.error;
    if(!existing.data) return {alreadyDeleted:true};

    const entryDelete=await db.from("marks_entries")
        .delete()
        .eq("project_id",id);
    if(entryDelete.error) throw entryDelete.error;

    const componentDelete=await db.from("marks_components")
        .delete()
        .eq("project_id",id);
    if(componentDelete.error) throw componentDelete.error;

    const projectDelete=await db.from("marks_projects")
        .delete()
        .eq("id",id)
        .select("id")
        .maybeSingle();
    if(projectDelete.error) throw projectDelete.error;

    if(!projectDelete.data){
        const check=await db.from("marks_projects")
            .select("id")
            .eq("id",id)
            .maybeSingle();
        if(check.error) throw check.error;
        if(check.data) throw new Error("Marks Project could not be removed. Check the Admin DELETE policy for marks_projects.");
    }
    return {alreadyDeleted:false};
}

async function adminDeleteMarksProject(projectId,button=null){
    if(!studentAdminSession?.access_token) return;
    const project=marksAdminProjects.find(row=>marksSameProjectId(row.id,projectId));
    const name=project?.project_name||"this Marks Project";
    if(!confirm(`Permanently delete ${name}?\n\nAll Subjects, Components and student Marks inside it will be deleted. Export Excel first if you need a copy.`)) return;
    const oldText=button?.textContent||"DELETE PROJECT";
    if(button){button.disabled=true;button.textContent="DELETING...";}
    try{
        const db=initStudentSupabase();
        const result=await marksDeleteProjectTree(db,projectId);
        if(marksSameProjectId(marksAdminActiveData?.project?.id,projectId)){
            marksAdminActiveData=null;
            const detail=document.getElementById("marksAdminProjectDetail");
            if(detail) detail.style.display="none";
        }
        await loadAdminMarksProjects();
        alert(result.alreadyDeleted
            ?"This Marks Project was already deleted. The list has been refreshed."
            :"Marks Project and all related Marks deleted successfully.");
    }catch(error){
        alert("Marks Project could not be deleted: "+(error?.message||"Unknown error"));
    }finally{
        if(button?.isConnected){button.disabled=false;button.textContent=oldText;}
    }
}

function marksSafeFileName(value){
    return String(value||"marks").trim().replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"marks";
}
async function exportAdminMarksProject(projectId){
    try{
        if(!window.XLSX) throw new Error("Excel export library is still loading. Try again in a moment.");
        const data=Number(marksAdminActiveData?.project?.id)===Number(projectId)
            ?marksAdminActiveData
            :await getAdminMarksProjectData(projectId);
        const {project,components,entries,students}=data;
        const entryMap=new Map(entries.map(row=>[`${row.component_id}|${row.student_id}`,row]));
        const rows=[
            ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
            ["Marks Project",project.project_name],
            ["Academic Session",project.academic_session],
            ["Class",project.class_name],
            ["Teacher",project.staff_name],
            ["Status",marksStatusLabel(project.status)],
            [],
            ["Roll No.","Student ID","Student Name",...components.map(row=>`${row.subject_name} - ${row.component_name}`)],
            ["FULL MARKS","","",...components.map(row=>Number(row.full_marks))]
        ];
        students.forEach((student,index)=>{
            rows.push([
                index+1,
                student.studentId,
                student.name,
                ...components.map(component=>{
                    const entry=entryMap.get(`${component.id}|${student.studentId}`);
                    if(entry?.is_absent) return "AB";
                    if(entry?.obtained_marks===null||entry?.obtained_marks===undefined) return "";
                    return Number(entry.obtained_marks);
                })
            ]);
        });

        const sheet=XLSX.utils.aoa_to_sheet(rows);
        sheet["!cols"]=[{wch:10},{wch:15},{wch:28},...components.map(()=>({wch:20}))];
        sheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:Math.max(2,components.length+2)}}];
        if(students.length) sheet["!autofilter"]={ref:`A8:${XLSX.utils.encode_col(components.length+2)}${rows.length}`};
        const book=XLSX.utils.book_new();
        const sheetName=String(project.class_name||"Marks").slice(0,31);
        XLSX.utils.book_append_sheet(book,sheet,sheetName);
        const filename=`${marksSafeFileName(project.class_name)}_${marksSafeFileName(project.project_name)}_${marksSafeFileName(project.academic_session)}.xlsx`;
        XLSX.writeFile(book,filename,{compression:true});
    }catch(error){
        console.error("Marks Excel export error:",error);
        alert("Excel could not be exported: "+(error?.message||"Unknown error"));
    }
}

const marksOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeMarksEntryHub();
    marksTeacherAssignments=[];
    marksTeacherProjects=[];
    marksActiveProject=null;
    await marksOriginalStaffLogout();
};

/* ===== SOURCE SCRIPT BLOCK: marks-final-workflow-js ===== */
/* Final class-wise workflow: upper roster, consolidated Admin view and Principal read-only view. */
const MARKS_UPPER_CLASSES_FINAL=["Class 6","Class 7","Class 8","Class 9","Class 10"];
let marksFinalAdminUpperStudents=[];
let marksFinalAdminClassData=null;
let marksFinalPrincipalClassData=null;

const marksFinalOriginalFetchStudents=marksFetchStudents;
marksFetchStudents=async function(db,className){
    try{
        const [standardResult,upperResult]=await Promise.all([
            db.rpc("list_students"),
            db.rpc("list_upper_class_students")
        ]);
        const standardRows=standardResult.error?[]:(standardResult.data||[]);
        const upperRows=upperResult.error?[]:(upperResult.data||[]);
        if(standardResult.error && upperResult.error) throw standardResult.error;
        const combined=[...standardRows,...upperRows]
            .filter(row=>row.class_name===className)
            .map(row=>({studentId:row.student_id,name:row.name,className:row.class_name}));
        const unique=[...new Map(combined.map(row=>[row.studentId,row])).values()];
        return marksSortedStudents(unique);
    }catch(error){
        return marksFinalOriginalFetchStudents(db,className);
    }
};

function marksFinalPopulateUpperSelect(select){
    if(!select) return;
    const current=select.value;
    select.innerHTML=MARKS_UPPER_CLASSES_FINAL.map(name=>
        `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    ).join("");
    if(MARKS_UPPER_CLASSES_FINAL.includes(current)) select.value=current;
}

const marksFinalOriginalLoadTeacherAssignments=loadMarksTeacherAssignments;
loadMarksTeacherAssignments=async function(){
    await marksFinalOriginalLoadTeacherAssignments();
    const assignedUpper=marksTeacherAssignments
        .map(row=>row.class_name)
        .filter(name=>MARKS_UPPER_CLASSES_FINAL.includes(name));
    const section=document.getElementById("marksTeacherUpperStudentSection");
    const select=document.getElementById("marksTeacherUpperClass");
    if(section) section.style.display=assignedUpper.length?"block":"none";
    if(!assignedUpper.length) return;
    if(select){
        const current=select.value;
        select.innerHTML=assignedUpper.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
        if(assignedUpper.includes(current)) select.value=current;
        select.onchange=()=>loadTeacherUpperStudents();
    }
    await loadTeacherUpperStudents();
};

async function loadTeacherUpperStudents(){
    const host=document.getElementById("marksTeacherUpperStudentList");
    const className=document.getElementById("marksTeacherUpperClass")?.value||"";
    if(!host||!className) return;
    host.innerHTML='<div class="review-empty">Loading student roster...</div>';
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("marks_upper_students")
            .select("student_id,name,class_name,created_by_staff_id,created_by_name,created_at")
            .eq("class_name",className)
            .order("name",{ascending:true})
            .order("student_id",{ascending:true});
        if(error) throw error;
        if(!data?.length){
            host.innerHTML='<div class="review-empty">No students added to this Class yet.</div>';
            return;
        }
        host.innerHTML=data.map((row,index)=>`
            <div class="marks-roster-row">
                <span>${index+1}</span>
                <strong>${escapeHtml(row.student_id)}</strong>
                <span>${escapeHtml(row.name)}</span>
                <small>Added by ${escapeHtml(row.created_by_name||row.created_by_staff_id||"Staff")}</small>
            </div>`).join("");
    }catch(error){
        host.innerHTML=`<div class="review-empty">Could not load students: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function addTeacherUpperStudent(event){
    event.preventDefault();
    const className=document.getElementById("marksTeacherUpperClass")?.value||"";
    const studentId=String(document.getElementById("marksTeacherUpperStudentId")?.value||"").trim().toUpperCase();
    const name=String(document.getElementById("marksTeacherUpperStudentName")?.value||"").trim().toUpperCase();
    const button=document.getElementById("marksTeacherUpperAddBtn");
    if(!MARKS_UPPER_CLASSES_FINAL.includes(className)||!marksTeacherAssignments.some(row=>row.class_name===className)) return;
    if(!/^[A-Z0-9-]{2,24}$/.test(studentId)){
        alert("Student ID may contain only letters, numbers and hyphens (2–24 characters).");
        return;
    }
    if(!name){alert("Enter the student's name.");return;}
    const oldText=button?.textContent||"ADD STUDENT";
    if(button){button.disabled=true;button.textContent="ADDING...";}
    try{
        const db=initStaffSupabase();
        const {error}=await db.from("marks_upper_students").insert({student_id:studentId,name,class_name:className});
        if(error) throw error;
        document.getElementById("marksTeacherUpperStudentId").value="";
        document.getElementById("marksTeacherUpperStudentName").value="";
        await loadTeacherUpperStudents();
        if(marksActiveProject?.class_name===className) await loadMarksTeacherProject(marksActiveProject.id);
        marksShowTeacherMessage(`${name} added to ${className}.`,"success");
    }catch(error){
        alert("Student could not be added: "+(error?.message||"Unknown error"));
    }finally{
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

function showAdminMarksMode(mode){
    const assignment=mode!=="view";
    const assignmentHost=document.getElementById("marksAdminAssignmentMode");
    const viewHost=document.getElementById("marksAdminViewMode");
    const assignmentBtn=document.getElementById("marksAdminAssignmentModeBtn");
    const viewBtn=document.getElementById("marksAdminViewModeBtn");
    if(assignmentHost) assignmentHost.style.display=assignment?"block":"none";
    if(viewHost) viewHost.style.display=assignment?"none":"block";
    if(assignmentBtn) assignmentBtn.className=assignment?"marks-primary":"marks-secondary";
    if(viewBtn) viewBtn.className=assignment?"marks-secondary":"marks-primary";
    if(!assignment){
        loadAdminMarksProjects();
        const className=document.getElementById("marksAdminClassFilter")?.value||MARKS_CLASS_ORDER[0];
        loadAdminMarksClass(className);
    }
}

renderAdminMarks=async function(){
    if(!studentAdminSession?.access_token){openStudentAdminLogin();return;}
    const selectedClass=document.getElementById("marksAdminClassFilter")?.value;
    marksPopulateClassSelect(document.getElementById("marksAdminAssignmentClass"));
    marksPopulateClassSelect(document.getElementById("marksAdminClassFilter"));
    if(selectedClass&&MARKS_CLASS_ORDER.includes(selectedClass)) document.getElementById("marksAdminClassFilter").value=selectedClass;
    marksFinalPopulateUpperSelect(document.getElementById("marksAdminUpperClass"));
    marksFinalPopulateUpperSelect(document.getElementById("marksAdminUpperRosterClass"));
    marksPopulateAdminStaffSelect();
    showAdminMarksMode("assignment");
    await Promise.all([loadAdminMarksAssignments(),loadAdminUpperStudents(),loadAdminMarksProjects()]);
};

async function loadAdminUpperStudents(){
    const host=document.getElementById("marksAdminUpperStudentList");
    if(host) host.innerHTML='<div class="review-empty">Loading Class 6–10 students...</div>';
    try{
        const db=initStudentSupabase();
        const {data,error}=await db.from("marks_upper_students")
            .select("student_id,name,class_name,created_by_staff_id,created_by_name,created_at,updated_at")
            .order("class_name").order("student_id");
        if(error) throw error;
        marksFinalAdminUpperStudents=data||[];
        renderAdminUpperStudentList();
    }catch(error){
        if(host) host.innerHTML=`<div class="review-empty">Could not load students: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

function renderAdminUpperStudentList(){
    const host=document.getElementById("marksAdminUpperStudentList");
    const className=document.getElementById("marksAdminUpperRosterClass")?.value||MARKS_UPPER_CLASSES_FINAL[0];
    if(!host) return;
    const rows=marksFinalAdminUpperStudents.filter(row=>row.class_name===className);
    if(!rows.length){host.innerHTML='<div class="review-empty">No students added to this Class yet.</div>';return;}
    host.innerHTML=rows.map((row,index)=>`
        <div class="marks-roster-row">
            <span>${index+1}</span>
            <strong>${escapeHtml(row.student_id)}</strong>
            <span>${escapeHtml(row.name)}<br><small>Added by ${escapeHtml(row.created_by_name||row.created_by_staff_id||"Admin")}</small></span>
            <div class="marks-roster-actions">
                <button type="button" class="marks-secondary" onclick="editAdminUpperStudent('${escapeHtml(row.student_id)}')">EDIT</button>
                <button type="button" class="marks-danger" onclick="deleteAdminUpperStudent('${escapeHtml(row.student_id)}')">DELETE</button>
            </div>
        </div>`).join("");
}

function resetAdminUpperStudentForm(){
    const form=document.getElementById("marksAdminUpperStudentForm");
    const original=document.getElementById("marksAdminUpperOriginalId");
    const save=document.getElementById("marksAdminUpperSaveBtn");
    const cancel=document.getElementById("marksAdminUpperCancelBtn");
    const className=document.getElementById("marksAdminUpperClass")?.value;
    form?.reset();
    if(className) document.getElementById("marksAdminUpperClass").value=className;
    if(original) original.value="";
    if(save) save.textContent="ADD STUDENT";
    if(cancel) cancel.style.display="none";
}

function editAdminUpperStudent(studentId){
    const row=marksFinalAdminUpperStudents.find(item=>item.student_id===studentId);
    if(!row) return;
    document.getElementById("marksAdminUpperOriginalId").value=row.student_id;
    document.getElementById("marksAdminUpperClass").value=row.class_name;
    document.getElementById("marksAdminUpperStudentId").value=row.student_id;
    document.getElementById("marksAdminUpperStudentName").value=row.name;
    document.getElementById("marksAdminUpperSaveBtn").textContent="SAVE CHANGES";
    document.getElementById("marksAdminUpperCancelBtn").style.display="inline-block";
    document.getElementById("marksAdminUpperStudentId").focus();
}

async function saveAdminUpperStudent(event){
    event.preventDefault();
    if(!studentAdminSession?.access_token) return;
    const original=document.getElementById("marksAdminUpperOriginalId")?.value||"";
    const className=document.getElementById("marksAdminUpperClass")?.value||"";
    const studentId=String(document.getElementById("marksAdminUpperStudentId")?.value||"").trim().toUpperCase();
    const name=String(document.getElementById("marksAdminUpperStudentName")?.value||"").trim().toUpperCase();
    if(!/^[A-Z0-9-]{2,24}$/.test(studentId)){alert("Use 2–24 letters, numbers or hyphens for Student ID.");return;}
    if(!name) return;
    try{
        const db=initStudentSupabase();
        const query=original
            ?db.from("marks_upper_students").update({student_id:studentId,name,class_name:className}).eq("student_id",original)
            :db.from("marks_upper_students").insert({student_id:studentId,name,class_name:className});
        const {error}=await query;
        if(error) throw error;
        document.getElementById("marksAdminUpperRosterClass").value=className;
        resetAdminUpperStudentForm();
        await loadAdminUpperStudents();
        alert(original?"Student updated successfully.":"Student added successfully.");
    }catch(error){
        alert("Student could not be saved: "+(error?.message||"Unknown error"));
    }
}

async function deleteAdminUpperStudent(studentId){
    const row=marksFinalAdminUpperStudents.find(item=>item.student_id===studentId);
    if(!row||!confirm(`Delete ${row.name} from ${row.class_name}?\n\nIf Marks exist, delete the related Marks Project first.`)) return;
    try{
        const db=initStudentSupabase();
        const {error}=await db.from("marks_upper_students").delete().eq("student_id",studentId);
        if(error) throw error;
        await loadAdminUpperStudents();
        alert("Student deleted successfully.");
    }catch(error){
        alert("Student could not be deleted: "+(error?.message||"Unknown error"));
    }
}

renderAdminMarksProjectList=function(){
    const host=document.getElementById("marksAdminProjectList");
    if(!host) return;
    const rows=marksAdminProjects
        .filter(row=>row.status==="submitted")
        .sort((a,b)=>new Date(b.submitted_at||0)-new Date(a.submitted_at||0));
    if(!rows.length){host.innerHTML='<div class="review-empty">No teacher has submitted Marks yet.</div>';return;}
    host.innerHTML=rows.map(row=>`
        <article class="marks-admin-card">
            <div class="marks-admin-card-head">
                <div>
                    <div class="marks-admin-card-title">${escapeHtml(row.staff_name)} — ${escapeHtml(row.class_name)}</div>
                    <div class="marks-admin-card-meta">
                        Staff ID: ${escapeHtml(row.staff_id)} • ${escapeHtml(row.project_name)} • Session ${escapeHtml(row.academic_session)}<br>
                        Submitted: ${escapeHtml(marksFormatDate(row.submitted_at))}
                    </div>
                </div>
                ${marksStatusHtml(row.status)}
            </div>
            <div class="marks-admin-card-actions">
                <button type="button" class="marks-primary" onclick="showAdminMarksClassFromSubmission('${escapeHtml(row.class_name)}')">VIEW THIS CLASS</button>
                <button type="button" class="marks-secondary" onclick="adminReturnMarksProject(${Number(row.id)})">RETURN FOR CORRECTION</button>
                <button type="button" class="marks-danger" onclick="adminDeleteMarksProject('${escapeHtml(String(row.id))}',this)">DELETE PROJECT</button>
            </div>
        </article>`).join("");
};

function showAdminMarksClassFromSubmission(className){
    showAdminMarksMode("view");
    const select=document.getElementById("marksAdminClassFilter");
    if(select) select.value=className;
    loadAdminMarksClass(className);
}

async function marksFinalLoadClassData(db,className){
    const projectResult=await db.from("marks_projects")
        .select("id,staff_id,staff_name,class_name,project_name,academic_session,status,submitted_at,created_at")
        .eq("class_name",className)
        .eq("status","submitted")
        .order("submitted_at",{ascending:false});
    if(projectResult.error) throw projectResult.error;
    const projects=projectResult.data||[];
    const students=await marksFetchStudents(db,className);
    const projectData=await Promise.all(projects.map(async project=>{
        const [componentResult,entryResult]=await Promise.all([
            db.from("marks_components").select("id,project_id,subject_name,component_name,full_marks,display_order").eq("project_id",project.id).order("display_order").order("id"),
            db.from("marks_entries").select("project_id,component_id,student_id,student_name,obtained_marks,is_absent").eq("project_id",project.id)
        ]);
        if(componentResult.error) throw componentResult.error;
        if(entryResult.error) throw entryResult.error;
        return {project,components:componentResult.data||[],entries:entryResult.data||[]};
    }));
    return {className,students,projects:projectData};
}

function marksFinalRenderClassData(host,data){
    if(!host) return;
    if(!data?.projects?.length){
        host.innerHTML=`<div class="marks-empty">No submitted Marks found for ${escapeHtml(data?.className||"this Class")}.</div>`;
        return;
    }
    host.innerHTML=data.projects.map(({project,components,entries})=>{
        const entryMap=new Map(entries.map(row=>[`${row.component_id}|${row.student_id}`,row]));
        const headers=components.map(row=>`<th>${escapeHtml(row.subject_name)}<small>${escapeHtml(row.component_name)} • Full ${escapeHtml(marksNumber(row.full_marks))}</small></th>`).join("");
        const body=data.students.map((student,index)=>{
            const cells=components.map(component=>{
                const entry=entryMap.get(`${component.id}|${student.studentId}`);
                const value=entry?.is_absent?"AB":marksNumber(entry?.obtained_marks)||"—";
                return `<td>${escapeHtml(value)}</td>`;
            }).join("");
            return `<tr><td>${index+1}</td><td>${escapeHtml(student.studentId)}</td><td class="student-name">${escapeHtml(student.name)}</td>${cells}</tr>`;
        }).join("");
        const table=components.length&&data.students.length
            ?`<div class="marks-table-wrap"><table class="marks-table"><thead><tr><th>Roll No.</th><th>Student ID</th><th>Student Name</th>${headers}</tr></thead><tbody>${body}</tbody></table></div>`
            :'<div class="marks-empty">No student Marks are available in this submission.</div>';
        return `<section class="marks-class-project">
            <div class="marks-admin-detail-head">
                <div><h4>${escapeHtml(project.project_name)}</h4><div class="marks-admin-card-meta">${escapeHtml(project.class_name)} • Session ${escapeHtml(project.academic_session)} • ${escapeHtml(project.staff_name)} (${escapeHtml(project.staff_id)}) • Submitted ${escapeHtml(marksFormatDate(project.submitted_at))}</div></div>
                ${marksStatusHtml(project.status)}
            </div>
            ${table}
        </section>`;
    }).join("");
}

async function loadAdminMarksClass(className){
    const host=document.getElementById("marksAdminProjectDetail");
    if(!studentAdminSession?.access_token||!MARKS_CLASS_ORDER.includes(className)||!host) return;
    host.innerHTML='<div class="review-empty">Loading every submitted Project/Exam for this Class...</div>';
    try{
        marksFinalAdminClassData=await marksFinalLoadClassData(initStudentSupabase(),className);
        marksFinalRenderClassData(host,marksFinalAdminClassData);
    }catch(error){
        host.innerHTML=`<div class="review-empty">Could not load Class Marks: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

adminReturnMarksProject=async function(projectId){
    if(!studentAdminSession?.access_token) return;
    const note=prompt("Write the correction note for the teacher:","Please check the entered Marks and submit again.");
    if(note===null) return;
    try{
        const db=initStudentSupabase();
        const {error}=await db.from("marks_projects").update({status:"returned",admin_note:note.trim()||null}).eq("id",Number(projectId));
        if(error) throw error;
        await loadAdminMarksProjects();
        const className=document.getElementById("marksAdminClassFilter")?.value;
        if(className) await loadAdminMarksClass(className);
        alert("Marks Project returned to the teacher for correction.");
    }catch(error){alert("Project could not be returned: "+(error?.message||"Unknown error"));}
};

adminDeleteMarksProject=async function(projectId,button=null){
    if(!studentAdminSession?.access_token) return;
    const project=marksAdminProjects.find(row=>marksSameProjectId(row.id,projectId));
    const name=project?.project_name||"this Marks Project";
    if(!confirm(`Permanently delete ${name}?\n\nAll Subjects, Components and student Marks inside it will be deleted. Export the selected Class first if you need a copy.`)) return;
    const oldText=button?.textContent||"DELETE PROJECT";
    if(button){button.disabled=true;button.textContent="DELETING...";}
    try{
        const db=initStudentSupabase();
        const result=await marksDeleteProjectTree(db,projectId);
        await loadAdminMarksProjects();
        const className=document.getElementById("marksAdminClassFilter")?.value;
        if(className) await loadAdminMarksClass(className);
        alert(result.alreadyDeleted
            ?"This Marks Project was already deleted. The list has been refreshed."
            :"Marks Project and all related Marks deleted successfully.");
    }catch(error){
        alert("Marks Project could not be deleted: "+(error?.message||"Unknown error"));
    }finally{
        if(button?.isConnected){button.disabled=false;button.textContent=oldText;}
    }
};

function marksFinalExcelRows(data){
    const {project,components,entries}=data;
    const students=marksFinalAdminClassData?.students||[];
    const entryMap=new Map(entries.map(row=>[`${row.component_id}|${row.student_id}`,row]));
    const rows=[
        ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
        ["Project / Exam",project.project_name],
        ["Academic Session",project.academic_session],
        ["Class",project.class_name],
        ["Teacher",`${project.staff_name} (${project.staff_id})`],
        ["Submitted",marksFormatDate(project.submitted_at)],
        [],
        ["Roll No.","Student ID","Student Name",...components.map(row=>`${row.subject_name} - ${row.component_name}`)],
        ["FULL MARKS","","",...components.map(row=>Number(row.full_marks))]
    ];
    students.forEach((student,index)=>rows.push([
        index+1,student.studentId,student.name,
        ...components.map(component=>{
            const entry=entryMap.get(`${component.id}|${student.studentId}`);
            if(entry?.is_absent) return "AB";
            return entry?.obtained_marks===null||entry?.obtained_marks===undefined?"":Number(entry.obtained_marks);
        })
    ]));
    return rows;
}

async function exportAdminSelectedClass(){
    try{
        if(!studentAdminSession?.access_token) throw new Error("Admin login is required.");
        if(!window.XLSX) throw new Error("Excel export library is still loading. Try again in a moment.");
        const className=document.getElementById("marksAdminClassFilter")?.value||"";
        if(!MARKS_CLASS_ORDER.includes(className)) throw new Error("Select one Class first.");
        marksFinalAdminClassData=await marksFinalLoadClassData(initStudentSupabase(),className);
        if(!marksFinalAdminClassData.projects.length) throw new Error(`No submitted Marks found for ${className}.`);
        marksFinalRenderClassData(document.getElementById("marksAdminProjectDetail"),marksFinalAdminClassData);
        const book=XLSX.utils.book_new();
        const usedNames=new Set();
        marksFinalAdminClassData.projects.forEach((data,index)=>{
            const rows=marksFinalExcelRows(data);
            const sheet=XLSX.utils.aoa_to_sheet(rows);
            sheet["!cols"]=[{wch:10},{wch:16},{wch:28},...data.components.map(()=>({wch:22}))];
            sheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:Math.max(2,data.components.length+2)}}];
            if(marksFinalAdminClassData.students.length) sheet["!autofilter"]={ref:`A8:${XLSX.utils.encode_col(data.components.length+2)}${rows.length}`};
            let base=`${index+1}_${data.project.project_name}`.replace(/[\\/?*\[\]:]/g," ").trim().slice(0,31)||`Project ${index+1}`;
            let sheetName=base;
            let suffix=2;
            while(usedNames.has(sheetName)){
                const tail=`_${suffix++}`;
                sheetName=(base.slice(0,31-tail.length)+tail);
            }
            usedNames.add(sheetName);
            XLSX.utils.book_append_sheet(book,sheet,sheetName);
        });
        XLSX.writeFile(book,`${marksSafeFileName(className)}_All_Submitted_Marks.xlsx`,{compression:true});
    }catch(error){
        alert("Excel could not be exported: "+(error?.message||"Unknown error"));
    }
}

async function loadPrincipalMarksNotifications(){
    const card=document.getElementById("principalMarksNotificationCard");
    const host=document.getElementById("principalMarksNotificationList");
    const principal=staffDashboardIsPrincipal();
    if(card) card.style.display=principal?"block":"none";
    if(!principal||!host) return;
    host.innerHTML='<div class="staff-dashboard-empty">Loading Marks submissions...</div>';
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("marks_projects")
            .select("id,staff_id,staff_name,class_name,project_name,academic_session,submitted_at")
            .eq("status","submitted")
            .in("class_name",["Class 6","Class 7","Class 8","Class 9","Class 10"])
            .order("submitted_at",{ascending:false})
            .limit(8);
        if(error) throw error;
        if(!data?.length){host.innerHTML='<div class="staff-dashboard-empty">No teacher has submitted Marks yet.</div>';return;}
        host.innerHTML=data.map(row=>`
            <button type="button" class="staff-dashboard-preview-item" onclick="openPrincipalMarksView('${escapeHtml(row.class_name)}')">
                <strong>${escapeHtml(row.staff_name)} — ${escapeHtml(row.class_name)}</strong>
                <span>${escapeHtml(row.project_name)} • Staff ID: ${escapeHtml(row.staff_id)}</span>
                <small>Submitted ${escapeHtml(marksFormatDate(row.submitted_at))}</small>
            </button>`).join("");
    }catch(error){
        host.innerHTML=`<div class="staff-dashboard-empty">Could not load Marks submissions: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

async function openPrincipalMarksView(preferredClass=""){
    if(!loggedInStaff||!staffAuthSession||!staffDashboardIsPrincipal()){
        alert("Principal login is required for this read-only Marks view.");
        return;
    }
    closeStaffDashboard();
    const select=document.getElementById("principalMarksClassSelect");
    marksFinalPopulateUpperSelect(select);
    if(MARKS_UPPER_CLASSES_FINAL.includes(preferredClass)) select.value=preferredClass;
    const popup=document.getElementById("principalMarksViewPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await loadPrincipalMarksClass(select?.value||MARKS_UPPER_CLASSES_FINAL[0]);
}

function closePrincipalMarksView(){
    const popup=document.getElementById("principalMarksViewPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}

async function loadPrincipalMarksClass(className){
    const host=document.getElementById("principalMarksClassDetail");
    if(!staffDashboardIsPrincipal()||!MARKS_UPPER_CLASSES_FINAL.includes(className)||!host) return;
    host.innerHTML='<div class="staff-dashboard-empty">Loading submitted Class Marks...</div>';
    try{
        marksFinalPrincipalClassData=await marksFinalLoadClassData(initStaffSupabase(),className);
        marksFinalRenderClassData(host,marksFinalPrincipalClassData);
    }catch(error){
        host.innerHTML=`<div class="marks-empty">Could not load Class Marks: ${escapeHtml(error?.message||"Unknown error")}</div>`;
    }
}

const marksFinalOriginalRefreshStaffDashboard=refreshStaffDashboard;
refreshStaffDashboard=async function(showConfirmation=true){
    await marksFinalOriginalRefreshStaffDashboard(showConfirmation);
    await loadPrincipalMarksNotifications();
};

const marksFinalOriginalOpenStaffDashboard=openStaffDashboard;
openStaffDashboard=async function(){
    const principal=staffDashboardIsPrincipal();
    const card=document.getElementById("principalMarksNotificationCard");
    const marksAction=document.querySelector("#staffDashboardPopup .staff-dashboard-action.marks");
    if(card) card.style.display=principal?"block":"none";
    if(marksAction){
        marksAction.textContent=principal?"📘 View Submitted Marks":"📘 Marks Entry";
        marksAction.setAttribute("onclick",principal?"openPrincipalMarksView()":"openMarksEntryHub()");
    }
    await marksFinalOriginalOpenStaffDashboard();
};

const marksFinalOriginalShowStudentRolls=showStudentRolls;
showStudentRolls=function(className){
    if(!MARKS_UPPER_CLASSES_FINAL.includes(className)) return marksFinalOriginalShowStudentRolls(className);
    return showUpperClassPublicRoster(className);
};

async function showUpperClassPublicRoster(className){
    document.getElementById("studentClassView").style.display="none";
    const rollView=document.getElementById("studentRollView");
    rollView.style.display="block";
    rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${escapeHtml(className)} - Student List</h2><div class="student-grid"><div class="marks-empty">Loading student list...</div></div>`;
    try{
        const db=initStudentSupabase();
        const {data,error}=await db.rpc("list_upper_class_public_students");
        if(error) throw error;
        const rows=marksSortedStudents((data||[]).filter(row=>row.class_name===className));
        const list=rows.length
            ?rows.map((row,index)=>`<button type="button" class="student-roll-btn upper-student-public-row" tabindex="-1">${index+1}. ${escapeHtml(row.name)}</button>`).join("")
            :'<div class="marks-empty">No students have been added to this Class yet.</div>';
        rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${escapeHtml(className)} - Student List</h2><div class="student-grid">${list}</div>`;
    }catch(error){
        rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${escapeHtml(className)} - Student List</h2><div class="marks-empty">Student list could not be loaded.</div>`;
    }
}

const marksFinalOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closePrincipalMarksView();
    marksFinalAdminClassData=null;
    marksFinalPrincipalClassData=null;
    await marksFinalOriginalStaffLogout();
};

/* ===== SOURCE SCRIPT BLOCK: video-tutorials-js ===== */
/* =========================================================
   PRIVATE VIDEO TUTORIALS
   Requires video_tutorials table and staff-tutorial-videos bucket.
   Supabase RLS is the real access boundary; hidden buttons are only UI.
========================================================= */
const VIDEO_TUTORIAL_CONFIG={
    table:"video_tutorials",
    bucket:"staff-tutorial-videos",
    maxBytes:50*1024*1024,
    signedUrlSeconds:3600,
    allowedTypes:new Set(["video/mp4","video/webm"])
};
let videoTutorialAdminRowCache=new Map();

function videoTutorialEscape(value){
    return String(value??"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function videoTutorialFormatBytes(value){
    const bytes=Number(value)||0;
    if(bytes<1024) return `${bytes} B`;
    if(bytes<1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
}

function videoTutorialFormatDate(value){
    if(!value) return "";
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-GB",{
        day:"2-digit",month:"short",year:"numeric",
        hour:"2-digit",minute:"2-digit",hour12:true,
        timeZone:"Asia/Kathmandu"
    }).format(date);
}

function videoTutorialMessage(message,type="error"){
    const box=document.getElementById("adminVideoTutorialStatus");
    if(!box) return;
    box.textContent=message;
    box.className=`video-tutorial-status show ${type}`;
}

function clearVideoTutorialMessage(){
    const box=document.getElementById("adminVideoTutorialStatus");
    if(box){
        box.textContent="";
        box.className="video-tutorial-status";
    }
}

function videoTutorialErrorMessage(error){
    const message=String(error?.message||"Unknown error");
    if(error?.code==="42P01" || /video_tutorials|video_tutorial_like|bucket not found/i.test(message)){
        return "Video Tutorials setup is not complete. Run the supplied Supabase SQL once, then refresh this page.";
    }
    return message;
}

function showSelectedTutorialVideo(){
    const file=document.getElementById("adminVideoTutorialFile")?.files?.[0];
    const info=document.getElementById("adminVideoTutorialFileInfo");
    clearVideoTutorialMessage();
    if(!info) return;
    info.textContent=file
        ?`${file.name} • ${videoTutorialFormatBytes(file.size)}`
        :"No video selected.";
}

function pauseOtherTutorialVideos(currentVideo=null){
    document.querySelectorAll("#videoTutorialPopup video, #adminVideoTutorialList video").forEach(video=>{
        if(video!==currentVideo && !video.paused) video.pause();
    });
}

async function videoTutorialSignedUrl(client,path){
    const {data,error}=await client.storage
        .from(VIDEO_TUTORIAL_CONFIG.bucket)
        .createSignedUrl(path,VIDEO_TUTORIAL_CONFIG.signedUrlSeconds);
    if(error) throw error;
    if(!data?.signedUrl) throw new Error("A secure video link could not be created.");
    return data.signedUrl;
}

async function loadVideoTutorialRows(client){
    const {data,error}=await client
        .from(VIDEO_TUTORIAL_CONFIG.table)
        .select("id,title,storage_path,original_name,mime_type,size_bytes,created_at")
        .order("created_at",{ascending:false});
    if(error) throw error;
    return data||[];
}

async function loadVideoTutorialLikeSummary(client){
    const {data,error}=await client.rpc("get_video_tutorial_like_summary");
    if(error) throw error;

    const summary=new Map();
    (data||[]).forEach(item=>{
        summary.set(String(item.tutorial_id),{
            like_count:Math.max(0,Number(item.like_count)||0),
            liked_by_me:item.liked_by_me===true
        });
    });
    return summary;
}

function attachVideoTutorialLikeSummary(rows,summary){
    return (rows||[]).map(row=>{
        const likeInfo=summary.get(String(row.id))||{like_count:0,liked_by_me:false};
        return {...row,...likeInfo};
    });
}

async function prepareVideoTutorialRows(client,rows){
    return Promise.all(rows.map(async row=>{
        try{
            return {...row,signed_url:await videoTutorialSignedUrl(client,row.storage_path),video_error:""};
        }catch(error){
            console.error("Tutorial video link error:",error);
            return {...row,signed_url:"",video_error:"Video is temporarily unavailable."};
        }
    }));
}

function videoTutorialCard(row,isAdmin=false){
    const title=videoTutorialEscape(row.title||"Untitled Video");
    const date=videoTutorialEscape(videoTutorialFormatDate(row.created_at));
    const size=videoTutorialEscape(videoTutorialFormatBytes(row.size_bytes));
    const likeCount=Math.max(0,Number(row.like_count)||0);
    const likedByMe=row.liked_by_me===true;
    const media=row.signed_url
        ?`<video controls controlsList="nodownload" disablePictureInPicture preload="metadata" playsinline onplay="pauseOtherTutorialVideos(this)">
              <source src="${videoTutorialEscape(row.signed_url)}" type="${videoTutorialEscape(row.mime_type||"video/mp4")}">
              Your browser cannot play this video.
          </video>`
        :`<div class="video-tutorial-empty" style="margin:14px;">${videoTutorialEscape(row.video_error||"Video unavailable.")}</div>`;
    const feedback=isAdmin
        ?`<div class="video-tutorial-feedback">
              <span class="video-tutorial-like-count">👍 ${likeCount} ${likeCount===1?"Like":"Likes"}</span>
              <button type="button" class="video-tutorial-who-liked"
                      onclick="openVideoTutorialLikers(${Number(row.id)})">
                  VIEW WHO LIKED
              </button>
          </div>`
        :`<div class="video-tutorial-feedback">
              <span id="videoTutorialLikeCount-${Number(row.id)}" class="video-tutorial-like-count">
                  👍 ${likeCount} ${likeCount===1?"Like":"Likes"}
              </span>
              <button type="button"
                      class="video-tutorial-like${likedByMe?" liked":""}"
                      aria-pressed="${likedByMe?"true":"false"}"
                      onclick="toggleVideoTutorialLike(${Number(row.id)},this)">
                  ${likedByMe?"👍 LIKED":"👍 LIKE"}
              </button>
          </div>`;
    const adminActions=isAdmin
        ?`<div class="video-tutorial-actions">
              <button type="button" class="video-tutorial-delete"
                      onclick="deleteVideoTutorial(${Number(row.id)},'${encodeURIComponent(String(row.storage_path||""))}',this)">
                  DELETE VIDEO
              </button>
          </div>`
        :"";

    return `<article class="video-tutorial-card">
        ${media}
        <div class="video-tutorial-card-content">
            <h4>${title}</h4>
            <div class="video-tutorial-meta"><span>${date}</span><span>${size}</span></div>
            ${feedback}
            ${adminActions}
        </div>
    </article>`;
}

async function toggleVideoTutorialLike(tutorialId,button){
    if(!loggedInStaff || !staffAuthSession?.user?.id){
        alert("A valid Staff or Principal login is required.");
        openStaffLogin();
        return;
    }

    const oldText=button?.textContent||"👍 LIKE";
    if(button){
        button.disabled=true;
        button.textContent="SAVING...";
    }

    try{
        const client=initStaffSupabase();
        if(!client) throw new Error("Staff login service is unavailable.");

        const {data,error}=await client.rpc("toggle_video_tutorial_like",{
            p_tutorial_id:Number(tutorialId),
            p_staff_name:loggedInStaff.name
        });
        if(error) throw error;

        const result=Array.isArray(data)?data[0]:data;
        const liked=result?.liked===true;
        const count=Math.max(0,Number(result?.like_count)||0);
        const countBox=document.getElementById(`videoTutorialLikeCount-${Number(tutorialId)}`);

        if(countBox) countBox.textContent=`👍 ${count} ${count===1?"Like":"Likes"}`;
        if(button){
            button.classList.toggle("liked",liked);
            button.setAttribute("aria-pressed",liked?"true":"false");
            button.textContent=liked?"👍 LIKED":"👍 LIKE";
        }
    }catch(error){
        console.error("Tutorial like error:",error);
        alert("Like could not be saved: "+videoTutorialErrorMessage(error));
        if(button) button.textContent=oldText;
    }finally{
        if(button) button.disabled=false;
    }
}

async function openVideoTutorialLikers(tutorialId){
    if(!studentAdminSession || !isWebsiteAdminSession(studentAdminSession)){
        alert("Website Admin login is required.");
        return;
    }

    const id=Number(tutorialId);
    const row=videoTutorialAdminRowCache.get(id);
    const popup=document.getElementById("videoTutorialLikersPopup");
    const title=document.getElementById("videoTutorialLikersTitle");
    const count=document.getElementById("videoTutorialLikersCount");
    const host=document.getElementById("videoTutorialLikersList");

    if(title) title.textContent=row?.title||"Video Tutorial";
    if(count) count.textContent="";
    if(host) host.innerHTML='<div class="video-tutorial-empty">Loading staff names...</div>';
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";

    try{
        const client=initStudentSupabase();
        if(!client) throw new Error("Admin service is unavailable.");

        const {data,error}=await client.rpc("get_video_tutorial_likers",{
            p_tutorial_id:id
        });
        if(error) throw error;

        const names=(data||[])
            .map(item=>String(item.staff_name||"").trim())
            .filter(Boolean);

        if(count) count.textContent=`${names.length} Staff ${names.length===1?"Member":"Members"} Liked`;
        if(host){
            host.innerHTML=names.length
                ?names.map(name=>`
                    <div class="video-tutorial-liker-name">
                        <span aria-hidden="true">👤</span>
                        <span>${videoTutorialEscape(name)}</span>
                    </div>`).join("")
                :'<div class="video-tutorial-empty">No staff member has liked this video yet.</div>';
        }
    }catch(error){
        console.error("Tutorial liker list error:",error);
        if(host){
            host.innerHTML=`<div class="video-tutorial-empty">Could not load staff names. ${videoTutorialEscape(videoTutorialErrorMessage(error))}</div>`;
        }
    }
}

function closeVideoTutorialLikers(){
    const popup=document.getElementById("videoTutorialLikersPopup");
    if(popup) popup.style.display="none";
    const adminPanelOpen=document.getElementById("websiteAdminPanel")?.style.display==="block";
    document.body.style.overflow=adminPanelOpen?"hidden":"auto";
}

async function openVideoTutorials(){
    if(!loggedInStaff || !staffAuthSession){
        openStaffLogin();
        return;
    }
    const popup=document.getElementById("videoTutorialPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await renderStaffVideoTutorials();
}

function closeVideoTutorials(){
    pauseOtherTutorialVideos();
    const popup=document.getElementById("videoTutorialPopup");
    if(popup) popup.style.display="none";
    const host=document.getElementById("staffVideoTutorialList");
    if(host) host.innerHTML='<div class="video-tutorial-empty">Open Video Tutorials to load videos.</div>';
    document.body.style.overflow="auto";
}

async function renderStaffVideoTutorials(){
    const host=document.getElementById("staffVideoTutorialList");
    if(!host) return;
    if(!loggedInStaff || !staffAuthSession){
        host.innerHTML='<div class="video-tutorial-empty">Staff or Principal login is required.</div>';
        return;
    }
    host.innerHTML='<div class="video-tutorial-empty">Loading tutorial videos...</div>';
    try{
        const client=initStaffSupabase();
        if(!client) throw new Error("Staff login service is unavailable.");
        const [rows,likeSummary]=await Promise.all([
            loadVideoTutorialRows(client),
            loadVideoTutorialLikeSummary(client)
        ]);
        if(!rows.length){
            host.innerHTML='<div class="video-tutorial-empty">No tutorial videos have been uploaded yet.</div>';
            return;
        }
        const readyRows=await prepareVideoTutorialRows(
            client,
            attachVideoTutorialLikeSummary(rows,likeSummary)
        );
        host.innerHTML=readyRows.map(row=>videoTutorialCard(row,false)).join("");
    }catch(error){
        console.error("Staff tutorial video load error:",error);
        host.innerHTML=`<div class="video-tutorial-empty">Could not load videos. ${videoTutorialEscape(videoTutorialErrorMessage(error))}</div>`;
    }
}

async function renderAdminVideoTutorials(){
    const host=document.getElementById("adminVideoTutorialList");
    if(!host) return;
    if(!studentAdminSession || !isWebsiteAdminSession(studentAdminSession)){
        host.innerHTML='<div class="video-tutorial-empty">Admin login is required.</div>';
        return;
    }
    pauseOtherTutorialVideos();
    host.innerHTML='<div class="video-tutorial-empty">Loading tutorial videos...</div>';
    try{
        const client=initStudentSupabase();
        if(!client) throw new Error("Admin service is unavailable.");
        const [rows,likeSummary]=await Promise.all([
            loadVideoTutorialRows(client),
            loadVideoTutorialLikeSummary(client)
        ]);
        if(!rows.length){
            videoTutorialAdminRowCache=new Map();
            host.innerHTML='<div class="video-tutorial-empty">No tutorial videos have been uploaded yet.</div>';
            return;
        }
        const readyRows=await prepareVideoTutorialRows(
            client,
            attachVideoTutorialLikeSummary(rows,likeSummary)
        );
        videoTutorialAdminRowCache=new Map(readyRows.map(row=>[Number(row.id),row]));
        host.innerHTML=readyRows.map(row=>videoTutorialCard(row,true)).join("");
    }catch(error){
        console.error("Admin tutorial video load error:",error);
        videoTutorialAdminRowCache=new Map();
        host.innerHTML=`<div class="video-tutorial-empty">Could not load videos. ${videoTutorialEscape(videoTutorialErrorMessage(error))}</div>`;
    }
}

function videoTutorialExtension(file){
    if(videoTutorialMimeType(file)==="video/webm") return "webm";
    return "mp4";
}

function videoTutorialMimeType(file){
    const supplied=String(file?.type||"").toLowerCase();
    if(VIDEO_TUTORIAL_CONFIG.allowedTypes.has(supplied)) return supplied;
    const name=String(file?.name||"").toLowerCase();
    if(name.endsWith(".webm")) return "video/webm";
    if(name.endsWith(".mp4")) return "video/mp4";
    return "";
}

async function uploadVideoTutorial(event){
    event.preventDefault();
    if(!studentAdminSession || !isWebsiteAdminSession(studentAdminSession)){
        videoTutorialMessage("Admin login is required.");
        return;
    }

    const title=document.getElementById("adminVideoTutorialTitle")?.value.trim()||"";
    const file=document.getElementById("adminVideoTutorialFile")?.files?.[0];
    const button=document.getElementById("adminVideoTutorialUploadBtn");
    const mimeType=videoTutorialMimeType(file);

    if(!title){videoTutorialMessage("Enter the video name.");return;}
    if(!file){videoTutorialMessage("Choose an MP4 or WebM video.");return;}
    if(!mimeType){
        videoTutorialMessage("Only MP4 or WebM videos are allowed.");
        return;
    }
    if(file.size<=0 || file.size>VIDEO_TUTORIAL_CONFIG.maxBytes){
        videoTutorialMessage("The video must be smaller than 50 MB.");
        return;
    }

    const oldText=button?.textContent||"UPLOAD VIDEO";
    if(button){button.disabled=true;button.textContent="UPLOADING...";}
    videoTutorialMessage("Uploading securely. Please keep this page open...","working");

    const randomPart=(globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9-]/g,"");
    const storagePath=`tutorials/${Date.now()}-${randomPart}.${videoTutorialExtension(file)}`;
    const client=initStudentSupabase();

    try{
        if(!client) throw new Error("Admin service is unavailable.");
        const {error:uploadError}=await client.storage
            .from(VIDEO_TUTORIAL_CONFIG.bucket)
            .upload(storagePath,file,{
                cacheControl:"3600",
                upsert:false,
                contentType:mimeType
            });
        if(uploadError) throw uploadError;

        const {error:insertError}=await client
            .from(VIDEO_TUTORIAL_CONFIG.table)
            .insert({
                title,
                storage_path:storagePath,
                original_name:file.name,
                mime_type:mimeType,
                size_bytes:file.size,
                created_by:studentAdminSession.user.id
            });

        if(insertError){
            await client.storage.from(VIDEO_TUTORIAL_CONFIG.bucket).remove([storagePath]);
            throw insertError;
        }

        document.getElementById("adminVideoTutorialForm")?.reset();
        const info=document.getElementById("adminVideoTutorialFileInfo");
        if(info) info.textContent="No video selected.";
        videoTutorialMessage("Video uploaded successfully.","success");
        await renderAdminVideoTutorials();
    }catch(error){
        console.error("Tutorial video upload error:",error);
        videoTutorialMessage("Upload failed: "+videoTutorialErrorMessage(error));
    }finally{
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function deleteVideoTutorial(id,encodedPath,button){
    if(!studentAdminSession || !isWebsiteAdminSession(studentAdminSession)){
        videoTutorialMessage("Admin login is required.");
        return;
    }
    if(!confirm("Delete this tutorial video permanently?")) return;

    const path=decodeURIComponent(encodedPath||"");
    const oldText=button?.textContent||"DELETE VIDEO";
    if(button){button.disabled=true;button.textContent="DELETING...";}
    clearVideoTutorialMessage();

    try{
        const client=initStudentSupabase();
        if(!client) throw new Error("Admin service is unavailable.");

        const {error:storageError}=await client.storage
            .from(VIDEO_TUTORIAL_CONFIG.bucket)
            .remove([path]);
        if(storageError) throw storageError;

        const {error:rowError}=await client
            .from(VIDEO_TUTORIAL_CONFIG.table)
            .delete()
            .eq("id",Number(id));
        if(rowError) throw rowError;

        videoTutorialMessage("Video deleted successfully.","success");
        await renderAdminVideoTutorials();
    }catch(error){
        console.error("Tutorial video delete error:",error);
        videoTutorialMessage("Delete failed: "+videoTutorialErrorMessage(error));
        if(button?.isConnected){button.disabled=false;button.textContent=oldText;}
    }
}

/* Add role-aware visibility without changing the existing login workflow. */
const videoTutorialOriginalUpdateStaffLoginUI=updateStaffLoginUI;
updateStaffLoginUI=function(){
    videoTutorialOriginalUpdateStaffLoginUI();
    const button=document.getElementById("staffVideoTutorialsOpenBtn");
    if(button) button.style.display=loggedInStaff?"inline-block":"none";
};

const videoTutorialOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeVideoTutorials();
    await videoTutorialOriginalStaffLogout();
};

const videoTutorialOriginalCloseAdminPanel=closeWebsiteAdminPanel;
closeWebsiteAdminPanel=function(){
    pauseOtherTutorialVideos();
    closeVideoTutorialLikers();
    videoTutorialOriginalCloseAdminPanel();
};

document.addEventListener("DOMContentLoaded",()=>{
    updateStaffLoginUI();
    document.getElementById("videoTutorialPopup")?.addEventListener("click",event=>{
        if(event.target?.id==="videoTutorialPopup") closeVideoTutorials();
    });
    document.getElementById("videoTutorialLikersPopup")?.addEventListener("click",event=>{
        if(event.target?.id==="videoTutorialLikersPopup") closeVideoTutorialLikers();
    });
});

/* ===== SOURCE SCRIPT BLOCK: internal-evaluation-subject-js ===== */
/* =========================================================
   INTERNAL EVALUATION — COMMON + SUBJECT TEACHER WORKSPACE
========================================================= */
const INTERNAL_CLASS_ORDER=[
    "Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5",
    "Class 6","Class 7","Class 8","Class 9","Class 10"
];
const INTERNAL_EDITABLE_STATUSES=["draft","returned_to_subject_teacher"];
const INTERNAL_PRINCIPAL_STAFF_ID="joseph";

let internalTeacherProjects=[];
let internalActiveProject=null;
let internalActiveUnits=[];
let internalActiveStudents=[];
let internalUnitMarks=new Map();
let internalExamMarks=new Map();
let internalMyClassAssignments=[];

function internalNumber(value){
    if(value===null||value===undefined||value==="") return "";
    const n=Number(value);
    if(!Number.isFinite(n)) return "";
    return Number.isInteger(n)?String(n):String(Number(n.toFixed(2)));
}
function internalNumeric(value){
    if(value===null||value===undefined||String(value).trim()==="") return null;
    const n=Number(value);
    return Number.isFinite(n)?Number(n.toFixed(2)):null;
}
function internalKey(){
    return globalThis.crypto?.randomUUID?.()||`unit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function internalStatusLabel(status){
    return ({
        draft:"Draft",
        pending_class_teacher:"Pending — Class Teacher",
        accepted_by_class_teacher:"Accepted by Class Teacher",
        submitted_to_admin:"Submitted to Admin",
        returned_by_admin:"Returned by Admin",
        returned_to_subject_teacher:"Returned for Correction"
    })[status]||"Draft";
}
function internalStatusHtml(status){
    const safe=["draft","pending_class_teacher","accepted_by_class_teacher","submitted_to_admin","returned_by_admin","returned_to_subject_teacher"].includes(status)?status:"draft";
    return `<span class="internal-status ${safe}">${escapeHtml(internalStatusLabel(safe))}</span>`;
}
function internalAchievementLabel(language){
    return language==="ne"?"सिकाइ उपलब्धि संख्या":"Number of Learning Achievements";
}
function internalEditable(project=internalActiveProject){
    return !!project&&INTERNAL_EDITABLE_STATUSES.includes(project.status);
}
function internalFormatDate(value){
    if(!value) return "—";
    try{return new Date(value).toLocaleString("en-GB",{timeZone:"Asia/Kathmandu"});}
    catch(_error){return String(value);}
}
function internalShowMessage(message,type="error"){
    const box=document.getElementById("internalTeacherMessage");
    if(!box) return;
    box.textContent=message;
    box.className=`internal-message show ${type}`;
}
function internalClearMessage(){
    const box=document.getElementById("internalTeacherMessage");
    if(box){box.textContent="";box.className="internal-message";}
}
function internalPopulateClassSelect(select){
    if(!select) return;
    const current=select.value;
    select.innerHTML=INTERNAL_CLASS_ORDER.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
    if(INTERNAL_CLASS_ORDER.includes(current)) select.value=current;
}
function internalGroupKey(row){
    return `${row.class_name}\u0001${String(row.academic_session||"").trim().toLowerCase()}\u0001${String(row.evaluation_name||"").trim().toLowerCase()}`;
}
function internalGroupRows(rows){
    const map=new Map();
    (rows||[]).forEach(row=>{
        const key=internalGroupKey(row);
        if(!map.has(key)) map.set(key,{key,className:row.class_name,evaluationName:row.evaluation_name,session:row.academic_session,rows:[]});
        map.get(key).rows.push(row);
    });
    return [...map.values()].sort((a,b)=>INTERNAL_CLASS_ORDER.indexOf(a.className)-INTERNAL_CLASS_ORDER.indexOf(b.className)||String(b.evaluationName).localeCompare(a.evaluationName));
}
function internalSafeFileName(value){
    if(typeof marksSafeFileName==="function") return marksSafeFileName(value);
    return String(value||"Internal_Evaluation").replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"Internal_Evaluation";
}

async function openInternalEvaluationHub(){
    if(!loggedInStaff||!staffAuthSession?.user?.id){openStaffLogin();return;}
    closeStaffDashboard();
    internalClearMessage();
    internalPopulateClassSelect(document.getElementById("internalCreateClass"));
    internalPopulateClassSelect(document.getElementById("internalEditClass"));
    const principal=loggedInStaff.username===INTERNAL_PRINCIPAL_STAFF_ID;
    const principalBtn=document.getElementById("internalPrincipalTabBtn");
    if(principalBtn) principalBtn.style.display=principal?"inline-block":"none";
    const popup=document.getElementById("internalEvaluationPopup");
    if(popup) popup.style.display="block";
    document.body.style.overflow="hidden";
    await Promise.all([loadInternalTeacherProjects(),loadMyInternalClassAssignments()]);
    if(principal){
        showInternalPane("principal");
        await loadInternalPrincipalGroups();
    }else{
        showInternalPane("subject");
    }
}
function closeInternalEvaluationHub(){
    const popup=document.getElementById("internalEvaluationPopup");
    if(popup) popup.style.display="none";
    document.body.style.overflow="auto";
}
function showInternalPane(name){
    const panes={subject:"internalSubjectPane",classTeacher:"internalClassTeacherPane",principal:"internalPrincipalPane"};
    const buttons={subject:"internalSubjectTabBtn",classTeacher:"internalClassTeacherTabBtn",principal:"internalPrincipalTabBtn"};
    Object.entries(panes).forEach(([key,id])=>document.getElementById(id)?.classList.toggle("active",key===name));
    Object.entries(buttons).forEach(([key,id])=>document.getElementById(id)?.classList.toggle("active",key===name));
    if(name==="classTeacher") loadInternalClassTeacherGroups();
    if(name==="principal") loadInternalPrincipalGroups();
}
async function loadMyInternalClassAssignments(){
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.rpc("get_my_internal_class_teacher_assignments");
        if(error) throw error;
        internalMyClassAssignments=data||[];
    }catch(error){
        console.error("Internal Class Teacher assignment error:",error);
        internalMyClassAssignments=[];
    }
    const button=document.getElementById("internalClassTeacherTabBtn");
    if(button) button.style.display=internalMyClassAssignments.length?"inline-block":"none";
    const identity=document.getElementById("internalClassTeacherIdentity");
    if(identity) identity.textContent=internalMyClassAssignments.length
        ?`Assigned Class: ${internalMyClassAssignments.map(row=>row.class_name).join(", ")}`
        :"No Class Teacher assignment is linked to this Staff ID.";
}

async function createInternalEvaluation(event){
    event.preventDefault();
    if(!loggedInStaff||!staffAuthSession?.user?.id) return;
    const button=document.getElementById("internalCreateBtn");
    const payload={
        p_class_name:document.getElementById("internalCreateClass")?.value||"",
        p_subject_name:document.getElementById("internalCreateSubject")?.value.trim()||"",
        p_evaluation_name:document.getElementById("internalCreateName")?.value.trim()||"",
        p_academic_session:document.getElementById("internalCreateSession")?.value.trim()||"",
        p_achievement_language:document.getElementById("internalCreateLanguage")?.value||"en",
        p_exam_full_marks:internalNumeric(document.getElementById("internalCreateExamFull")?.value)||0,
        p_staff_name:loggedInStaff.name
    };
    const oldText=button?.textContent||"CREATE EVALUATION";
    if(button){button.disabled=true;button.textContent="CREATING...";}
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.rpc("create_internal_evaluation",payload);
        if(error) throw error;
        document.getElementById("internalCreateSubject").value="";
        internalShowMessage("Internal Evaluation created. Add Theme / Units and enter Marks below.","success");
        await loadInternalTeacherProjects(data);
    }catch(error){
        internalShowMessage("Could not create the Internal Evaluation: "+(error?.message||"Unknown error"));
    }finally{
        if(button){button.disabled=false;button.textContent=oldText;}
    }
}

async function loadInternalTeacherProjects(preferredId=null){
    const select=document.getElementById("internalProjectSelect");
    const empty=document.getElementById("internalTeacherEmpty");
    const workspace=document.getElementById("internalTeacherWorkspace");
    if(!loggedInStaff||!staffAuthSession?.user?.id) return;
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("internal_evaluations")
            .select("id,created_by,staff_id,staff_name,class_name,subject_name,evaluation_name,academic_session,achievement_language,exam_full_marks,status,class_teacher_staff_id,class_teacher_name,class_teacher_note,admin_note,submitted_to_class_teacher_at,class_teacher_accepted_at,submitted_to_admin_at,returned_at,created_at,updated_at")
            .eq("staff_id",loggedInStaff.username)
            .order("updated_at",{ascending:false});
        if(error) throw error;
        internalTeacherProjects=data||[];
        if(!internalTeacherProjects.length){
            if(select) select.innerHTML="";
            if(empty) empty.style.display="block";
            if(workspace) workspace.style.display="none";
            internalActiveProject=null;
            return;
        }
        if(empty) empty.style.display="none";
        if(workspace) workspace.style.display="block";
        if(select){
            select.innerHTML=internalTeacherProjects.map(row=>`<option value="${Number(row.id)}">${escapeHtml(row.class_name)} — ${escapeHtml(row.subject_name)} — ${escapeHtml(row.evaluation_name)} [${escapeHtml(internalStatusLabel(row.status))}]</option>`).join("");
        }
        const chosen=internalTeacherProjects.some(row=>String(row.id)===String(preferredId))?preferredId:internalTeacherProjects[0].id;
        if(select) select.value=String(chosen);
        await loadInternalTeacherProject(chosen);
    }catch(error){
        internalShowMessage("Could not load Internal Evaluations. Run the supplied Supabase SQL first: "+(error?.message||"Unknown error"));
        if(workspace) workspace.style.display="none";
    }
}

async function loadInternalTeacherProject(projectId){
    const project=internalTeacherProjects.find(row=>String(row.id)===String(projectId));
    if(!project) return;
    internalActiveProject=project;
    internalActiveUnits=[];
    internalUnitMarks=new Map();
    internalExamMarks=new Map();
    internalClearMessage();
    try{
        const db=initStaffSupabase();
        const [unitsResult,marksResult,examResult,students]=await Promise.all([
            db.from("internal_evaluation_units").select("id,evaluation_id,client_key,theme_name,learning_achievement_count,full_marks,display_order").eq("evaluation_id",project.id).order("display_order").order("id"),
            db.from("internal_evaluation_marks").select("evaluation_id,unit_id,student_id,student_name,obtained_marks").eq("evaluation_id",project.id),
            db.from("internal_exam_marks").select("evaluation_id,student_id,student_name,obtained_marks").eq("evaluation_id",project.id),
            marksFetchStudents(db,project.class_name)
        ]);
        if(unitsResult.error) throw unitsResult.error;
        if(marksResult.error) throw marksResult.error;
        if(examResult.error) throw examResult.error;
        internalActiveUnits=(unitsResult.data||[]).map(row=>({...row,learning_achievement_count:Number(row.learning_achievement_count)}));
        const keyById=new Map(internalActiveUnits.map(row=>[String(row.id),row.client_key]));
        (marksResult.data||[]).forEach(row=>{
            const unitKey=keyById.get(String(row.unit_id));
            if(unitKey) internalUnitMarks.set(`${unitKey}|${row.student_id}`,internalNumber(row.obtained_marks));
        });
        (examResult.data||[]).forEach(row=>internalExamMarks.set(row.student_id,internalNumber(row.obtained_marks)));
        internalActiveStudents=students||[];
        renderInternalTeacherProject();
    }catch(error){
        internalShowMessage("Could not load this Internal Evaluation: "+(error?.message||"Unknown error"));
    }
}

function internalReadMetadata(){
    return {
        className:document.getElementById("internalEditClass")?.value||internalActiveProject?.class_name||"",
        subjectName:document.getElementById("internalEditSubject")?.value.trim()||"",
        evaluationName:document.getElementById("internalEditName")?.value.trim()||"",
        session:document.getElementById("internalEditSession")?.value.trim()||"",
        language:document.getElementById("internalEditLanguage")?.value||"en",
        examFull:internalNumeric(document.getElementById("internalEditExamFull")?.value)
    };
}
function renderInternalTeacherProject(){
    if(!internalActiveProject) return;
    const editable=internalEditable();
    const ids={
        internalEditClass:internalActiveProject.class_name,
        internalEditSubject:internalActiveProject.subject_name,
        internalEditName:internalActiveProject.evaluation_name,
        internalEditSession:internalActiveProject.academic_session,
        internalEditLanguage:internalActiveProject.achievement_language,
        internalEditExamFull:internalNumber(internalActiveProject.exam_full_marks)
    };
    Object.entries(ids).forEach(([id,value])=>{const el=document.getElementById(id);if(el){el.value=value;el.disabled=!editable;}});
    const status=document.getElementById("internalTeacherStatusBar");
    if(status) status.innerHTML=`<span>${escapeHtml(internalActiveProject.class_name)} • ${escapeHtml(internalActiveProject.subject_name)} • ${escapeHtml(internalActiveProject.evaluation_name)} • Session ${escapeHtml(internalActiveProject.academic_session)}</span>${internalStatusHtml(internalActiveProject.status)}`;
    const notes=[internalActiveProject.admin_note?`Admin: ${internalActiveProject.admin_note}`:"",internalActiveProject.class_teacher_note?`Class Teacher: ${internalActiveProject.class_teacher_note}`:""].filter(Boolean);
    const note=document.getElementById("internalTeacherReturnNote");
    if(note){note.style.display=notes.length?"block":"none";note.textContent=notes.join("\n\n");}
    const label=document.getElementById("internalNewUnitCountLabel");
    if(label) label.textContent=internalAchievementLabel(internalActiveProject.achievement_language);
    const manager=document.getElementById("internalUnitManager");
    if(manager) manager.style.display=editable?"block":"none";
    ["internalSaveBtn","internalDeleteBtn","internalSubmitBtn"].forEach(id=>{const el=document.getElementById(id);if(el) el.style.display=editable?"inline-block":"none";});
    renderInternalUnitList();
    renderInternalMarksTable();
}

function addInternalUnit(event){
    event.preventDefault();
    if(!internalEditable()) return;
    const name=document.getElementById("internalNewUnitName")?.value.trim()||"";
    const count=Number(document.getElementById("internalNewUnitCount")?.value||0);
    if(!name||!Number.isInteger(count)||count<1||count>300){internalShowMessage("Enter a Theme / Unit Name and a valid Learning Achievement number (1–300).");return;}
    internalActiveUnits.push({client_key:internalKey(),theme_name:name,learning_achievement_count:count,full_marks:count*4,display_order:internalActiveUnits.length+1});
    document.getElementById("internalNewUnitName").value="";
    document.getElementById("internalNewUnitCount").value="";
    renderInternalUnitList();
    renderInternalMarksTable();
}
function updateInternalUnit(index,field,value){
    if(!internalEditable()||!internalActiveUnits[index]) return;
    if(field==="theme_name") internalActiveUnits[index].theme_name=value;
    if(field==="learning_achievement_count"){
        const count=Number(value);
        internalActiveUnits[index].learning_achievement_count=count;
        internalActiveUnits[index].full_marks=Number.isFinite(count)?count*4:0;
        renderInternalMarksTable();
        const full=document.getElementById(`internalUnitFull-${index}`);
        if(full) full.textContent=`Full Marks: ${internalNumber(internalActiveUnits[index].full_marks)}`;
    }
}
function deleteInternalUnit(index){
    if(!internalEditable()||!internalActiveUnits[index]) return;
    const unit=internalActiveUnits[index];
    if(!confirm(`Delete Theme / Unit: ${unit.theme_name}?`)) return;
    internalActiveUnits.splice(index,1);
    [...internalUnitMarks.keys()].forEach(key=>{if(key.startsWith(`${unit.client_key}|`)) internalUnitMarks.delete(key);});
    internalActiveUnits.forEach((row,i)=>row.display_order=i+1);
    renderInternalUnitList();
    renderInternalMarksTable();
}
function renderInternalUnitList(){
    const host=document.getElementById("internalUnitList");
    if(!host) return;
    if(!internalActiveUnits.length){host.innerHTML='<div class="marks-empty">No Theme / Unit added yet.</div>';return;}
    const editable=internalEditable();
    const language=document.getElementById("internalEditLanguage")?.value||internalActiveProject?.achievement_language||"en";
    host.innerHTML=internalActiveUnits.map((unit,index)=>`
        <div class="internal-unit-row">
            <div class="sn">S.N. ${index+1}</div>
            <label class="internal-field">Theme / Unit Name<input value="${escapeHtmlAttr(unit.theme_name)}" maxlength="180" oninput="updateInternalUnit(${index},'theme_name',this.value)" ${editable?"":"disabled"}></label>
            <label class="internal-field">${escapeHtml(internalAchievementLabel(language))}<input type="number" min="1" max="300" step="1" value="${escapeHtmlAttr(unit.learning_achievement_count)}" oninput="updateInternalUnit(${index},'learning_achievement_count',this.value)" ${editable?"":"disabled"}></label>
            <div id="internalUnitFull-${index}" class="internal-unit-full">Full Marks: ${escapeHtml(internalNumber(Number(unit.learning_achievement_count)*4))}</div>
            ${editable?`<button type="button" class="internal-danger" onclick="deleteInternalUnit(${index})">DELETE</button>`:""}
        </div>`).join("");
}

function internalStudentTotal(studentId){
    let total=0,complete=internalActiveUnits.length>0;
    internalActiveUnits.forEach(unit=>{
        const value=internalNumeric(internalUnitMarks.get(`${unit.client_key}|${studentId}`));
        if(value===null) complete=false; else total+=value;
    });
    return {complete,total:Number(total.toFixed(2))};
}
function internalSetUnitMark(studentIndex,unitIndex,input){
    const student=internalActiveStudents[studentIndex],unit=internalActiveUnits[unitIndex];
    if(!student||!unit||!internalEditable()) return;
    const raw=input.value.trim(),value=internalNumeric(raw),max=Number(unit.learning_achievement_count)*4;
    input.classList.toggle("invalid",value!==null&&(value<0||value>max));
    const key=`${unit.client_key}|${student.studentId}`;
    if(raw==="") internalUnitMarks.delete(key); else internalUnitMarks.set(key,raw);
    const total=internalStudentTotal(student.studentId);
    const cell=document.getElementById(`internalTotalCell-${studentIndex}`);
    if(cell){cell.textContent=total.complete?internalNumber(total.total):"—";cell.className=total.complete?"calculated":"blank-total";}
}
function internalSetExamMark(studentIndex,input){
    const student=internalActiveStudents[studentIndex];
    if(!student||!internalEditable()) return;
    const raw=input.value.trim(),value=internalNumeric(raw),max=internalNumeric(document.getElementById("internalEditExamFull")?.value)||0;
    input.classList.toggle("invalid",value!==null&&(value<0||value>max));
    if(raw==="") internalExamMarks.delete(student.studentId); else internalExamMarks.set(student.studentId,raw);
}
function renderInternalMarksTable(){
    const host=document.getElementById("internalMarksTableHost");
    if(!host||!internalActiveProject) return;
    if(!internalActiveStudents.length){host.innerHTML='<div class="marks-empty">No students were found in the selected Class.</div>';return;}
    if(!internalActiveUnits.length){host.innerHTML='<div class="marks-empty">Add at least one Theme / Unit to open Marks Entry.</div>';return;}
    const editable=internalEditable();
    const language=document.getElementById("internalEditLanguage")?.value||internalActiveProject.achievement_language;
    const examFull=internalNumeric(document.getElementById("internalEditExamFull")?.value)||0;
    const totalFull=internalActiveUnits.reduce((sum,unit)=>sum+(Number(unit.learning_achievement_count)||0)*4,0);
    const headers=internalActiveUnits.map(unit=>`<th>${escapeHtml(unit.theme_name)}<small>${escapeHtml(internalAchievementLabel(language))}: ${escapeHtml(internalNumber(unit.learning_achievement_count))} • FM ${escapeHtml(internalNumber(Number(unit.learning_achievement_count)*4))}</small></th>`).join("");
    const body=internalActiveStudents.map((student,studentIndex)=>{
        const unitCells=internalActiveUnits.map((unit,unitIndex)=>{
            const value=internalUnitMarks.get(`${unit.client_key}|${student.studentId}`)||"";
            return `<td><input type="number" min="0" max="${Number(unit.learning_achievement_count)*4}" step="0.01" value="${escapeHtmlAttr(value)}" oninput="internalSetUnitMark(${studentIndex},${unitIndex},this)" ${editable?"":"disabled"}></td>`;
        }).join("");
        const total=internalStudentTotal(student.studentId);
        const exam=internalExamMarks.get(student.studentId)||"";
        return `<tr><td>${studentIndex+1}</td><td>${escapeHtml(student.studentId)}</td><td class="student-name">${escapeHtml(student.name)}</td>${unitCells}<td id="internalTotalCell-${studentIndex}" class="${total.complete?"calculated":"blank-total"}">${total.complete?escapeHtml(internalNumber(total.total)):"—"}</td><td><input type="number" min="0" max="${examFull}" step="0.01" value="${escapeHtmlAttr(exam)}" oninput="internalSetExamMark(${studentIndex},this)" ${editable?"":"disabled"}></td></tr>`;
    }).join("");
    host.innerHTML=`<div class="internal-card"><div class="internal-section-head"><div><h4>Student Marks Entry</h4><p class="internal-muted">Internal Full Marks: ${escapeHtml(internalNumber(totalFull))} • Exam Full Marks: ${escapeHtml(internalNumber(examFull))}</p></div></div><div class="internal-table-wrap"><table class="internal-table"><thead><tr><th>S.N.</th><th>Student ID</th><th>Student Name</th>${headers}<th>Internal OM<small>Full ${escapeHtml(internalNumber(totalFull))}</small></th><th>${escapeHtml(internalActiveProject.subject_name)} Exam OM<small>Full ${escapeHtml(internalNumber(examFull))}</small></th></tr></thead><tbody>${body}</tbody></table></div></div>`;
}

async function internalChangeActiveClass(){
    if(!internalEditable()) return;
    const className=document.getElementById("internalEditClass")?.value||"";
    if(!INTERNAL_CLASS_ORDER.includes(className)) return;
    if((internalUnitMarks.size||internalExamMarks.size)&&!confirm("Changing Class clears the current unsaved student Marks. Continue?")){
        document.getElementById("internalEditClass").value=internalActiveProject.class_name;
        return;
    }
    internalUnitMarks=new Map();
    internalExamMarks=new Map();
    try{
        internalActiveStudents=await marksFetchStudents(initStaffSupabase(),className);
        renderInternalMarksTable();
    }catch(error){internalShowMessage("Could not load the selected Class roster: "+(error?.message||"Unknown error"));}
}
function internalLanguageChanged(){
    const language=document.getElementById("internalEditLanguage")?.value||"en";
    const label=document.getElementById("internalNewUnitCountLabel");
    if(label) label.textContent=internalAchievementLabel(language);
    renderInternalUnitList();renderInternalMarksTable();
}
function internalValidateDraft(requireComplete=false){
    const meta=internalReadMetadata();
    if(!INTERNAL_CLASS_ORDER.includes(meta.className)) throw new Error("Select a valid Class.");
    if(!meta.subjectName||!meta.evaluationName||!meta.session) throw new Error("Subject, Evaluation Name and Academic Session are required.");
    if(meta.examFull===null||meta.examFull<0||meta.examFull>1200) throw new Error("Exam Full Marks must be between 0 and 1200.");
    if(requireComplete&&meta.examFull<=0) throw new Error("Enter Exam Full Marks before submitting.");
    if(requireComplete&&!internalActiveUnits.length) throw new Error("Add at least one Theme / Unit.");
    internalActiveUnits.forEach((unit,index)=>{
        const count=Number(unit.learning_achievement_count);
        if(!String(unit.theme_name||"").trim()) throw new Error(`Theme / Unit ${index+1} needs a name.`);
        if(!Number.isInteger(count)||count<1||count>300) throw new Error(`Theme / Unit ${index+1} needs a valid Learning Achievement number.`);
    });
    internalActiveStudents.forEach(student=>{
        internalActiveUnits.forEach(unit=>{
            const raw=internalUnitMarks.get(`${unit.client_key}|${student.studentId}`);
            const value=internalNumeric(raw),max=Number(unit.learning_achievement_count)*4;
            if(value!==null&&(value<0||value>max)) throw new Error(`${student.name}: Internal Obtained Marks must be between 0 and ${internalNumber(max)}.`);
            if(requireComplete&&value===null) throw new Error(`Complete all Internal Marks. Missing: ${student.name} — ${unit.theme_name}.`);
        });
        const exam=internalNumeric(internalExamMarks.get(student.studentId));
        if(exam!==null&&(exam<0||exam>meta.examFull)) throw new Error(`${student.name}: Exam Obtained Marks cannot exceed ${internalNumber(meta.examFull)}.`);
        if(requireComplete&&exam===null) throw new Error(`Complete Exam Obtained Marks for ${student.name}.`);
    });
    return meta;
}
function internalSerializeDraft(meta){
    const units=internalActiveUnits.map((unit,index)=>({client_key:unit.client_key,theme_name:String(unit.theme_name||"").trim(),learning_achievement_count:Number(unit.learning_achievement_count),display_order:index+1}));
    const marks=[];
    internalActiveStudents.forEach(student=>internalActiveUnits.forEach(unit=>{
        const value=internalNumeric(internalUnitMarks.get(`${unit.client_key}|${student.studentId}`));
        if(value!==null) marks.push({unit_key:unit.client_key,student_id:student.studentId,student_name:student.name,obtained_marks:value});
    }));
    const examMarks=[];
    internalActiveStudents.forEach(student=>{
        const value=internalNumeric(internalExamMarks.get(student.studentId));
        if(value!==null) examMarks.push({student_id:student.studentId,student_name:student.name,obtained_marks:value});
    });
    return {meta,units,marks,examMarks};
}
async function saveInternalDraft(options={}){
    if(!internalActiveProject||!internalEditable()) return false;
    const button=document.getElementById("internalSaveBtn"),oldText=button?.textContent||"SAVE DRAFT";
    try{
        const meta=internalValidateDraft(!!options.requireComplete);
        const payload=internalSerializeDraft(meta);
        if(button){button.disabled=true;button.textContent="SAVING...";}
        const db=initStaffSupabase();
        const {error}=await db.rpc("save_internal_evaluation",{
            p_evaluation_id:Number(internalActiveProject.id),p_class_name:meta.className,p_subject_name:meta.subjectName,
            p_evaluation_name:meta.evaluationName,p_academic_session:meta.session,p_achievement_language:meta.language,
            p_exam_full_marks:meta.examFull,p_units:payload.units,p_marks:payload.marks,p_exam_marks:payload.examMarks
        });
        if(error) throw error;
        if(!options.silent) internalShowMessage("Draft saved successfully. You can edit or export it anytime.","success");
        await loadInternalTeacherProjects(internalActiveProject.id);
        return true;
    }catch(error){
        internalShowMessage("Draft could not be saved: "+(error?.message||"Unknown error"));
        return false;
    }finally{if(button){button.disabled=false;button.textContent=oldText;}}
}
async function deleteInternalProject(){
    if(!internalActiveProject||!internalEditable()||!confirm("Delete this Internal Evaluation and all entered Marks?")) return;
    try{
        const db=initStaffSupabase();
        const {error}=await db.rpc("delete_internal_evaluation",{p_evaluation_id:Number(internalActiveProject.id)});
        if(error) throw error;
        internalActiveProject=null;
        internalShowMessage("Internal Evaluation deleted.","success");
        await loadInternalTeacherProjects();
    }catch(error){internalShowMessage("Could not delete: "+(error?.message||"Unknown error"));}
}
async function submitInternalToClassTeacher(){
    if(!internalActiveProject||!internalEditable()) return;
    if(!confirm("Submit this complete Internal Evaluation and Exam to the assigned Class Teacher?\n\nIt will lock immediately. View and Excel Export will remain available.")) return;
    const saved=await saveInternalDraft({silent:true,requireComplete:true});
    if(!saved) return;
    try{
        const db=initStaffSupabase();
        const {error}=await db.rpc("submit_internal_evaluation",{p_evaluation_id:Number(internalActiveProject.id)});
        if(error) throw error;
        internalShowMessage("Submitted to the Class Teacher. The file is now locked; View and Excel Export remain available.","success");
        await loadInternalTeacherProjects(internalActiveProject.id);
    }catch(error){internalShowMessage("Could not submit to the Class Teacher: "+(error?.message||"Unknown error"));}
}

function exportInternalSubjectExcel(project=internalActiveProject,units=internalActiveUnits,students=internalActiveStudents,unitMarks=internalUnitMarks,examMarks=internalExamMarks){
    try{
        if(!project) throw new Error("Open one Internal Evaluation first.");
        if(!window.XLSX) throw new Error("Excel export library is still loading. Try again in a moment.");
        const meta=project===internalActiveProject?internalReadMetadata():{
            className:project.class_name,subjectName:project.subject_name,evaluationName:project.evaluation_name,
            session:project.academic_session,language:project.achievement_language,examFull:Number(project.exam_full_marks)
        };
        const totalLa=units.reduce((sum,u)=>sum+(Number(u.learning_achievement_count)||0),0);
        const totalFull=totalLa*4;
        const rows=[
            ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
            ["INTERNAL EVALUATION & EXAM — SUBJECT DETAIL"],
            ["Class",meta.className,"Subject",meta.subjectName],
            ["Evaluation",meta.evaluationName,"Academic Session",meta.session],
            ["Subject Teacher",project.staff_name||loggedInStaff?.name||"", "Status",internalStatusLabel(project.status)],
            [internalAchievementLabel(meta.language),totalLa,"Internal Full Marks",totalFull,"Exam Full Marks",meta.examFull],
            [],
            ["S.N.","Student ID","Student Name",...units.map(u=>u.theme_name),`${meta.subjectName} Internal OM`,`${meta.subjectName} Exam OM`],
            ["LEARNING ACHIEVEMENTS","","",...units.map(u=>Number(u.learning_achievement_count)),totalLa,""],
            ["FULL MARKS","","",...units.map(u=>Number(u.learning_achievement_count)*4),totalFull,meta.examFull]
        ];
        students.forEach((student,index)=>{
            let total=0,complete=units.length>0;
            const values=units.map(unit=>{
                const value=internalNumeric(unitMarks.get(`${unit.client_key}|${student.studentId}`));
                if(value===null){complete=false;return "";} total+=value;return value;
            });
            const exam=internalNumeric(examMarks.get(student.studentId));
            rows.push([index+1,student.studentId,student.name,...values,complete?Number(total.toFixed(2)):"",exam===null?"":exam]);
        });
        const book=XLSX.utils.book_new(),sheet=XLSX.utils.aoa_to_sheet(rows);
        const lastCol=units.length+4;
        sheet["!cols"]=[{wch:8},{wch:15},{wch:28},...units.map(()=>({wch:22})),{wch:20},{wch:18}];
        sheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:lastCol}},{s:{r:1,c:0},e:{r:1,c:lastCol}}];
        if(students.length) sheet["!autofilter"]={ref:`A8:${XLSX.utils.encode_col(lastCol)}${rows.length}`};
        XLSX.utils.book_append_sheet(book,sheet,"Subject Detail");
        XLSX.writeFile(book,`${internalSafeFileName(meta.className)}_${internalSafeFileName(meta.subjectName)}_${internalSafeFileName(meta.evaluationName)}.xlsx`,{compression:true});
    }catch(error){internalShowMessage("Excel could not be exported: "+(error?.message||"Unknown error"));}
}

document.addEventListener("DOMContentLoaded",()=>{
    internalPopulateClassSelect(document.getElementById("internalCreateClass"));
    internalPopulateClassSelect(document.getElementById("internalEditClass"));
    document.getElementById("internalEditLanguage")?.addEventListener("change",internalLanguageChanged);
    document.getElementById("internalEvaluationPopup")?.addEventListener("click",event=>{if(event.target?.id==="internalEvaluationPopup") closeInternalEvaluationHub();});
});

/* ===== SOURCE SCRIPT BLOCK: internal-evaluation-routing-js ===== */
/* =========================================================
   CLASS TEACHER, PRINCIPAL, ADMIN, CONSOLIDATION AND EXCEL
========================================================= */
const internalRoleGroups={classTeacher:[],principal:[],admin:[]};
const internalSelectedBundles={classTeacher:null,principal:null,admin:null};
let internalAdminAssignments=[];

async function internalLoadEvaluationBundle(db,group){
    const rows=group?.rows||[];
    const ids=rows.map(row=>Number(row.id));
    if(!ids.length) return {group,subjects:[],students:[]};
    const [unitsResult,marksResult,examResult,students]=await Promise.all([
        db.from("internal_evaluation_units").select("id,evaluation_id,client_key,theme_name,learning_achievement_count,full_marks,display_order").in("evaluation_id",ids).order("display_order").order("id"),
        db.from("internal_evaluation_marks").select("evaluation_id,unit_id,student_id,student_name,obtained_marks").in("evaluation_id",ids),
        db.from("internal_exam_marks").select("evaluation_id,student_id,student_name,obtained_marks").in("evaluation_id",ids),
        marksFetchStudents(db,group.className)
    ]);
    if(unitsResult.error) throw unitsResult.error;
    if(marksResult.error) throw marksResult.error;
    if(examResult.error) throw examResult.error;
    const units=unitsResult.data||[],marks=marksResult.data||[],exam=examResult.data||[];
    const subjects=rows.map(project=>({
        project,
        units:units.filter(row=>String(row.evaluation_id)===String(project.id)).sort((a,b)=>Number(a.display_order)-Number(b.display_order)||Number(a.id)-Number(b.id)),
        marks:marks.filter(row=>String(row.evaluation_id)===String(project.id)),
        examMarks:exam.filter(row=>String(row.evaluation_id)===String(project.id))
    })).sort((a,b)=>internalSubjectRank(a.project.subject_name)-internalSubjectRank(b.project.subject_name)||String(a.project.subject_name).localeCompare(String(b.project.subject_name),undefined,{sensitivity:"base"}));
    return {group,subjects,students:students||[]};
}
function internalSubjectRank(name){
    const value=String(name||"").trim().toLowerCase();
    const order=[
        ["nepali","नेपाली"],["english","अंग्रेजी"],["math","mathematics","गणित"],
        ["science","विज्ञान"],["social","सामाजिक"],["computer","कम्प्युटर"],
        ["health","स्वास्थ्य"],["g.k","general knowledge","सामान्य ज्ञान"],
        ["moral","नैतिक"],["drawing","art","कला"]
    ];
    const index=order.findIndex(words=>words.some(word=>value===word||value.includes(word)));
    return index<0?100:index;
}
function internalSubjectSummary(subject){
    const totalLa=subject.units.reduce((sum,row)=>sum+(Number(row.learning_achievement_count)||0),0);
    const unitIds=new Set(subject.units.map(row=>String(row.id)));
    const internalByStudent=new Map(),internalCountByStudent=new Map();
    subject.marks.forEach(row=>{
        if(!unitIds.has(String(row.unit_id))) return;
        const current=internalByStudent.get(row.student_id)||0;
        internalByStudent.set(row.student_id,current+(Number(row.obtained_marks)||0));
        internalCountByStudent.set(row.student_id,(internalCountByStudent.get(row.student_id)||0)+1);
    });
    const examByStudent=new Map(subject.examMarks.map(row=>[row.student_id,Number(row.obtained_marks)]));
    return {totalLa,totalFull:totalLa*4,internalByStudent,internalCountByStudent,examByStudent};
}
function internalRoleGroupHost(role){
    return document.getElementById(role==="classTeacher"?"internalClassTeacherGroupList":role==="principal"?"internalPrincipalGroupList":"internalAdminGroupList");
}
function internalRoleDetailHost(role){
    return document.getElementById(role==="classTeacher"?"internalClassTeacherDetail":role==="principal"?"internalPrincipalDetail":"internalAdminGroupDetail");
}
function internalRenderGroupCards(role){
    const host=internalRoleGroupHost(role),groups=internalRoleGroups[role]||[];
    if(!host) return;
    if(!groups.length){host.innerHTML='<div class="marks-empty">No Internal Evaluation Class Sheet is available.</div>';return;}
    host.innerHTML=groups.map((group,index)=>{
        const counts={};group.rows.forEach(row=>counts[row.status]=(counts[row.status]||0)+1);
        const statusText=Object.entries(counts).map(([status,count])=>`${count} ${internalStatusLabel(status)}`).join(" • ");
        const adminNote=group.rows.find(row=>row.admin_note)?.admin_note||"";
        return `<article class="internal-group-card"><h4>${escapeHtml(group.className)} — ${escapeHtml(group.evaluationName)}</h4><p>Academic Session: ${escapeHtml(group.session)}<br>Subjects: ${group.rows.length}<br>${escapeHtml(statusText)}${adminNote?`<br><strong>Admin Note:</strong> ${escapeHtml(adminNote)}`:""}</p><div class="internal-group-card-actions"><button type="button" class="internal-primary" onclick="openInternalRoleGroup('${role}',${index})">OPEN CLASS SHEET</button>${role!=="principal"?`<button type="button" class="internal-secondary" onclick="exportInternalRoleGroup('${role}',${index})">EXPORT EXCEL</button>`:""}</div></article>`;
    }).join("");
}
async function openInternalRoleGroup(role,index){
    const group=internalRoleGroups[role]?.[index],host=internalRoleDetailHost(role);
    if(!group||!host) return;
    host.innerHTML='<div class="marks-empty">Loading consolidated Class Sheet...</div>';
    try{
        const db=role==="admin"?initStudentSupabase():initStaffSupabase();
        const bundle=await internalLoadEvaluationBundle(db,group);
        internalSelectedBundles[role]={index,bundle};
        host.innerHTML=internalRenderBundleHtml(bundle,role,index);
        host.scrollIntoView({behavior:"smooth",block:"start"});
    }catch(error){host.innerHTML=`<div class="marks-empty">Could not load Class Sheet: ${escapeHtml(error?.message||"Unknown error")}</div>`;}
}
function internalRenderBundleHtml(bundle,role,index){
    const {group,subjects,students}=bundle;
    const subjectRows=subjects.map(subject=>{
        const row=subject.project,summary=internalSubjectSummary(subject);
        const notes=[row.admin_note?`Admin: ${row.admin_note}`:"",row.class_teacher_note?`Class Teacher: ${row.class_teacher_note}`:""].filter(Boolean).join(" | ");
        let actions="";
        if(role==="classTeacher"){
            if(row.status==="pending_class_teacher") actions+=`<button type="button" class="internal-success" onclick="acceptInternalSubmission(${Number(row.id)})">ACCEPT</button>`;
            if(["pending_class_teacher","accepted_by_class_teacher","returned_by_admin"].includes(row.status)) actions+=`<button type="button" class="internal-warning" onclick="returnInternalSubmission(${Number(row.id)})">RETURN TO SUBJECT TEACHER</button>`;
        }
        return `<article class="internal-submission-row"><div><strong>${escapeHtml(row.subject_name)} — ${escapeHtml(row.staff_name)}</strong><small>Staff ID: ${escapeHtml(row.staff_id)} • Total LA: ${summary.totalLa} • Internal FM: ${internalNumber(summary.totalFull)} • Exam FM: ${escapeHtml(internalNumber(row.exam_full_marks))}${notes?`<br>${escapeHtml(notes)}`:""}</small></div><div>${internalStatusHtml(row.status)}<div class="internal-submission-actions">${actions}</div></div></article>`;
    }).join("");
    const headers=subjects.map(subject=>`<th colspan="5">${escapeHtml(subject.project.subject_name)}</th>`).join("");
    const subHeaders=subjects.map(()=>"<th>LA</th><th>Internal FM</th><th>Internal OM</th><th>Exam FM</th><th>Exam OM</th>").join("");
    const summaries=subjects.map(internalSubjectSummary);
    const body=students.map((student,studentIndex)=>{
        const cells=subjects.map((subject,subjectIndex)=>{
            const summary=summaries[subjectIndex];
            const complete=summary.internalCountByStudent.get(student.studentId)===subject.units.length&&subject.units.length>0;
            const internalOm=complete?internalNumber(summary.internalByStudent.get(student.studentId)||0):"—";
            const examOm=summary.examByStudent.has(student.studentId)?internalNumber(summary.examByStudent.get(student.studentId)):"—";
            return `<td>${summary.totalLa}</td><td>${internalNumber(summary.totalFull)}</td><td>${escapeHtml(internalOm)}</td><td>${escapeHtml(internalNumber(subject.project.exam_full_marks))}</td><td>${escapeHtml(examOm)}</td>`;
        }).join("");
        return `<tr><td>${studentIndex+1}</td><td>${escapeHtml(student.studentId)}</td><td class="student-name">${escapeHtml(student.name)}</td>${cells}</tr>`;
    }).join("");
    let groupActions="";
    if(role!=="principal") groupActions+=`<button type="button" class="internal-secondary" onclick="exportInternalRoleGroup('${role}',${index})">EXPORT CLASS EXCEL</button>`;
    if(role==="classTeacher"){
        const blocked=group.rows.some(row=>["pending_class_teacher","returned_to_subject_teacher"].includes(row.status));
        const ready=group.rows.some(row=>["accepted_by_class_teacher","returned_by_admin"].includes(row.status));
        if(ready) groupActions+=`<button type="button" class="internal-success" onclick="submitInternalGroupToAdmin(${index})" ${blocked?"disabled title=\"Accept or return every Pending Subject first\"":""}>SUBMIT CLASS TO ADMIN</button>`;
    }
    if(role==="admin"&&group.rows.some(row=>row.status==="submitted_to_admin")) groupActions+=`<button type="button" class="internal-warning" onclick="adminReturnInternalGroup(${index})">RETURN TO CLASS TEACHER</button>`;
    return `<div class="internal-card"><div class="internal-section-head"><div><h3>${escapeHtml(group.className)} — ${escapeHtml(group.evaluationName)}</h3><p class="internal-muted">Academic Session: ${escapeHtml(group.session)} • ${subjects.length} Subject(s)</p></div><div class="internal-actions" style="margin-top:0;">${groupActions}</div></div><div class="internal-submission-list">${subjectRows||'<div class="marks-empty">No Subject submission found.</div>'}</div><div class="internal-summary-wrap"><table class="internal-summary-table"><thead><tr><th rowspan="2">S.N.</th><th rowspan="2">Student ID</th><th rowspan="2">Student Name</th>${headers}</tr><tr>${subHeaders}</tr></thead><tbody>${body||'<tr><td colspan="3">No students found.</td></tr>'}</tbody></table></div></div>`;
}

async function loadInternalClassTeacherGroups(){
    const host=internalRoleGroupHost("classTeacher"),detail=internalRoleDetailHost("classTeacher");
    if(!loggedInStaff||!host) return;
    host.innerHTML='<div class="marks-empty">Loading Class Teacher submissions...</div>';
    if(detail) detail.innerHTML="";
    try{
        const db=initStaffSupabase();
        const {data,error}=await db.from("internal_evaluations")
            .select("id,created_by,staff_id,staff_name,class_name,subject_name,evaluation_name,academic_session,achievement_language,exam_full_marks,status,class_teacher_staff_id,class_teacher_name,class_teacher_note,admin_note,submitted_to_class_teacher_at,class_teacher_accepted_at,submitted_to_admin_at,returned_at,created_at,updated_at")
            .eq("class_teacher_staff_id",loggedInStaff.username)
            .neq("status","draft")
            .order("updated_at",{ascending:false});
        if(error) throw error;
        internalRoleGroups.classTeacher=internalGroupRows(data||[]);
        internalRenderGroupCards("classTeacher");
    }catch(error){host.innerHTML=`<div class="marks-empty">Could not load Class Teacher Inbox: ${escapeHtml(error?.message||"Unknown error")}</div>`;}
}
async function acceptInternalSubmission(evaluationId){
    if(!confirm("Accept this Subject submission?")) return;
    try{
        const {error}=await initStaffSupabase().rpc("accept_internal_evaluation",{p_evaluation_id:Number(evaluationId)});
        if(error) throw error;
        await loadInternalClassTeacherGroups();
        alert("Subject submission accepted. The Subject Teacher can now see Accepted status.");
    }catch(error){alert("Could not accept: "+(error?.message||"Unknown error"));}
}
async function returnInternalSubmission(evaluationId){
    const note=prompt("Write the correction note for the Subject Teacher:","Please check the entered Internal Evaluation and Exam Marks.");
    if(note===null) return;
    try{
        const {error}=await initStaffSupabase().rpc("return_internal_evaluation_to_subject",{p_evaluation_id:Number(evaluationId),p_note:note});
        if(error) throw error;
        await loadInternalClassTeacherGroups();
        alert("Returned to the Subject Teacher for correction.");
    }catch(error){alert("Could not return: "+(error?.message||"Unknown error"));}
}
async function submitInternalGroupToAdmin(index){
    const group=internalRoleGroups.classTeacher[index];
    if(!group||!confirm(`Submit the accepted ${group.className} Class Sheet to Admin?\n\nThe Principal will receive the same Sheet as Read Only.`)) return;
    try{
        const {data,error}=await initStaffSupabase().rpc("submit_internal_class_to_admin",{p_class_name:group.className,p_evaluation_name:group.evaluationName,p_academic_session:group.session});
        if(error) throw error;
        await loadInternalClassTeacherGroups();
        alert(`${data||"Accepted"} Subject submission(s) sent to Admin. Principal Read Only view is now available.`);
    }catch(error){alert("Could not submit the Class Sheet: "+(error?.message||"Unknown error"));}
}

async function loadInternalPrincipalGroups(){
    const host=internalRoleGroupHost("principal"),detail=internalRoleDetailHost("principal");
    if(!loggedInStaff||loggedInStaff.username!==INTERNAL_PRINCIPAL_STAFF_ID||!host) return;
    host.innerHTML='<div class="marks-empty">Loading submitted Class Sheets...</div>';
    if(detail) detail.innerHTML="";
    try{
        const {data,error}=await initStaffSupabase().from("internal_evaluations")
            .select("id,created_by,staff_id,staff_name,class_name,subject_name,evaluation_name,academic_session,achievement_language,exam_full_marks,status,class_teacher_staff_id,class_teacher_name,class_teacher_note,admin_note,submitted_to_class_teacher_at,class_teacher_accepted_at,submitted_to_admin_at,returned_at,created_at,updated_at")
            .order("submitted_to_admin_at",{ascending:false});
        if(error) throw error;
        internalRoleGroups.principal=internalGroupRows((data||[]).filter(row=>row.submitted_to_admin_at));
        internalRenderGroupCards("principal");
    }catch(error){host.innerHTML=`<div class="marks-empty">Could not load Principal Read Only view: ${escapeHtml(error?.message||"Unknown error")}</div>`;}
}

function internalBundleSubjectState(bundleSubject,students){
    const unitById=new Map(bundleSubject.units.map(row=>[String(row.id),row]));
    const unitMarks=new Map();
    bundleSubject.marks.forEach(row=>{
        const unit=unitById.get(String(row.unit_id));
        if(unit) unitMarks.set(`${unit.client_key}|${row.student_id}`,internalNumber(row.obtained_marks));
    });
    const examMarks=new Map(bundleSubject.examMarks.map(row=>[row.student_id,internalNumber(row.obtained_marks)]));
    return {project:bundleSubject.project,units:bundleSubject.units,students,unitMarks,examMarks};
}
function exportInternalBundleSubject(role,evaluationId){
    const selected=internalSelectedBundles[role];
    const subject=selected?.bundle?.subjects?.find(item=>String(item.project.id)===String(evaluationId));
    if(!subject){alert("Open the Class Sheet again before exporting this Subject.");return;}
    const state=internalBundleSubjectState(subject,selected.bundle.students);
    exportInternalSubjectExcel(state.project,state.units,state.students,state.unitMarks,state.examMarks);
}
async function exportInternalRoleGroup(role,index){
    try{
        if(!window.XLSX) throw new Error("Excel export library is still loading. Try again in a moment.");
        let selected=internalSelectedBundles[role];
        if(!selected||selected.index!==index){
            const group=internalRoleGroups[role]?.[index];
            if(!group) throw new Error("Class Sheet was not found.");
            const db=role==="admin"?initStudentSupabase():initStaffSupabase();
            selected={index,bundle:await internalLoadEvaluationBundle(db,group)};
            internalSelectedBundles[role]=selected;
        }
        internalExportConsolidatedWorkbook(selected.bundle);
    }catch(error){alert("Excel could not be exported: "+(error?.message||"Unknown error"));}
}
function internalExportConsolidatedWorkbook(bundle){
    const {group,subjects,students}=bundle;
    if(!subjects.length) throw new Error("No Subject submission is available.");
    const summaries=subjects.map(internalSubjectSummary);
    const summaryRows=[
        ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
        ["INTERNAL EVALUATION & EXAM — CONSOLIDATED CLASS SHEET"],
        ["Class",group.className,"Evaluation",group.evaluationName,"Academic Session",group.session],
        [],
        ["S.N.","Student ID","Student Name",...subjects.flatMap(subject=>[subject.project.subject_name,"","","",""])],
        ["","","",...subjects.flatMap(()=>["LA","Internal FM","Internal OM","Exam FM","Exam OM"])]
    ];
    students.forEach((student,index)=>{
        const cells=subjects.flatMap((subject,subjectIndex)=>{
            const summary=summaries[subjectIndex];
            const complete=summary.internalCountByStudent.get(student.studentId)===subject.units.length&&subject.units.length>0;
            const internalOm=complete?Number((summary.internalByStudent.get(student.studentId)||0).toFixed(2)):"";
            const examOm=summary.examByStudent.has(student.studentId)?summary.examByStudent.get(student.studentId):"";
            return [summary.totalLa,summary.totalFull,internalOm,Number(subject.project.exam_full_marks),examOm];
        });
        summaryRows.push([index+1,student.studentId,student.name,...cells]);
    });
    const resultRows=[
        ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
        ["RESULT COPY SHEET"],
        ["Class",group.className,"Evaluation",group.evaluationName,"Academic Session",group.session],
        [],
        ["S.N.","Student ID","Student Name",...subjects.flatMap(subject=>[`${subject.project.subject_name} Internal`,`${subject.project.subject_name} Exam`])]
    ];
    students.forEach((student,index)=>{
        const cells=subjects.flatMap((subject,subjectIndex)=>{
            const summary=summaries[subjectIndex];
            const complete=summary.internalCountByStudent.get(student.studentId)===subject.units.length&&subject.units.length>0;
            return [complete?Number((summary.internalByStudent.get(student.studentId)||0).toFixed(2)):"",summary.examByStudent.has(student.studentId)?summary.examByStudent.get(student.studentId):""];
        });
        resultRows.push([index+1,student.studentId,student.name,...cells]);
    });
    const book=XLSX.utils.book_new();
    const summarySheet=XLSX.utils.aoa_to_sheet(summaryRows),resultSheet=XLSX.utils.aoa_to_sheet(resultRows);
    const summaryLastCol=2+subjects.length*5,resultLastCol=2+subjects.length*2;
    summarySheet["!cols"]=[{wch:8},{wch:15},{wch:28},...subjects.flatMap(()=>[{wch:9},{wch:13},{wch:13},{wch:11},{wch:11}])];
    resultSheet["!cols"]=[{wch:8},{wch:15},{wch:28},...subjects.flatMap(()=>[{wch:18},{wch:16}])];
    summarySheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:summaryLastCol}},{s:{r:1,c:0},e:{r:1,c:summaryLastCol}},...subjects.map((_subject,i)=>({s:{r:4,c:3+i*5},e:{r:4,c:7+i*5}}))];
    resultSheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:resultLastCol}},{s:{r:1,c:0},e:{r:1,c:resultLastCol}}];
    if(students.length){summarySheet["!autofilter"]={ref:`A6:${XLSX.utils.encode_col(summaryLastCol)}${summaryRows.length}`};resultSheet["!autofilter"]={ref:`A5:${XLSX.utils.encode_col(resultLastCol)}${resultRows.length}`};}
    XLSX.utils.book_append_sheet(book,summarySheet,"Internal Evaluation Summary");
    XLSX.utils.book_append_sheet(book,resultSheet,"Result Copy Sheet");
    XLSX.writeFile(book,`${internalSafeFileName(group.className)}_${internalSafeFileName(group.evaluationName)}_${internalSafeFileName(group.session)}.xlsx`,{compression:true});
}

async function renderAdminInternalEvaluations(){
    if(!studentAdminSession?.access_token){openStudentAdminLogin();return;}
    internalPopulateClassSelect(document.getElementById("internalAdminAssignmentClass"));
    const staffSelect=document.getElementById("internalAdminAssignmentStaff");
    if(staffSelect){
        const rows=Object.entries(STAFF_LOGIN_DIRECTORY).filter(([,staff])=>/teacher|principal/i.test(staff.designation||"")).sort((a,b)=>a[1].name.localeCompare(b[1].name));
        staffSelect.innerHTML=rows.map(([id,staff])=>`<option value="${escapeHtml(id)}">${escapeHtml(staff.name)} — ${escapeHtml(id)}</option>`).join("");
    }
    await Promise.all([loadInternalAdminAssignments(),loadInternalAdminGroups()]);
}
async function loadInternalAdminAssignments(){
    const host=document.getElementById("internalAdminAssignmentList");
    if(host) host.innerHTML='<div class="review-empty">Loading Class Teacher assignments...</div>';
    try{
        const {data,error}=await initStudentSupabase().rpc("admin_list_internal_class_teacher_assignments");
        if(error) throw error;
        internalAdminAssignments=data||[];
        if(!host) return;
        if(!internalAdminAssignments.length){host.innerHTML='<div class="review-empty">No Class Teacher is assigned.</div>';return;}
        host.innerHTML=[...internalAdminAssignments].sort((a,b)=>INTERNAL_CLASS_ORDER.indexOf(a.class_name)-INTERNAL_CLASS_ORDER.indexOf(b.class_name)).map(row=>`<div class="internal-assignment-row"><strong>${escapeHtml(row.class_name)}</strong><span>${escapeHtml(row.staff_name)} • Staff ID: ${escapeHtml(row.staff_id)}</span><button type="button" class="internal-danger" onclick="removeInternalClassTeacherAssignment('${escapeHtml(row.class_name)}')">REMOVE</button></div>`).join("");
    }catch(error){if(host) host.innerHTML=`<div class="review-empty">Could not load assignments: ${escapeHtml(error?.message||"Unknown error")}</div>`;}
}
async function saveInternalClassTeacherAssignment(event){
    event.preventDefault();
    if(!studentAdminSession?.access_token) return;
    const className=document.getElementById("internalAdminAssignmentClass")?.value||"";
    const staffId=document.getElementById("internalAdminAssignmentStaff")?.value||"";
    const staff=STAFF_LOGIN_DIRECTORY[staffId];
    if(!className||!staff) return;
    try{
        const {error}=await initStudentSupabase().rpc("admin_set_internal_class_teacher",{p_class_name:className,p_staff_id:staffId,p_staff_name:staff.name});
        if(error) throw error;
        await loadInternalAdminAssignments();
        alert(`${staff.name} assigned as Class Teacher of ${className}.`);
    }catch(error){alert("Assignment could not be saved: "+(error?.message||"Unknown error"));}
}
async function removeInternalClassTeacherAssignment(className){
    if(!studentAdminSession?.access_token||!confirm(`Remove the Class Teacher assignment for ${className}?\n\nExisting Evaluation records are not deleted, but new routing will stop until another Class Teacher is assigned.`)) return;
    try{
        const {error}=await initStudentSupabase().rpc("admin_remove_internal_class_teacher",{p_class_name:className});
        if(error) throw error;
        await loadInternalAdminAssignments();
    }catch(error){alert("Assignment could not be removed: "+(error?.message||"Unknown error"));}
}
async function loadInternalAdminGroups(){
    const host=internalRoleGroupHost("admin"),detail=internalRoleDetailHost("admin");
    if(!studentAdminSession?.access_token||!host) return;
    host.innerHTML='<div class="review-empty">Loading Class Sheets...</div>';
    if(detail) detail.innerHTML="";
    try{
        const {data,error}=await initStudentSupabase().from("internal_evaluations")
            .select("id,created_by,staff_id,staff_name,class_name,subject_name,evaluation_name,academic_session,achievement_language,exam_full_marks,status,class_teacher_staff_id,class_teacher_name,class_teacher_note,admin_note,submitted_to_class_teacher_at,class_teacher_accepted_at,submitted_to_admin_at,returned_at,created_at,updated_at")
            .order("updated_at",{ascending:false});
        if(error) throw error;
        internalRoleGroups.admin=internalGroupRows(data||[]).filter(group=>group.rows.some(row=>["submitted_to_admin","returned_by_admin","returned_to_subject_teacher","accepted_by_class_teacher","pending_class_teacher"].includes(row.status)&&row.submitted_to_admin_at));
        internalRenderGroupCards("admin");
    }catch(error){host.innerHTML=`<div class="review-empty">Could not load Admin Class Sheets: ${escapeHtml(error?.message||"Unknown error")}</div>`;}
}
async function adminReturnInternalGroup(index){
    const group=internalRoleGroups.admin[index];
    if(!group) return;
    const note=prompt("Write the problem/correction note for the Class Teacher:","Please check this Class Sheet and return the affected Subject to the Subject Teacher.");
    if(note===null) return;
    try{
        const {data,error}=await initStudentSupabase().rpc("admin_return_internal_class",{p_class_name:group.className,p_evaluation_name:group.evaluationName,p_academic_session:group.session,p_note:note});
        if(error) throw error;
        await loadInternalAdminGroups();
        alert(`${data||"Class"} Subject submission(s) returned to the Class Teacher.`);
    }catch(error){alert("Class Sheet could not be returned: "+(error?.message||"Unknown error"));}
}

/* Add the new Admin tab without disturbing any existing Admin feature. */
const internalOriginalShowWebsiteAdminTab=showWebsiteAdminTab;
showWebsiteAdminTab=function(tab){
    internalOriginalShowWebsiteAdminTab(tab);
    const internalTab=document.getElementById("websiteAdminInternalEvaluationsTab");
    if(internalTab) internalTab.style.display=tab==="internalEvaluations"?"block":"none";
    if(tab==="internalEvaluations") renderAdminInternalEvaluations();
};

/* Old Marks Entry stays Class 6–10 only. New Internal Evaluation is N–10. */
const internalOriginalRenderAdminMarksAssignmentList=renderAdminMarksAssignmentList;
renderAdminMarksAssignmentList=function(){
    const all=marksAdminAssignments;
    marksAdminAssignments=(all||[]).filter(row=>MARKS_UPPER_CLASSES_FINAL.includes(row.class_name));
    internalOriginalRenderAdminMarksAssignmentList();
    marksAdminAssignments=all;
};
const internalOriginalRenderAdminMarks=renderAdminMarks;
renderAdminMarks=async function(){
    await internalOriginalRenderAdminMarks();
    marksFinalPopulateUpperSelect(document.getElementById("marksAdminAssignmentClass"));
    marksFinalPopulateUpperSelect(document.getElementById("marksAdminClassFilter"));
};
async function internalUpdateOldMarksButtonVisibility(){
    const button=document.getElementById("staffDashboardMarksAction");
    if(!button||!loggedInStaff) return;
    if(loggedInStaff.username===INTERNAL_PRINCIPAL_STAFF_ID){button.style.display="block";return;}
    button.style.display="none";
    try{
        const {data,error}=await initStaffSupabase().from("marks_teacher_assignments").select("class_name").eq("staff_id",loggedInStaff.username).in("class_name",MARKS_UPPER_CLASSES_FINAL);
        if(error) throw error;
        button.style.display=data?.length?"block":"none";
    }catch(error){console.error("Marks Entry visibility error:",error);}
}
const internalOriginalOpenStaffDashboard=openStaffDashboard;
openStaffDashboard=async function(){
    const marksButton=document.getElementById("staffDashboardMarksAction");
    const internalButton=document.getElementById("staffDashboardInternalEvaluationAction");
    if(marksButton&&loggedInStaff?.username!==INTERNAL_PRINCIPAL_STAFF_ID) marksButton.style.display="none";
    if(internalButton) internalButton.style.display=loggedInStaff?"block":"none";
    await internalOriginalOpenStaffDashboard();
    if(internalButton) internalButton.style.display=loggedInStaff?"block":"none";
    await internalUpdateOldMarksButtonVisibility();
};
const internalOriginalStaffLogout=staffLogout;
staffLogout=async function(){
    closeInternalEvaluationHub();
    internalTeacherProjects=[];internalActiveProject=null;internalActiveUnits=[];internalActiveStudents=[];
    internalUnitMarks=new Map();internalExamMarks=new Map();internalMyClassAssignments=[];
    await internalOriginalStaffLogout();
};

/* ===== SOURCE SCRIPT BLOCK: unified-marks-entry-final-js ===== */
/* =========================================================
   FINAL UNIFIED MARKS ENTRY
   Visible replacement for both earlier Marks / Evaluation interfaces.
========================================================= */
const UME_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
const UME_LOWER_CLASSES=new Set(["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5"]);
const UME_UPPER_CLASSES=["Class 6","Class 7","Class 8","Class 9","Class 10"];
const UME_ALL_CLASSES_FILTER="All Classes";
const UME_PRINCIPAL_ID="joseph";
let umeMyProjects=[];
let umeActiveBundle=null;
let umeMyClassAssignments=[];
let umeClassTeacherRows=[];
let umePrincipalRows=[];
let umeAdminRows=[];
let umeTeacherRosterRows=[];
let umeAdminUpperStudents=[];
let umeAdminUpperStudentsLoaded=false;
let umeAdminUpperStudentsLoading=false;
let umeAdminClassTeachers=[];
let umeAdminShellReady=false;
const umePackageClassFilter={principal:UME_ALL_CLASSES_FILTER,admin:UME_ALL_CLASSES_FILTER};
const umeSelectedGroups={classTeacher:null,principal:null,admin:null};

function umeEscape(value){return typeof escapeHtml==="function"?escapeHtml(String(value??"")):String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function umeNumber(value){if(value===null||value===undefined||value==="") return "";const n=Number(value);return Number.isFinite(n)?(Number.isInteger(n)?n:Number(n.toFixed(2))):"";}
function umeDate(value){if(!value)return "—";try{return new Date(value).toLocaleString();}catch(_error){return String(value);}}
function umeSafeFile(value){return String(value||"Marks").replace(/[\\/:*?"<>|]+/g," ").replace(/\s+/g,"_").slice(0,80);}
function umeProjectEditable(project=umeActiveBundle?.project){return !!project&&["draft","returned_to_subject_teacher"].includes(project.status);}
function umeStatusLabel(status){return ({draft:"Draft",submitted_to_class_teacher:"Pending Class Teacher",accepted_by_class_teacher:"Accepted by Class Teacher",submitted_to_admin:"Submitted to Admin",returned_by_admin:"Returned by Admin",returned_to_subject_teacher:"Returned to Subject Teacher"})[status]||status||"Unknown";}
function umeStatusClass(status){if(status==="draft")return "draft";if(status==="submitted_to_class_teacher")return "pending";if(status==="accepted_by_class_teacher")return "accepted";if(status==="submitted_to_admin")return "admin";return "returned";}
function umeStatusHtml(status){return `<span class="ume-status ${umeStatusClass(status)}">${umeEscape(umeStatusLabel(status))}</span>`;}
function umeShowMessage(message,type="error"){
  const box=document.getElementById("umeTeacherMessage");if(!box)return;
  box.textContent=message;box.className=`ume-message show ${type}`;
}
function umeClearMessage(){const box=document.getElementById("umeTeacherMessage");if(box){box.textContent="";box.className="ume-message";}}
function umeStaffDb(){const db=initStaffSupabase();if(!db)throw new Error("Supabase connection is unavailable.");return db;}
function umeAdminDb(){const db=initStudentSupabase();if(!db)throw new Error("Supabase connection is unavailable.");return db;}
async function umeRpc(db,name,args={}){const {data,error}=await db.rpc(name,args);if(error)throw error;return data;}
function umeFillClassSelect(select){if(!select)return;const current=select.value;select.innerHTML=UME_CLASSES.map(c=>`<option value="${umeEscape(c)}">${umeEscape(c)}</option>`).join("");if(UME_CLASSES.includes(current))select.value=current;}

async function openUnifiedMarksEntry(preferredTab="teacher"){
  if(!loggedInStaff||!staffAuthSession?.user?.id){openStaffLogin();return;}
  closeStaffDashboard();
  const popup=document.getElementById("umeStaffPopup");if(popup)popup.style.display="block";
  document.body.style.overflow="hidden";
  umeFillClassSelect(document.getElementById("umeCreateClass"));
  document.getElementById("umeIdentity").innerHTML=`<span>👩‍🏫 ${umeEscape(loggedInStaff.name)}</span><span>Staff ID: ${umeEscape(loggedInStaff.username)}</span>`;
  document.getElementById("umePrincipalTabBtn").style.display=loggedInStaff.username===UME_PRINCIPAL_ID?"block":"none";
  try{
    umeMyClassAssignments=await umeRpc(umeStaffDb(),"ume_get_my_class_teacher_assignments");
    document.getElementById("umeClassTeacherTabBtn").style.display=umeMyClassAssignments.length?"block":"none";
  }catch(error){umeMyClassAssignments=[];console.error("Class Teacher assignment load:",error);}
  await umeConfigureClassTeacherRoster();
  if(preferredTab==="principal"&&loggedInStaff.username!==UME_PRINCIPAL_ID)preferredTab="teacher";
  if(preferredTab==="classTeacher"&&!umeMyClassAssignments.length)preferredTab="teacher";
  await umeShowStaffTab(preferredTab);
}
function closeUnifiedMarksEntry(){const popup=document.getElementById("umeStaffPopup");if(popup)popup.style.display="none";document.body.style.overflow="auto";}
async function umeShowStaffTab(tab){
  ["teacher","classTeacher","principal"].forEach(name=>{
    document.getElementById(`ume${name[0].toUpperCase()+name.slice(1)}Panel`)?.classList.toggle("active",name===tab);
    document.getElementById(`ume${name[0].toUpperCase()+name.slice(1)}TabBtn`)?.classList.toggle("active",name===tab);
  });
  if(tab==="teacher")await umeLoadMyProjects();
  if(tab==="classTeacher")await umeLoadClassTeacherInbox();
  if(tab==="principal")await umeLoadPrincipalPackages();
}

async function umeConfigureClassTeacherRoster(){
  const card=document.getElementById("umeClassRosterCard"),select=document.getElementById("umeTeacherRosterClass");
  const assigned=umeMyClassAssignments.map(row=>row.class_name).filter(name=>UME_UPPER_CLASSES.includes(name));
  if(!card||!select)return;
  card.style.display=assigned.length?"block":"none";
  if(!assigned.length)return;
  const current=select.value;
  select.innerHTML=assigned.map(name=>`<option value="${umeEscape(name)}">${umeEscape(name)}</option>`).join("");
  if(assigned.includes(current))select.value=current;
  await umeLoadClassTeacherRoster();
}
async function umeLoadClassTeacherRoster(){
  const host=document.getElementById("umeTeacherRosterList"),className=document.getElementById("umeTeacherRosterClass")?.value||"";
  if(!host||!className)return;
  host.innerHTML='<div class="ume-empty">Loading students...</div>';
  try{
    umeTeacherRosterRows=await umeRpc(umeStaffDb(),"ume_list_upper_students");
    const rows=umeTeacherRosterRows.filter(row=>row.class_name===className).sort((a,b)=>String(a.name||a.student_name||"").localeCompare(String(b.name||b.student_name||""),undefined,{sensitivity:"base"})||String(a.student_id).localeCompare(String(b.student_id),undefined,{numeric:true,sensitivity:"base"}));
    host.className="ume-roster-grid";
    host.innerHTML=rows.length?rows.map((row,index)=>`<div class="ume-roster-card"><div class="ume-roster-sn">${index+1}</div><div class="ume-roster-info"><div class="ume-roster-name">${umeEscape(row.name)}</div><div class="ume-roster-id">Student ID: ${umeEscape(row.student_id)}</div></div></div>`).join(""):'<div class="ume-empty" style="grid-column:1/-1;">No students have been added to this Class yet.</div>';
  }catch(error){host.innerHTML=`<div class="ume-empty">Could not load students: ${umeEscape(error.message||"Unknown error")}</div>`;}
}
async function umeAddClassTeacherStudent(event){
  event.preventDefault();
  const className=document.getElementById("umeTeacherRosterClass")?.value||"";
  const studentId=String(document.getElementById("umeTeacherRosterId")?.value||"").trim().toUpperCase();
  const name=String(document.getElementById("umeTeacherRosterName")?.value||"").trim().toUpperCase();
  const button=document.getElementById("umeTeacherRosterAddBtn"),old=button?.textContent||"ADD STUDENT";
  if(!UME_UPPER_CLASSES.includes(className))return;
  if(!/^[A-Z0-9-]{2,24}$/.test(studentId)){alert("Student ID may contain only 2–24 letters, numbers or hyphens.");return;}
  if(!name){alert("Enter the Student Name.");return;}
  if(button){button.disabled=true;button.textContent="ADDING...";}
  try{
    await umeRpc(umeStaffDb(),"ume_add_upper_student",{p_class_name:className,p_student_id:studentId,p_name:name});
    document.getElementById("umeTeacherRosterId").value="";document.getElementById("umeTeacherRosterName").value="";
    await umeLoadClassTeacherRoster();
    if(umeActiveBundle?.project?.class_name===className)await umeLoadProject(umeActiveBundle.project.id);
    alert(`${name} added to ${className}.`);
  }catch(error){alert("Student could not be added: "+(error.message||"Unknown error"));}
  finally{if(button){button.disabled=false;button.textContent=old;}}
}

async function umeCreateProject(event){
  event.preventDefault();
  const button=document.getElementById("umeCreateBtn");const old=button.textContent;
  const args={
    p_class_name:document.getElementById("umeCreateClass").value,
    p_subject_name:document.getElementById("umeCreateSubject").value.trim(),
    p_term_name:document.getElementById("umeCreateTerm").value.trim(),
    p_academic_session:document.getElementById("umeCreateSession").value.trim(),
    p_staff_name:loggedInStaff.name
  };
  if(!args.p_subject_name||!args.p_term_name||!args.p_academic_session)return;
  button.disabled=true;button.textContent="CREATING...";
  try{
    const id=await umeRpc(umeStaffDb(),"ume_create_project",args);
    document.getElementById("umeCreateSubject").value="";
    await umeLoadMyProjects(id);
    umeShowMessage("Subject Marks file created successfully.","success");
  }catch(error){alert("Could not create Subject Marks: "+(error.message||"Unknown error"));}
  finally{button.disabled=false;button.textContent=old;}
}

async function umeLoadMyProjects(preferredId=""){
  const select=document.getElementById("umeProjectSelect"),empty=document.getElementById("umeTeacherEmpty"),workspace=document.getElementById("umeTeacherWorkspace");
  try{
    umeMyProjects=await umeRpc(umeStaffDb(),"ume_list_my_projects");
    if(!umeMyProjects.length){select.innerHTML="";empty.style.display="block";workspace.style.display="none";umeActiveBundle=null;return;}
    empty.style.display="none";workspace.style.display="block";
    select.innerHTML=umeMyProjects.map(p=>`<option value="${Number(p.id)}">${umeEscape(p.class_name)} • ${umeEscape(p.subject_name)} • ${umeEscape(p.term_name)} • ${umeEscape(umeStatusLabel(p.status))}</option>`).join("");
    const wanted=String(preferredId||umeActiveBundle?.project?.id||umeMyProjects[0].id);
    if(umeMyProjects.some(p=>String(p.id)===wanted))select.value=wanted;
    await umeLoadProject(select.value);
  }catch(error){empty.style.display="block";workspace.style.display="none";empty.textContent="Marks Entry database is not ready. Run the supplied final SQL first. "+(error.message||"");}
}

async function umeLoadProject(projectId){
  if(!projectId)return;
  umeClearMessage();
  try{umeActiveBundle=await umeRpc(umeStaffDb(),"ume_get_project_bundle",{p_project_id:Number(projectId)});umeRenderTeacherProject();}
  catch(error){umeShowMessage("Could not load this Marks file: "+(error.message||"Unknown error"));}
}

function umeRenderTeacherProject(){
  const bundle=umeActiveBundle;if(!bundle)return;
  const p=bundle.project,editable=umeProjectEditable(p),lower=UME_LOWER_CLASSES.has(p.class_name);
  document.getElementById("umeProjectSummary").innerHTML=`
    <div>Class<strong>${umeEscape(p.class_name)}</strong></div><div>Subject<strong>${umeEscape(p.subject_name)}</strong></div>
    <div>Term<strong>${umeEscape(p.term_name)}</strong></div><div>Session<strong>${umeEscape(p.academic_session)}</strong></div>
    <div>Class Teacher<strong>${umeEscape(p.class_teacher_name||"Assigned on submission")}</strong></div><div>Status<strong>${umeStatusHtml(p.status)}</strong></div>`;
  let notes="";
  if(p.admin_note)notes+=`<div class="ume-note"><strong>Admin Return Note:</strong><br>${umeEscape(p.admin_note)}</div>`;
  if(p.class_teacher_note)notes+=`<div class="ume-note"><strong>Class Teacher Note:</strong><br>${umeEscape(p.class_teacher_note)}</div>`;
  document.getElementById("umeProjectNotes").innerHTML=notes;
  document.getElementById("umeUpperComponentCard").style.display=!lower&&editable?"block":"none";
  document.getElementById("umeComponentHeading").textContent=lower?`${p.subject_name}: Evaluation and Exam Full Marks`:`${p.subject_name}: Components and Common Full Marks`;
  document.getElementById("umeComponentList").innerHTML=bundle.components.length?bundle.components.map(c=>`
    <div class="ume-component"><strong>${umeEscape(p.subject_name)} — ${umeEscape(c.component_name)}</strong>
      <div class="ume-component-controls"><input class="ume-full-marks" data-component-id="${Number(c.id)}" type="number" min="0" max="1200" step="0.01" value="${umeEscape(umeNumber(c.full_marks))}" oninput="umeHandleFullMarksInput(this)" ${editable?"":"disabled"} aria-label="Full Marks for ${umeEscape(c.component_name)}">
      ${!lower&&editable?`<button type="button" class="ume-btn ume-danger" onclick="umeDeleteComponent(${Number(c.id)})">DELETE</button>`:""}</div>
    </div>`).join(""):'<div class="ume-empty">Add the first Component to open the Marks table.</div>';
  umeRenderTeacherMarksTable();
  document.getElementById("umeTeacherActions").innerHTML=`
    <button type="button" class="ume-btn ume-secondary" onclick="umeExportActiveSubject()">EXPORT SUBJECT EXCEL</button>
    ${editable?`<button type="button" class="ume-btn ume-primary" onclick="umeSaveDraft(true)">SAVE DRAFT</button><button type="button" class="ume-btn ume-success" onclick="umeSubmitProject()">SUBMIT TO CLASS TEACHER</button><button type="button" class="ume-btn ume-danger" onclick="umeDeleteProject()">DELETE</button>`:""}`;
}

function umeEntryMap(bundle){return new Map((bundle.entries||[]).map(e=>[`${e.component_id}|${e.student_id}`,e]));}
function umeEntryIsAbsent(entry){return entry?.is_absent===true||entry?.is_absent==="true";}
function umeValidateObtainedInput(input){
  if(!input)return true;
  const cell=input.closest(".ume-mark-cell"),absent=cell?.querySelector(".ume-absent")?.checked;
  if(absent){input.classList.remove("ume-invalid");return true;}
  const raw=input.value.trim(),value=Number(raw),fullInput=document.querySelector(`#umeComponentList .ume-full-marks[data-component-id="${input.dataset.componentId}"]`);
  const full=Number(fullInput?.value??input.max);
  input.max=Number.isFinite(full)?String(full):"";
  const valid=raw===""||(Number.isFinite(value)&&Number.isFinite(full)&&value>=0&&value<=full);
  input.classList.toggle("ume-invalid",!valid);
  return valid;
}
function umeToggleAbsent(checkbox){
  const cell=checkbox?.closest(".ume-mark-cell"),input=cell?.querySelector(".ume-obtained");if(!cell||!input)return;
  cell.classList.toggle("is-absent",checkbox.checked);
  if(checkbox.checked){input.value="";input.disabled=true;input.classList.remove("ume-invalid");}
  else{input.disabled=!umeProjectEditable();umeValidateObtainedInput(input);if(!input.disabled)input.focus();}
}
function umeHandleFullMarksInput(input){
  const value=Number(input.value),valid=input.value.trim()!==""&&Number.isFinite(value)&&value>=0&&value<=1200;
  input.classList.toggle("ume-invalid",!valid);
  document.querySelectorAll(`#umeMarksTableHost .ume-obtained[data-component-id="${input.dataset.componentId}"]`).forEach(mark=>umeValidateObtainedInput(mark));
}
function umeRenderTeacherMarksTable(){
  const host=document.getElementById("umeMarksTableHost"),bundle=umeActiveBundle;if(!bundle)return;
  const editable=umeProjectEditable(bundle.project),components=bundle.components||[],students=[...(bundle.students||[])].sort((a,b)=>String(a.student_name||a.name||"").localeCompare(String(b.student_name||b.name||""),undefined,{sensitivity:"base"})||String(a.student_id||"").localeCompare(String(b.student_id||""),undefined,{numeric:true,sensitivity:"base"}));
  if(!students.length){host.innerHTML='<div class="ume-card"><div class="ume-empty">No students were found in this Class roster.</div></div>';return;}
  if(!components.length){host.innerHTML="";return;}
  const map=umeEntryMap(bundle);
  const headers=components.map(c=>`<th>${umeEscape(c.component_name)} OM<br><small>Full Marks: ${umeEscape(umeNumber(c.full_marks))}</small></th>`).join("");
  const body=students.map((s,index)=>`<tr><td>${index+1}</td><td>${umeEscape(s.student_id)}</td><td class="ume-student">${umeEscape(s.student_name)}</td>${components.map(c=>{
    const entry=map.get(`${c.id}|${s.student_id}`),absent=umeEntryIsAbsent(entry);return `<td><div class="ume-mark-cell ${absent?"is-absent":""}"><input class="ume-obtained" data-component-id="${Number(c.id)}" data-student-id="${umeEscape(s.student_id)}" data-student-name="${umeEscape(s.student_name)}" type="number" min="0" max="${umeEscape(umeNumber(c.full_marks))}" step="0.01" value="${absent?"":umeEscape(umeNumber(entry?.obtained_marks))}" oninput="umeValidateObtainedInput(this)" ${editable&&!absent?"":"disabled"}><span class="ume-abs-badge">ABS</span><label class="ume-absent-label"><input class="ume-absent" type="checkbox" onchange="umeToggleAbsent(this)" ${absent?"checked":""} ${editable?"":"disabled"}> ABSENT</label></div></td>`;
  }).join("")}</tr>`).join("");
  host.innerHTML=`<div class="ume-card"><h4>${umeEscape(bundle.project.subject_name)} — Student Obtained Marks</h4><div class="ume-table-wrap"><table class="ume-table"><thead><tr><th>Roll No.</th><th>Student ID</th><th>Student Name</th>${headers}</tr></thead><tbody>${body}</tbody></table></div></div>`;
}

async function umeAddComponent(event){
  event.preventDefault();if(!umeActiveBundle||!umeProjectEditable())return;
  const name=document.getElementById("umeComponentName").value.trim(),full=Number(document.getElementById("umeComponentFull").value);
  if(!name||!Number.isFinite(full)||full<0)return;
  try{await umeRpc(umeStaffDb(),"ume_add_component",{p_project_id:Number(umeActiveBundle.project.id),p_component_name:name,p_full_marks:full});document.getElementById("umeComponentName").value="";document.getElementById("umeComponentFull").value="";await umeLoadProject(umeActiveBundle.project.id);umeShowMessage("Component added.","success");}
  catch(error){alert("Could not add Component: "+(error.message||"Unknown error"));}
}
async function umeDeleteComponent(id){
  if(!confirm("Delete this Component and all Marks entered under it?"))return;
  try{await umeRpc(umeStaffDb(),"ume_delete_component",{p_component_id:Number(id)});await umeLoadProject(umeActiveBundle.project.id);umeShowMessage("Component deleted.","success");}
  catch(error){alert("Could not delete Component: "+(error.message||"Unknown error"));}
}

function umeCollectTeacherData(){
  const fullInputs=[...document.querySelectorAll("#umeComponentList .ume-full-marks")];
  const components=fullInputs.map(input=>({component_id:Number(input.dataset.componentId),full_marks:Number(input.value)}));
  const fullById=new Map(components.map(c=>[String(c.component_id),c.full_marks]));
  for(const input of fullInputs)umeHandleFullMarksInput(input);
  if(fullInputs.some(input=>input.classList.contains("ume-invalid")))throw new Error("Correct the red Full Marks box before saving.");
  for(const c of components)if(!Number.isFinite(c.full_marks)||c.full_marks<0||c.full_marks>1200)throw new Error("Correct the red Full Marks box before saving.");
  const entries=[];
  for(const input of document.querySelectorAll("#umeMarksTableHost .ume-obtained")){
    const cell=input.closest(".ume-mark-cell"),isAbsent=!!cell?.querySelector(".ume-absent")?.checked;
    if(isAbsent){entries.push({component_id:Number(input.dataset.componentId),student_id:input.dataset.studentId,student_name:input.dataset.studentName,obtained_marks:null,is_absent:true});continue;}
    const raw=input.value.trim();if(raw==="")continue;
    const value=Number(raw),full=fullById.get(String(input.dataset.componentId));
    if(!umeValidateObtainedInput(input)||!Number.isFinite(value)||value<0||value>full)throw new Error(`Correct the red Marks box for ${input.dataset.studentName}.`);
    entries.push({component_id:Number(input.dataset.componentId),student_id:input.dataset.studentId,student_name:input.dataset.studentName,obtained_marks:value,is_absent:false});
  }
  return {components,entries};
}
async function umeSaveDraft(showSuccess=false){
  if(!umeActiveBundle||!umeProjectEditable())return false;
  try{
    const payload=umeCollectTeacherData();
    await umeRpc(umeStaffDb(),"ume_save_project",{p_project_id:Number(umeActiveBundle.project.id),p_components:payload.components,p_entries:payload.entries});
    const id=umeActiveBundle.project.id;await umeLoadProject(id);if(showSuccess)umeShowMessage("Draft saved successfully.","success");return true;
  }catch(error){umeShowMessage("Could not save Draft: "+(error.message||"Unknown error"));return false;}
}
async function umeSubmitProject(){
  if(!umeActiveBundle||!umeProjectEditable())return;
  if(!confirm("Submit this complete Subject Marks file to the assigned Class Teacher?\n\nIt will lock immediately. Excel Export will remain available."))return;
  if(!await umeSaveDraft(false))return;
  try{const id=umeActiveBundle.project.id;await umeRpc(umeStaffDb(),"ume_submit_to_class_teacher",{p_project_id:Number(id)});await umeLoadMyProjects(id);alert("Submitted to the Class Teacher successfully. The file is now locked.");}
  catch(error){umeShowMessage("Could not submit: "+(error.message||"Unknown error"));}
}
async function umeDeleteProject(){
  if(!umeActiveBundle||!confirm("Delete this Subject Marks file and all entered Marks permanently?"))return;
  try{await umeRpc(umeStaffDb(),"ume_delete_my_project",{p_project_id:Number(umeActiveBundle.project.id)});umeActiveBundle=null;await umeLoadMyProjects();alert("Marks file deleted.");}
  catch(error){alert("Could not delete Marks file: "+(error.message||"Unknown error"));}
}

function umeGroupRows(rows){
  const map=new Map();
  for(const row of rows||[]){const key=[row.class_name,String(row.academic_session).trim().toLowerCase(),String(row.term_name).trim().toLowerCase()].join("|");if(!map.has(key))map.set(key,{key,className:row.class_name,session:row.academic_session,term:row.term_name,rows:[]});map.get(key).rows.push(row);}
  return [...map.values()].sort((a,b)=>{const timeB=Math.max(...b.rows.map(r=>new Date(r.updated_at).getTime()||0)),timeA=Math.max(...a.rows.map(r=>new Date(r.updated_at).getTime()||0));return timeB-timeA||UME_CLASSES.indexOf(a.className)-UME_CLASSES.indexOf(b.className);});
}
function umeSubjectRank(name){const n=String(name||"").trim().toLowerCase();const order=["नेपाली","nepali","english","अंग्रेजी","mathematics","math","गणित","science","विज्ञान","social studies","social","computer","health","moral","g.k.","gk"];const i=order.indexOf(n);return i<0?100:i;}
function umeSortSubjectRows(rows){return [...rows].sort((a,b)=>umeSubjectRank(a.subject_name)-umeSubjectRank(b.subject_name)||String(a.subject_name).localeCompare(String(b.subject_name),undefined,{numeric:true,sensitivity:"base"}));}

async function umeLoadClassTeacherInbox(){
  const host=document.getElementById("umeClassTeacherGroups"),detail=document.getElementById("umeClassTeacherDetail");host.innerHTML='<div class="ume-empty">Loading submissions...</div>';detail.innerHTML="";
  try{umeClassTeacherRows=await umeRpc(umeStaffDb(),"ume_list_class_teacher_projects");umeRenderGroupCards("classTeacher",umeGroupRows(umeClassTeacherRows),host);}
  catch(error){host.innerHTML=`<div class="ume-empty">Could not load Class Teacher Inbox: ${umeEscape(error.message||"Unknown error")}</div>`;}
}
async function umeLoadPrincipalPackages(){
  const host=document.getElementById("umePrincipalGroups"),detail=document.getElementById("umePrincipalDetail");host.innerHTML='<div class="ume-empty">Loading submitted packages...</div>';detail.innerHTML="";
  try{umePrincipalRows=await umeRpc(umeStaffDb(),"ume_list_final_projects");umeRenderPackageClassFilter("principal");umeRenderGroupCards("principal",umeRoleGroups("principal"),host);}
  catch(error){host.innerHTML=`<div class="ume-empty">Could not load Principal view: ${umeEscape(error.message||"Unknown error")}</div>`;}
}

function umePackageRoleRows(role){return role==="principal"?umePrincipalRows:role==="admin"?umeAdminRows:umeClassTeacherRows;}
function umeRenderPackageClassFilter(role){
  const host=document.getElementById(role==="principal"?"umePrincipalClassFilter":"umeAdminClassFilter");if(!host)return;
  const groups=umeGroupRows(umePackageRoleRows(role)),selected=umePackageClassFilter[role]||UME_ALL_CLASSES_FILTER;
  host.innerHTML=[UME_ALL_CLASSES_FILTER,...UME_CLASSES].map(className=>{
    const count=className===UME_ALL_CLASSES_FILTER?groups.length:groups.filter(group=>group.className===className).length;
    return `<button type="button" class="${className===selected?"active":""}" onclick="umeSetPackageClassFilter('${role}','${umeEscape(className)}')">${umeEscape(className)}${count?` (${count})`:""}</button>`;
  }).join("");
}
function umeSetPackageClassFilter(role,className){
  if(!["principal","admin"].includes(role)||![UME_ALL_CLASSES_FILTER,...UME_CLASSES].includes(className))return;
  umePackageClassFilter[role]=className;umeSelectedGroups[role]=null;umeRenderPackageClassFilter(role);
  const host=document.getElementById(role==="principal"?"umePrincipalGroups":"umeAdminGroups"),detail=umeGroupDetailHost(role);
  if(detail)detail.innerHTML="";
  if(host)umeRenderGroupCards(role,umeRoleGroups(role),host);
}

function umeRenderGroupCards(role,groups,host){
  if(!groups.length){const selected=umePackageClassFilter[role];host.innerHTML=`<div class="ume-empty">${selected&&selected!==UME_ALL_CLASSES_FILTER?`No Marks package has been received for ${umeEscape(selected)}.`:"No Marks package is available."}</div>`;return;}
  host.innerHTML=groups.map((g,index)=>{
    const rows=umeSortSubjectRows(g.rows);
    const submittedRow=rows.find(row=>row.submitted_to_admin_at);
    const subjectRows=rows.map(row=>{
      let actions="";
      if(role==="classTeacher"&&row.status==="submitted_to_class_teacher")actions+=`<button type="button" class="ume-btn ume-success" onclick="umeAcceptProject(${Number(row.id)})">ACCEPT</button><button type="button" class="ume-btn ume-warning" onclick="umeReturnProject(${Number(row.id)})">RETURN</button>`;
      if(role==="classTeacher"&&row.status==="accepted_by_class_teacher")actions+=`<button type="button" class="ume-btn ume-warning" onclick="umeReturnProject(${Number(row.id)})">RETURN</button>`;
      if(role==="classTeacher"&&row.status==="returned_by_admin")actions+=`<button type="button" class="ume-btn ume-success" onclick="umeAcceptProject(${Number(row.id)})">ACCEPT AGAIN</button><button type="button" class="ume-btn ume-warning" onclick="umeReturnProject(${Number(row.id)})">RETURN TO SUBJECT TEACHER</button>`;
      return `<div class="ume-subject-row"><div><strong>${umeEscape(row.subject_name)}</strong><div class="ume-meta">Subject Teacher: ${umeEscape(row.subject_teacher_name)} • Staff ID: ${umeEscape(row.subject_teacher_id)}</div></div><div>${umeStatusHtml(row.status)}${row.admin_note?`<div class="ume-meta">Admin: ${umeEscape(row.admin_note)}</div>`:""}${row.class_teacher_note?`<div class="ume-meta">Class Teacher: ${umeEscape(row.class_teacher_note)}</div>`:""}</div><div class="ume-row-actions">${actions}</div></div>`;
    }).join("");
    let groupActions=`<button type="button" class="ume-btn ume-primary" onclick="umeViewCombined('${role}',${index})">VIEW COMBINED</button>`;
    groupActions+=`<button type="button" class="ume-btn ume-secondary" onclick="umeExportCombined('${role}',${index})">EXPORT ONE EXCEL</button>`;
    if(role==="classTeacher"){
      const blocked=rows.some(r=>["submitted_to_class_teacher","returned_to_subject_teacher","returned_by_admin"].includes(r.status));
      const ready=rows.some(r=>r.status==="accepted_by_class_teacher");
      if(ready)groupActions+=`<button type="button" class="ume-btn ume-success" onclick="umeSubmitPackage(${index})" ${blocked?'disabled title="Finish every pending or returned Subject first"':""}>SUBMIT PACKAGE TO ADMIN</button>`;
    }
    if(role==="admin"){
      if(rows.some(r=>r.status==="submitted_to_admin"))groupActions+=`<button type="button" class="ume-btn ume-warning" onclick="umeAdminReturnPackage(${index})">RETURN TO CLASS TEACHER</button>`;
      groupActions+=`<button type="button" class="ume-btn ume-danger" onclick="umeAdminDeletePackage(${index})">DELETE PACKAGE</button>`;
    }
    return `<article class="ume-group"><div class="ume-group-head"><div><div class="ume-group-title">${umeEscape(g.className)} — ${umeEscape(g.term)}</div><div class="ume-meta">Academic Session: ${umeEscape(g.session)} • ${rows.length} Subject(s) • Class Teacher: ${umeEscape(rows[0]?.class_teacher_name||"—")}</div>${submittedRow?`<div class="ume-meta"><strong>Package Submitted By:</strong> ${umeEscape(submittedRow.class_teacher_name||"Class Teacher")} • ${umeEscape(umeDate(submittedRow.submitted_to_admin_at))}</div>`:""}</div><div class="ume-group-actions">${groupActions}</div></div><div class="ume-subjects">${subjectRows}</div></article>`;
  }).join("");
}

function umeRoleGroups(role){
  const groups=umeGroupRows(umePackageRoleRows(role)),selected=umePackageClassFilter[role];
  return selected&&selected!==UME_ALL_CLASSES_FILTER?groups.filter(group=>group.className===selected):groups;
}
function umeRoleDb(role){return role==="admin"?umeAdminDb():umeStaffDb();}
async function umeLoadGroupBundles(role,index){
  const group=umeRoleGroups(role)[index];if(!group)throw new Error("Class package was not found.");
  const bundles=await Promise.all(umeSortSubjectRows(group.rows).map(r=>umeRpc(umeRoleDb(role),"ume_get_project_bundle",{p_project_id:Number(r.id)})));
  const selected={index,group,bundles};umeSelectedGroups[role]=selected;return selected;
}
function umeGroupDetailHost(role){return document.getElementById(role==="classTeacher"?"umeClassTeacherDetail":role==="principal"?"umePrincipalDetail":"umeAdminDetail");}
async function umeViewCombined(role,index){
  const host=umeGroupDetailHost(role);host.innerHTML='<div class="ume-card"><div class="ume-empty">Loading combined Class table...</div></div>';
  try{const selected=await umeLoadGroupBundles(role,index);host.innerHTML=umeCombinedTableHtml(selected.group,selected.bundles);host.scrollIntoView({behavior:"smooth",block:"start"});}
  catch(error){host.innerHTML=`<div class="ume-card"><div class="ume-empty">Could not load combined Marks: ${umeEscape(error.message||"Unknown error")}</div></div>`;}
}
function umeCombinedState(bundles){
  const sorted=[...bundles].sort((a,b)=>umeSubjectRank(a.project.subject_name)-umeSubjectRank(b.project.subject_name)||String(a.project.subject_name).localeCompare(String(b.project.subject_name)));
  const studentsMap=new Map();for(const b of sorted)for(const s of b.students||[])studentsMap.set(String(s.student_id),s);
  const students=[...studentsMap.values()].sort((a,b)=>String(a.name||a.student_name||"").localeCompare(String(b.name||b.student_name||""),undefined,{sensitivity:"base"})||String(a.student_id).localeCompare(String(b.student_id),undefined,{numeric:true,sensitivity:"base"}));
  return {bundles:sorted,students};
}
function umeCombinedTableHtml(group,bundles){
  const state=umeCombinedState(bundles);if(!state.bundles.length)return '<div class="ume-card"><div class="ume-empty">No Subject is available.</div></div>';
  const subjectHeader=state.bundles.map(b=>`<th colspan="${Math.max(1,b.components.length)}">${umeEscape(b.project.subject_name)}</th>`).join("");
  const componentHeader=state.bundles.map(b=>b.components.length?b.components.map(c=>`<th>${umeEscape(c.component_name)} (${umeEscape(umeNumber(c.full_marks))})</th>`).join(""):'<th>No Component</th>').join("");
  const maps=new Map(state.bundles.map(b=>[String(b.project.id),umeEntryMap(b)]));
  const body=state.students.map((s,index)=>`<tr><td>${index+1}</td><td>${umeEscape(s.student_id)}</td><td class="ume-student">${umeEscape(s.student_name)}</td>${state.bundles.map(b=>b.components.length?b.components.map(c=>{const e=maps.get(String(b.project.id)).get(`${c.id}|${s.student_id}`);return `<td>${umeEntryIsAbsent(e)?"ABS":umeEscape(umeNumber(e?.obtained_marks))}</td>`;}).join(""):'<td></td>').join("")}</tr>`).join("");
  return `<div class="ume-card"><div class="ume-group-head"><div><h3>${umeEscape(group.className)} — ${umeEscape(group.term)}</h3><div class="ume-meta">Academic Session: ${umeEscape(group.session)} • Combined Class Marks • Full Marks is shown in brackets</div></div></div><div class="ume-table-wrap"><table class="ume-table"><thead><tr><th rowspan="2">Roll No.</th><th rowspan="2">Student ID</th><th rowspan="2">Student Name</th>${subjectHeader}</tr><tr>${componentHeader}</tr></thead><tbody>${body||'<tr><td colspan="3">No students found.</td></tr>'}</tbody></table></div></div>`;
}

async function umeAcceptProject(id){if(!confirm("Accept this Subject Marks file?"))return;try{await umeRpc(umeStaffDb(),"ume_accept_project",{p_project_id:Number(id)});await umeLoadClassTeacherInbox();}catch(error){alert("Could not accept: "+(error.message||"Unknown error"));}}
async function umeReturnProject(id){const note=prompt("Write the correction note for the Subject Teacher:","Please check the entered Marks.");if(note===null)return;try{await umeRpc(umeStaffDb(),"ume_return_to_subject_teacher",{p_project_id:Number(id),p_note:note});await umeLoadClassTeacherInbox();alert("Returned to the Subject Teacher for correction.");}catch(error){alert("Could not return: "+(error.message||"Unknown error"));}}
async function umeSubmitPackage(index){
  const group=umeRoleGroups("classTeacher")[index];if(!group)return;
  if(!confirm(`Submit all accepted Subjects of ${group.className} — ${group.term} to Admin?\n\nThe Principal will receive the same package as Read Only.`))return;
  try{const count=await umeRpc(umeStaffDb(),"ume_submit_class_package",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session});await umeLoadClassTeacherInbox();alert(`${count} Subject(s) sent to Admin successfully.`);}catch(error){alert("Could not submit Class package: "+(error.message||"Unknown error"));}
}

function umeExcelState(group,bundles){
  const state=umeCombinedState(bundles),rows=[
    ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
    ["COMBINED CLASS MARKS"],
    ["Class",group.className,"Term / Examination",group.term,"Academic Session",group.session],
    [],
    ["Roll No.","Student ID","Student Name",...state.bundles.flatMap(b=>b.components.map((_c,i)=>i===0?b.project.subject_name:""))],
    ["","","",...state.bundles.flatMap(b=>b.components.map(c=>`${c.component_name} (${umeNumber(c.full_marks)})`))]
  ];
  const entryMaps=new Map(state.bundles.map(b=>[String(b.project.id),umeEntryMap(b)]));
  for(const [index,s] of state.students.entries()){
    const cells=state.bundles.flatMap(b=>b.components.map(c=>{const e=entryMaps.get(String(b.project.id)).get(`${c.id}|${s.student_id}`);return umeEntryIsAbsent(e)?"ABS":e?.obtained_marks===null||e?.obtained_marks===undefined?"":Number(e.obtained_marks);}));
    rows.push([index+1,s.student_id,s.student_name,...cells]);
  }
  return {state,rows};
}
function umeWriteCombinedWorkbook(group,bundles){
  if(!window.XLSX)throw new Error("Excel export library is still loading. Try again in a moment.");
  const {state,rows}=umeExcelState(group,bundles);if(!state.bundles.length)throw new Error("No Subject is available for Export.");
  const sheet=XLSX.utils.aoa_to_sheet(rows),book=XLSX.utils.book_new();
  const lastCol=Math.max(2,2+state.bundles.reduce((sum,b)=>sum+b.components.length,0));
  const merges=[{s:{r:0,c:0},e:{r:0,c:lastCol}},{s:{r:1,c:0},e:{r:1,c:lastCol}},{s:{r:4,c:0},e:{r:5,c:0}},{s:{r:4,c:1},e:{r:5,c:1}},{s:{r:4,c:2},e:{r:5,c:2}}];
  let col=3;
  for(const b of state.bundles){const start=col,end=col+b.components.length-1;if(end>=start)merges.push({s:{r:4,c:start},e:{r:4,c:end}});col+=b.components.length;}
  sheet["!merges"]=merges;sheet["!cols"]=[{wch:8},{wch:16},{wch:28},...Array.from({length:Math.max(0,lastCol-2)},()=>({wch:19}))];
  XLSX.utils.book_append_sheet(book,sheet,"Combined Marks");
  XLSX.writeFile(book,`${umeSafeFile(group.className)}_${umeSafeFile(group.term)}_${umeSafeFile(group.session)}_Combined.xlsx`,{compression:true});
}
async function umeExportCombined(role,index){try{const selected=await umeLoadGroupBundles(role,index);umeWriteCombinedWorkbook(selected.group,selected.bundles);}catch(error){alert("Excel could not be exported: "+(error.message||"Unknown error"));}}
async function umeExportOneProject(role,id){try{const bundle=await umeRpc(umeRoleDb(role),"ume_get_project_bundle",{p_project_id:Number(id)});const group={className:bundle.project.class_name,term:bundle.project.term_name,session:bundle.project.academic_session};umeWriteCombinedWorkbook(group,[bundle]);}catch(error){alert("Subject Excel could not be exported: "+(error.message||"Unknown error"));}}
function umeExportActiveSubject(){
  if(!umeActiveBundle)return;
  try{
    let bundle=umeActiveBundle;
    /* Editable, unsaved cells are included too, so a half-completed Draft can be exported immediately. */
    if(umeProjectEditable()){
      const current=umeCollectTeacherData(),fullMap=new Map(current.components.map(c=>[String(c.component_id),c.full_marks]));
      bundle={...umeActiveBundle,
        components:umeActiveBundle.components.map(c=>({...c,full_marks:fullMap.get(String(c.id))})),
        entries:current.entries.map(e=>({...e,project_id:umeActiveBundle.project.id}))
      };
    }
    const p=bundle.project;umeWriteCombinedWorkbook({className:p.class_name,term:p.term_name,session:p.academic_session},[bundle]);
  }catch(error){alert("Excel could not be exported: "+(error.message||"Unknown error"));}
}

function umeBuildAdminShell(){
  const host=document.getElementById("websiteAdminMarksTab");if(!host)return;
  host.innerHTML=`<div class="admin-section-head"><div><h3>📘 Unified Marks Entry Management</h3><p>Nursery to Class 10 • Combined Class packages received from Class Teachers.</p></div><button type="button" class="admin-mini-btn" onclick="renderAdminMarks()">↻ Refresh</button></div><div class="ume-card"><h4>Class Teacher Management</h4><p class="ume-subtitle">Choose any Staff from the complete Staff list. The selected person must have a working Staff Login ID.</p><div id="umeAdminTeacherMap" class="ume-group-list"></div></div><div class="ume-card"><h4>Class Packages</h4><p class="ume-subtitle">Choose a Class to see only its received packages. View, export one combined Excel, return for correction, or permanently delete completed packages.</p><div id="umeAdminClassFilter" class="ume-class-filter" aria-label="Filter Admin Marks packages by Class"></div><div id="umeAdminGroups" class="ume-group-list"><div class="ume-empty">Loading packages...</div></div></div><div id="umeAdminDetail"></div>`;
  umeAdminShellReady=true;
}
function umeAllStaffChoices(){
  const choices=new Map();
  if(typeof STAFF_LOGIN_DIRECTORY==="object")Object.entries(STAFF_LOGIN_DIRECTORY).forEach(([id,staff])=>choices.set(id,{id,name:staff.name||id,designation:staff.designation||"Staff"}));
  if(typeof adminManagedStaff==="object")Object.entries(adminManagedStaff).forEach(([key,staff])=>{
    const id=String(staff.staffKey||key||"").trim().toLowerCase();if(!id)return;
    const previous=choices.get(id)||{};choices.set(id,{id,name:staff.name||previous.name||id,designation:staff.designation||previous.designation||"Staff"});
  });
  return [...choices.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),undefined,{sensitivity:"base"}));
}
function umeRenderAdminClassTeacherMap(){
  const host=document.getElementById("umeAdminTeacherMap");if(!host)return;
  const staff=umeAllStaffChoices();
  host.innerHTML=UME_CLASSES.map((className,index)=>{
    const current=umeAdminClassTeachers.find(row=>row.class_name===className);
    const options=[...staff];
    if(current&&!options.some(item=>item.id===current.staff_id))options.push({id:current.staff_id,name:current.staff_name,designation:"Current Class Teacher"});
    return `<div class="ume-subject-row"><div><strong>${umeEscape(className)}</strong><div class="ume-meta">Current: ${umeEscape(current?.staff_name||"Not Assigned")} ${current?.staff_id?`• ${umeEscape(current.staff_id)}`:""}</div></div><label class="ume-field">Select Staff<select id="umeAdminClassTeacherSelect${index}">${options.map(item=>`<option value="${umeEscape(item.id)}" ${item.id===current?.staff_id?"selected":""}>${umeEscape(item.name)} — ${umeEscape(item.id)} — ${umeEscape(item.designation)}</option>`).join("")}</select></label><div class="ume-row-actions"><button type="button" class="ume-btn ume-primary" onclick="umeSaveClassTeacherAssignment(${index})">SAVE ASSIGNMENT</button></div></div>`;
  }).join("");
}
async function umeSaveClassTeacherAssignment(index){
  const className=UME_CLASSES[index],select=document.getElementById(`umeAdminClassTeacherSelect${index}`),selectedId=select?.value;
  const current=umeAdminClassTeachers.find(row=>row.class_name===className);
  const staff=umeAllStaffChoices().find(item=>item.id===selectedId)||(current?.staff_id===selectedId?{id:current.staff_id,name:current.staff_name}:null);
  if(!className||!staff)return;
  if(!confirm(`Assign ${staff.name} as Class Teacher of ${className}?`))return;
  try{await umeRpc(umeAdminDb(),"ume_admin_set_class_teacher",{p_class_name:className,p_staff_id:staff.id,p_staff_name:staff.name});await renderAdminMarks();alert(`${staff.name} is now the Class Teacher of ${className}.`);}catch(error){alert("Class Teacher could not be changed: "+(error.message||"Unknown error"));}
}
renderAdminMarks=async function(){
  if(!studentAdminSession?.access_token){openStudentAdminLogin();return;}
  if(!umeAdminShellReady||!document.getElementById("umeAdminGroups"))umeBuildAdminShell();
  const host=document.getElementById("umeAdminGroups"),map=document.getElementById("umeAdminTeacherMap"),detail=document.getElementById("umeAdminDetail");host.innerHTML='<div class="ume-empty">Loading packages...</div>';detail.innerHTML="";
  try{
    const [teachers,rows]=await Promise.all([umeRpc(umeAdminDb(),"ume_get_class_teachers"),umeRpc(umeAdminDb(),"ume_list_final_projects")]);
    umeAdminClassTeachers=teachers;umeRenderAdminClassTeacherMap();
    umeAdminRows=rows;umeRenderPackageClassFilter("admin");umeRenderGroupCards("admin",umeRoleGroups("admin"),host);
  }catch(error){host.innerHTML=`<div class="ume-empty">Could not load Unified Marks: ${umeEscape(error.message||"Unknown error")}. Run the supplied final SQL first.</div>`;}
};
async function umeAdminReturnPackage(index){
  const group=umeRoleGroups("admin")[index];if(!group)return;
  const note=prompt("Write the problem/correction note for the Class Teacher:","Please check this Class package and return the affected Subject to the Subject Teacher.");if(note===null)return;
  try{const count=await umeRpc(umeAdminDb(),"ume_admin_return_package",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session,p_note:note});await renderAdminMarks();alert(`${count} Subject(s) returned to the Class Teacher.`);}catch(error){alert("Package could not be returned: "+(error.message||"Unknown error"));}
}
async function umeAdminDeletePackage(index){
  const group=umeRoleGroups("admin")[index];if(!group)return;
  if(!confirm(`PERMANENTLY DELETE ${group.className} — ${group.term} — ${group.session}?\n\nAll submitted Subjects, Components and student Marks in this package will be deleted. This cannot be undone.`))return;
  if(!confirm("Final confirmation: Delete this complete Class package now?"))return;
  try{const count=await umeRpc(umeAdminDb(),"ume_admin_delete_package",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session});await renderAdminMarks();alert(`${count} Subject file(s) deleted permanently.`);}catch(error){alert("Package could not be deleted: "+(error.message||"Unknown error"));}
}

/* Class 6-10 roster management is added below the unchanged Nursery-Class 5
   Student Management area in the Admin Controller. */
function umeEnsureAdminUpperRosterSection(){
  const tab=document.getElementById("websiteAdminStudentsTab");if(!tab||document.getElementById("umeAdminUpperRosterSection"))return;
  const section=document.createElement("section");section.id="umeAdminUpperRosterSection";section.className="ume-card";
  section.innerHTML=`<div class="admin-section-head"><div><h3>Class 6–10 Student List</h3><p>Add, edit or delete the name-only students used by Public Portfolio and Marks Entry.</p></div></div><form id="umeAdminUpperRosterForm" class="ume-grid" onsubmit="umeSaveAdminUpperStudent(event)"><input id="umeAdminUpperOriginalId" type="hidden"><label class="ume-field">Class<select id="umeAdminUpperClass" required>${UME_UPPER_CLASSES.map(c=>`<option>${umeEscape(c)}</option>`).join("")}</select></label><label class="ume-field">Student ID<input id="umeAdminUpperId" maxlength="24" required></label><label class="ume-field">Student Name<input id="umeAdminUpperName" maxlength="140" required></label><button id="umeAdminUpperSaveBtn" type="submit" class="ume-btn ume-primary">ADD STUDENT</button><button id="umeAdminUpperCancelBtn" type="button" class="ume-btn ume-secondary" onclick="umeResetAdminUpperForm()" style="display:none;">CANCEL EDIT</button></form><div class="ume-picker" style="margin-top:14px;"><label for="umeAdminUpperFilter">Roster List</label><select id="umeAdminUpperFilter" onchange="umeRenderAdminUpperStudents()">${UME_UPPER_CLASSES.map(c=>`<option>${umeEscape(c)}</option>`).join("")}</select><button type="button" class="ume-btn ume-secondary" onclick="umeLoadAdminUpperStudents()">↻ REFRESH</button></div><div id="umeAdminUpperList" class="ume-components"><div class="ume-empty">Loading Class 6–10 students...</div></div>`;
  tab.appendChild(section);
}
async function umeLoadAdminUpperStudents(){
  umeEnsureAdminUpperRosterSection();const host=document.getElementById("umeAdminUpperList");if(!host||!studentAdminSession?.access_token)return;
  if(umeAdminUpperStudentsLoading)return;
  umeAdminUpperStudentsLoading=true;
  host.innerHTML='<div class="ume-empty">Loading Class 6–10 students...</div>';
  try{
    const rows=await umeRpc(umeAdminDb(),"ume_admin_list_upper_students");
    umeAdminUpperStudents=(rows||[]).map(row=>({
      ...row,
      class_name:String(row.class_name||"").trim(),
      student_id:String(row.student_id||"").trim(),
      name:String(row.name||row.student_name||"").trim()
    })).filter(row=>UME_UPPER_CLASSES.includes(row.class_name)&&row.student_id&&row.name);
    umeAdminUpperStudentsLoaded=true;
    umeRenderAdminUpperStudents();
    umeRenderCombinedAdminStudentList();
  }
  catch(error){umeAdminUpperStudentsLoaded=false;host.innerHTML=`<div class="ume-empty">Could not load Class 6–10 students: ${umeEscape(error.message||"Unknown error")}. Run the latest SQL file once, then press Refresh.</div>`;umeRenderCombinedAdminStudentList();}
  finally{umeAdminUpperStudentsLoading=false;}
}
function umeRenderAdminUpperStudents(){
  const host=document.getElementById("umeAdminUpperList"),className=document.getElementById("umeAdminUpperFilter")?.value||UME_UPPER_CLASSES[0];if(!host)return;
  const rows=umeAdminUpperStudents.filter(row=>String(row.class_name).trim()===className).sort((a,b)=>String(a.name||a.student_name||"").localeCompare(String(b.name||b.student_name||""),undefined,{sensitivity:"base"})||String(a.student_id).localeCompare(String(b.student_id),undefined,{numeric:true,sensitivity:"base"}));
  host.innerHTML=rows.length?rows.map((row,index)=>`<div class="ume-component"><strong>${index+1}. ${umeEscape(row.name)}</strong><div class="ume-meta">${umeEscape(row.class_name)} • Student ID: ${umeEscape(row.student_id)}</div><div class="ume-row-actions" style="margin-top:8px;"><button type="button" class="ume-btn ume-secondary" onclick="umeEditAdminUpperStudent('${umeEscape(row.student_id)}')">EDIT</button><button type="button" class="ume-btn ume-danger" onclick="umeDeleteAdminUpperStudent('${umeEscape(row.student_id)}')">DELETE</button></div></div>`).join(""):'<div class="ume-empty">No students have been added to this Class yet.</div>';
}
function umeResetAdminUpperForm(){
  const form=document.getElementById("umeAdminUpperRosterForm"),className=document.getElementById("umeAdminUpperClass")?.value;form?.reset();
  if(className)document.getElementById("umeAdminUpperClass").value=className;
  document.getElementById("umeAdminUpperOriginalId").value="";document.getElementById("umeAdminUpperSaveBtn").textContent="ADD STUDENT";document.getElementById("umeAdminUpperCancelBtn").style.display="none";
}
function umeFocusAdminUpperStudentForm(){
  umeEnsureAdminUpperRosterSection();umeResetAdminUpperForm();
  const section=document.getElementById("umeAdminUpperRosterSection");section?.scrollIntoView({behavior:"smooth",block:"start"});
  setTimeout(()=>document.getElementById("umeAdminUpperId")?.focus(),250);
}
function umeEditAdminUpperStudent(studentId){
  const row=umeAdminUpperStudents.find(item=>item.student_id===studentId);if(!row)return;
  document.getElementById("umeAdminUpperOriginalId").value=row.student_id;document.getElementById("umeAdminUpperClass").value=row.class_name;document.getElementById("umeAdminUpperId").value=row.student_id;document.getElementById("umeAdminUpperName").value=row.name;document.getElementById("umeAdminUpperSaveBtn").textContent="SAVE CHANGES";document.getElementById("umeAdminUpperCancelBtn").style.display="inline-block";document.getElementById("umeAdminUpperId").focus();
}
function umeOpenAdminUpperStudentEdit(studentId){
  umeEditAdminUpperStudent(studentId);
  document.getElementById("umeAdminUpperRosterSection")?.scrollIntoView({behavior:"smooth",block:"start"});
}
async function umeSaveAdminUpperStudent(event){
  event.preventDefault();
  const original=document.getElementById("umeAdminUpperOriginalId").value;
  const className=document.getElementById("umeAdminUpperClass").value;
  const studentId=document.getElementById("umeAdminUpperId").value.trim().toUpperCase();
  const name=document.getElementById("umeAdminUpperName").value.trim().toUpperCase();
  if(!/^[A-Z0-9-]{2,24}$/.test(studentId)){alert("Student ID may contain only 2–24 letters, numbers or hyphens.");return;}
  if(!name)return;
  try{await umeRpc(umeAdminDb(),"ume_admin_save_upper_student",{p_original_student_id:original,p_student_id:studentId,p_name:name,p_class_name:className});umeResetAdminUpperForm();document.getElementById("umeAdminUpperFilter").value=className;await umeLoadAdminUpperStudents();alert(original?"Student updated successfully.":"Student added successfully.");}
  catch(error){alert("Student could not be saved: "+(error.message||"Unknown error"));}
}
async function umeDeleteAdminUpperStudent(studentId){
  const row=umeAdminUpperStudents.find(item=>item.student_id===studentId);if(!row)return;
  if(!confirm(`Delete ${row.name} from the active ${row.class_name} Student list?\n\nPreviously submitted final Marks remain preserved.`))return;
  try{await umeRpc(umeAdminDb(),"ume_admin_delete_upper_student",{p_student_id:studentId});await umeLoadAdminUpperStudents();alert("Student deleted from the active roster.");}
  catch(error){alert("Student could not be deleted: "+(error.message||"Unknown error"));}
}
const umePreviousRenderAdminStudentList=renderAdminStudentList;
function umeRenderCombinedAdminStudentList(){
  const host=document.getElementById("adminStudentList");if(!host)return;
  const classFilter=document.getElementById("adminStudentClassFilter")?.value||"ALL";
  const q=String(document.getElementById("adminStudentSearch")?.value||"").trim().toLowerCase();
  const lower=(adminManagedStudents||[]).filter(student=>!UME_UPPER_CLASSES.includes(student.className)).map(student=>({...student,umeUpper:false}));
  const upper=(umeAdminUpperStudents||[]).map(row=>({studentId:row.student_id,name:row.name,className:row.class_name,dob:"",umeUpper:true}));
  const students=[...lower,...upper]
    .filter(student=>classFilter==="ALL"||student.className===classFilter)
    .filter(student=>!q||String(student.name).toLowerCase().includes(q)||String(student.studentId).toLowerCase().includes(q))
    .sort((a,b)=>UME_CLASSES.indexOf(a.className)-UME_CLASSES.indexOf(b.className)||String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base"})||String(a.studentId).localeCompare(String(b.studentId),undefined,{numeric:true,sensitivity:"base"}));
  host.innerHTML=students.map(student=>`<div class="admin-manager-row"><div style="width:58px;height:52px;border-radius:10px;background:#e8eef5;display:flex;align-items:center;justify-content:center;font-size:26px;">👤</div><div><div class="admin-manager-title">${umeEscape(student.name)}</div><div class="admin-manager-meta">${umeEscape(student.className)} • ${umeEscape(student.studentId)}${student.umeUpper?" • Class 6–10 Roster":student.dob?` • DOB ${umeEscape(student.dob)}`:""}</div></div><div class="admin-manager-actions">${student.umeUpper?`<button type="button" onclick="umeOpenAdminUpperStudentEdit('${umeEscape(student.studentId)}')">Edit</button><button type="button" class="danger" onclick="umeDeleteAdminUpperStudent('${umeEscape(student.studentId)}')">Delete</button>`:`<button type="button" onclick="openStudentDataEditor('${umeEscape(student.studentId)}')">Edit</button><button type="button" class="danger" onclick="deleteStudentItem('${umeEscape(student.studentId)}')">Delete</button>`}</div></div>`).join("")||'<p style="text-align:center;color:#667085;padding:20px;">No students found.</p>';
}
renderAdminStudentList=function(){
  umeEnsureAdminUpperRosterSection();umeRenderCombinedAdminStudentList();
  if(studentAdminSession?.access_token&&!umeAdminUpperStudentsLoaded&&!umeAdminUpperStudentsLoading)umeLoadAdminUpperStudents();
};

/* Public Class 6-10 Portfolio: names only, with no clickable profile. */
showUpperClassPublicRoster=async function(className){
  document.getElementById("studentClassView").style.display="none";
  const rollView=document.getElementById("studentRollView");rollView.style.display="block";
  rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${umeEscape(className)} - Student List</h2><div class="student-grid"><div class="ume-empty">Loading student list...</div></div>`;
  try{const db=initStudentSupabase();if(!db)throw new Error("Connection unavailable");const {data,error}=await db.rpc("ume_list_public_upper_students");if(error)throw error;const rows=(data||[]).filter(row=>row.class_name===className).sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base"})||String(a.student_id||"").localeCompare(String(b.student_id||""),undefined,{numeric:true,sensitivity:"base"}));const list=rows.length?rows.map((row,index)=>`<div class="student-roll-btn upper-student-public-row" aria-label="Roll No. ${index+1}, ${umeEscape(row.name)}">${index+1}. ${umeEscape(row.name)}</div>`).join(""):'<div class="ume-empty">No students have been added to this Class yet.</div>';rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${umeEscape(className)} - Student List</h2><div class="student-grid">${list}</div>`;}
  catch(error){rollView.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${umeEscape(className)} - Student List</h2><div class="ume-empty">Student list could not be loaded.</div>`;}
};

/* Replace the earlier visible entry points without changing other website features. */
openMarksEntryHub=function(){return openUnifiedMarksEntry("teacher");};
openPrincipalMarksView=function(){return openUnifiedMarksEntry("principal");};
loadPrincipalMarksNotifications=async function(){
  const card=document.getElementById("principalMarksNotificationCard"),host=document.getElementById("principalMarksNotificationList"),principal=loggedInStaff?.username===UME_PRINCIPAL_ID;
  if(card)card.style.display=principal?"block":"none";if(!principal||!host)return;
  host.innerHTML='<div class="staff-dashboard-empty">Loading submitted packages...</div>';
  try{const rows=await umeRpc(umeStaffDb(),"ume_list_final_projects"),groups=umeGroupRows(rows);host.innerHTML=groups.length?groups.slice(0,8).map(g=>`<button type="button" class="staff-dashboard-preview-item" onclick="openUnifiedMarksEntry('principal')"><strong>${umeEscape(g.className)} — ${umeEscape(g.term)}</strong><span>${umeEscape(g.session)} • ${g.rows.length} Subject(s)</span><small>Read Only</small></button>`).join(""):'<div class="staff-dashboard-empty">No Class package has been submitted yet.</div>';}
  catch(error){host.innerHTML='<div class="staff-dashboard-empty">Could not load Marks packages.</div>';}
};

/* Existing IDs use the built-in directory. A newly hired Staff member can also
   be resolved from the Supabase staff table after their Auth account is made. */
async function umeResolveStaffLoginProfile(staffId){
  const id=normalizeStaffId(staffId);
  if(STAFF_LOGIN_DIRECTORY[id])return STAFF_LOGIN_DIRECTORY[id];
  const local=typeof adminManagedStaff==="object"?adminManagedStaff[id]:null;
  if(local){STAFF_LOGIN_DIRECTORY[id]={name:local.name||id.toUpperCase(),designation:local.designation||"Staff"};return STAFF_LOGIN_DIRECTORY[id];}
  try{
    const db=initStaffSupabase();if(!db)return null;
    const {data,error}=await db.from("staff").select("staff_key,name,designation").eq("staff_key",id).maybeSingle();
    if(error||!data)return null;
    STAFF_LOGIN_DIRECTORY[id]={name:data.name||id.toUpperCase(),designation:data.designation||"Staff"};
    return STAFF_LOGIN_DIRECTORY[id];
  }catch(_error){return null;}
}

function showStaffDashboardWelcome(){
  if(!loggedInStaff||!staffAuthSession){openStaffLogin();return;}
  const popup=document.getElementById("staffDashboardWelcomePopup");
  const name=document.getElementById("staffDashboardWelcomeName");
  const role=document.getElementById("staffDashboardWelcomeRole");
  const photo=document.getElementById("staffDashboardWelcomePhoto");
  if(name)name.textContent=loggedInStaff.name||"Staff Member";
  if(role)role.textContent=loggedInStaff.designation||"Staff Member";
  if(photo){
    photo.onerror=function(){this.onerror=null;this.src="logo.jpeg";this.alt="St. Augustine logo";};
    photo.src=typeof getLoggedInStaffPhoto==="function"?getLoggedInStaffPhoto():"logo.jpeg";
    photo.alt=loggedInStaff.name?`${loggedInStaff.name} profile photo`:"Staff profile photo";
  }
  if(popup)popup.style.display="flex";
  document.body.style.overflow="hidden";
  setTimeout(()=>document.getElementById("staffDashboardWelcomeEnter")?.focus(),180);
}
function closeStaffDashboardWelcome(){
  const popup=document.getElementById("staffDashboardWelcomePopup");
  if(popup)popup.style.display="none";
  document.body.style.overflow="auto";
}
async function enterStaffDashboard(){
  if(!loggedInStaff||!staffAuthSession){closeStaffDashboardWelcome();openStaffLogin();return;}
  const button=document.getElementById("staffDashboardWelcomeEnter");
  if(button){button.disabled=true;button.innerHTML="<strong>OPENING DASHBOARD...</strong>";}
  closeStaffDashboardWelcome();
  try{await openStaffDashboard();}
  finally{
    if(button){
      button.disabled=false;
      button.innerHTML='<span>OK</span><strong>ENTER DASHBOARD</strong><span aria-hidden="true">→</span>';
    }
  }
}
function decorateStaffDashboardActions(){
  const setAction=(id,icon,title,detail)=>{
    const button=document.getElementById(id);if(!button)return;
    button.innerHTML=`<span class="staff-dashboard-action-icon">${icon}</span><span class="staff-dashboard-action-copy"><strong>${title}</strong><small>${detail}</small></span><span class="staff-dashboard-action-arrow">→</span>`;
  };
  const principal=typeof staffDashboardIsPrincipal==="function"&&staffDashboardIsPrincipal();
  setAction("staffDashboardLeaveAction",principal?"📋":"📝",principal?"Review Leave Requests":"Leave Application",principal?"Approve or reject requests":"Submit a leave request");
  setAction("staffDashboardApprovedAction","✓","Approved Leave","View approved staff leave");
  setAction("staffDashboardPlanAction","📅","Upcoming Plan","Open school plans");
  setAction("staffDashboardIdeaAction","💡","Staff Idea Hub","Share and support ideas");
  setAction("staffDashboardMarksAction","📘","Marks Entry",principal?"Read submitted class marks":"Enter and manage marks");
  setAction("staffDashboardVideoTutorialsAction","🎬","Video Tutorials","Learn website features");
  const marks=document.getElementById("staffDashboardMarksAction");
  if(marks){marks.style.display="flex";marks.setAttribute("onclick",principal?"openUnifiedMarksEntry('principal')":"openUnifiedMarksEntry('teacher')");}
  const internal=document.getElementById("staffDashboardInternalEvaluationAction");
  if(internal)internal.style.display="none";
}
const umePreviousOpenDashboardFeature=openDashboardFeature;
openDashboardFeature=function(feature){
  if(feature==="videos"){closeStaffDashboard();openVideoTutorials();return;}
  return umePreviousOpenDashboardFeature(feature);
};
staffLogin=async function(){
  const username=normalizeStaffId(document.getElementById("staffUsername")?.value||"");
  const password=document.getElementById("staffPassword")?.value||"";
  if(!username||!password){showStaffMessage("Enter your Staff ID and password.");return;}
  const client=initStaffSupabase();if(!client){showStaffMessage("Supabase connection is unavailable.");return;}
  showStaffMessage("Signing in...","success");
  const {data,error}=await client.auth.signInWithPassword({email:staffInternalEmail(username),password});
  if(error||!data?.session){showStaffMessage("Login failed. Check Staff ID and password.");return;}
  const sessionUsername=normalizeStaffId((data.user?.email||"").split("@")[0]);
  const profile=sessionUsername===username?await umeResolveStaffLoginProfile(sessionUsername):null;
  if(!profile){await client.auth.signOut();showStaffMessage("This account is not authorized for staff access.");return;}
  staffAuthSession=data.session;loggedInStaff={username:sessionUsername,...profile};
  const passwordBox=document.getElementById("staffPassword");if(passwordBox)passwordBox.value="";
  updateStaffLoginUI();closeStaffLogin();showStaffDashboardWelcome();
};
restoreStaffSession=async function(){
  const client=initStaffSupabase();if(!client)return;
  const {data}=await client.auth.getSession();const session=data?.session||null;
  if(session?.user?.email){
    const username=normalizeStaffId(session.user.email.split("@")[0]),profile=await umeResolveStaffLoginProfile(username);
    if(profile){staffAuthSession=session;loggedInStaff={username,...profile};}
    else{await client.auth.signOut();staffAuthSession=null;loggedInStaff=null;}
  }
  updateStaffLoginUI();
  client.auth.onAuthStateChange(async(_event,nextSession)=>{
    if(nextSession?.user?.email){const username=normalizeStaffId(nextSession.user.email.split("@")[0]),profile=await umeResolveStaffLoginProfile(username);if(profile){staffAuthSession=nextSession;loggedInStaff={username,...profile};}else{staffAuthSession=null;loggedInStaff=null;}}
    else{staffAuthSession=null;loggedInStaff=null;}
    updateStaffLoginUI();
  });
};
const umePreviousOpenStaffDashboard=openStaffDashboard;
openStaffDashboard=async function(){const opening=umePreviousOpenStaffDashboard();decorateStaffDashboardActions();await opening;decorateStaffDashboardActions();};
const umePreviousStaffLogout=staffLogout;
staffLogout=async function(){closeStaffDashboardWelcome();closeUnifiedMarksEntry();umeMyProjects=[];umeActiveBundle=null;umeMyClassAssignments=[];umeTeacherRosterRows=[];await umePreviousStaffLogout();};
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('button[onclick="showWebsiteAdminTab(\'internalEvaluations\')"]').forEach(b=>b.style.display="none");const internal=document.getElementById("staffDashboardInternalEvaluationAction");if(internal)internal.style.display="none";});

/* ===== SOURCE SCRIPT BLOCK: class-teacher-portfolio-final-js ===== */
const CTP_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5"];
const CTP_MAX_BYTES=300*1024;
let ctpMyAccess=[],ctpMyStudents=[],ctpEditingStudent=null,ctpAdminAssignments=[],ctpAdminAccess=[];
function ctpDb(role="staff"){const db=role==="admin"?initStudentSupabase():initStaffSupabase();if(!db)throw new Error("Supabase connection is unavailable.");return db;}
function ctpEsc(v){return typeof escapeHtml==="function"?escapeHtml(String(v??"")):String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function ctpMsg(message,type="error"){const el=document.getElementById("ctpTeacherMessage");if(!el)return;el.textContent=message;el.className=`ctp-message show ${type}`;el.scrollIntoView({behavior:"smooth",block:"nearest"});}
function ctpClearMsg(){const el=document.getElementById("ctpTeacherMessage");if(el)el.className="ctp-message";}
function ctpActiveAccess(row){return !!row?.enabled&&(!row.expires_at||new Date(row.expires_at)>new Date());}
async function ctpRpc(db,name,args={}){const {data,error}=await db.rpc(name,args);if(error)throw error;return data;}

async function ctpOpenTeacher(){
  if(!loggedInStaff||!staffAuthSession){openStaffLogin();return;}
  const popup=document.getElementById("ctpTeacherPopup");popup.style.display="flex";document.body.style.overflow="hidden";ctpClearMsg();
  document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">Checking secure access...</div>';
  try{
    ctpMyAccess=await ctpRpc(ctpDb(),"portfolio_get_my_access");
    ctpMyAccess=(ctpMyAccess||[]).filter(ctpActiveAccess);
    const select=document.getElementById("ctpTeacherClass");select.innerHTML=ctpMyAccess.map(r=>`<option value="${ctpEsc(r.class_name)}">${ctpEsc(r.class_name)}</option>`).join("");
    if(!ctpMyAccess.length){document.getElementById("ctpAccessBanner").className="ctp-banner off";document.getElementById("ctpAccessBanner").textContent="Portfolio Access Disabled — Ask the Admin to enable access.";document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">You currently cannot edit any class portfolio.</div>';return;}
    await ctpLoadTeacherStudents();
  }catch(error){document.getElementById("ctpAccessBanner").className="ctp-banner off";document.getElementById("ctpAccessBanner").textContent="Portfolio access could not be verified.";ctpMsg(error.message||"Could not open portfolio.");}
}
function ctpCloseTeacher(){document.getElementById("ctpTeacherPopup").style.display="none";document.body.style.overflow="auto";ctpEditingStudent=null;}
async function ctpLoadTeacherStudents(){
  const className=document.getElementById("ctpTeacherClass")?.value;if(!className)return;
  document.getElementById("ctpTeacherEditor").classList.add("ctp-hidden");document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">Loading students...</div>';
  try{
    ctpMyAccess=await ctpRpc(ctpDb(),"portfolio_get_my_access");const access=ctpMyAccess.find(r=>r.class_name===className);
    if(!ctpActiveAccess(access))throw new Error("Admin has disabled or expired this class access.");
    ctpMyStudents=await ctpRpc(ctpDb(),"portfolio_list_my_students",{p_class_name:className});
    const expiry=access.expires_at?` • Valid until ${new Date(access.expires_at).toLocaleString()}`:"";
    document.getElementById("ctpAccessBanner").className="ctp-banner";document.getElementById("ctpAccessBanner").textContent=`✓ Portfolio Access Active — ${className}${expiry}`;ctpRenderTeacherStudents();
  }catch(error){ctpMyStudents=[];document.getElementById("ctpAccessBanner").className="ctp-banner off";document.getElementById("ctpAccessBanner").textContent="Portfolio Access Disabled";document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">Editing is unavailable.</div>';ctpMsg(error.message||"Access denied.");}
}
function ctpRenderTeacherStudents(){
  const host=document.getElementById("ctpTeacherStudents"),q=(document.getElementById("ctpTeacherSearch")?.value||"").trim().toLowerCase();
  const rows=(ctpMyStudents||[]).filter(s=>!q||String(s.name).toLowerCase().includes(q)||String(s.student_id).toLowerCase().includes(q));
  host.innerHTML=rows.map(s=>`<article class="ctp-student"><div class="ctp-avatar">👤</div><div style="min-width:0;flex:1"><strong>${ctpEsc(s.name)}</strong><small>${ctpEsc(s.student_id)} • ${ctpEsc(s.class_name)}</small></div><button type="button" class="ctp-btn light" onclick="ctpEditStudent('${ctpEsc(s.student_id)}')">Manage</button></article>`).join("")||'<div class="ctp-spinner">No students found.</div>';
}
function ctpEditStudent(studentId){
  const s=ctpMyStudents.find(row=>row.student_id===studentId);if(!s)return;ctpEditingStudent=s;ctpClearMsg();
  const host=document.getElementById("ctpTeacherEditor");host.classList.remove("ctp-hidden");
  host.innerHTML=`<h3 style="margin-top:0">${ctpEsc(s.name)} — Portfolio</h3><div class="ctp-form"><label>Student Name<input id="ctpEditName" value="${ctpEsc(s.name)}" maxlength="120"></label><label>Date of Birth<input id="ctpEditDob" type="text" inputmode="text" maxlength="10" placeholder="2076-03-02" autocomplete="off" autocapitalize="off" spellcheck="false" value="${ctpEsc(s.dob||"")}"></label><label style="grid-column:1/-1">Parent / Guardian Name<input id="ctpEditGuardian" value="${ctpEsc(s.guardian||"")}" maxlength="160"></label><div class="ctp-form-actions"><button type="button" class="ctp-btn green" onclick="ctpSaveStudent()">✓ Save Information</button><button type="button" class="ctp-btn light" onclick="document.getElementById('ctpTeacherEditor').classList.add('ctp-hidden')">Cancel</button></div></div><div class="ctp-photo-actions"><div class="ctp-photo-card"><strong>Student Photo</strong><button class="ctp-btn" type="button" onclick="ctpChoosePhoto('profile')">📷 Upload / Replace</button></div>${Array.from({length:12},(_,i)=>`<div class="ctp-photo-card"><strong>Month ${i+1}</strong><button class="ctp-btn light" type="button" onclick="ctpChoosePhoto('month',${i+1})">Upload / Replace</button></div>`).join("")}</div><div class="ctp-file-note">JPG, PNG or WebP • Maximum saved size 300 KB • Upload/replace only; deletion is not available.</div>`;
  host.scrollIntoView({behavior:"smooth",block:"start"});
}
async function ctpSaveStudent(){
  if(!ctpEditingStudent)return;const name=document.getElementById("ctpEditName").value.trim(),dob=document.getElementById("ctpEditDob").value,guardian=document.getElementById("ctpEditGuardian").value.trim();
  if(!name){ctpMsg("Student name is required.");return;}if(!confirm(`Save changes for ${ctpEditingStudent.name}?`))return;
  try{await ctpRpc(ctpDb(),"portfolio_update_student",{p_student_id:ctpEditingStudent.student_id,p_name:name,p_dob:dob||null,p_guardian:guardian||null});ctpMsg("✓ Student information updated successfully.","success");await ctpLoadTeacherStudents();}
  catch(error){ctpMsg(error.message||"Student information could not be updated.");}
}
function ctpChoosePhoto(type,month=null){
  if(!ctpEditingStudent)return;const picker=document.createElement("input");picker.type="file";picker.accept="image/jpeg,image/png,image/webp";picker.style.display="none";document.body.appendChild(picker);
  picker.onchange=async()=>{const file=picker.files?.[0];try{if(file)await ctpUploadPhoto(file,type,month);}finally{picker.remove();}};picker.click();
}
async function ctpCompressPhoto(file){
  if(!file.type.match(/^image\/(jpeg|png|webp)$/i))throw new Error("Please select a JPG, PNG or WebP photo.");
  const img=await loadImageForCompression(file);let max=1400,quality=.82;
  for(let attempt=0;attempt<8;attempt++){
    const ratio=Math.min(1,max/(img.naturalWidth||img.width),max/(img.naturalHeight||img.height));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round((img.naturalWidth||img.width)*ratio));canvas.height=Math.max(1,Math.round((img.naturalHeight||img.height)*ratio));canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Photo processing failed.")),"image/jpeg",quality));if(blob.size<=CTP_MAX_BYTES)return blob;max=Math.round(max*.82);quality=Math.max(.48,quality-.06);
  }throw new Error("This photo could not be reduced below 300 KB. Please choose a smaller photo.");
}
async function ctpUploadPhoto(file,type,month){
  const s=ctpEditingStudent;if(!s)return;try{
    ctpMsg("Preparing photo for mobile upload...","success");
    const latest=await ctpRpc(ctpDb(),"portfolio_get_my_access"),access=(latest||[]).find(r=>r.class_name===s.class_name);if(!ctpActiveAccess(access))throw new Error("Admin has disabled or expired your portfolio access.");
    const blob=await ctpCompressPhoto(file);if(blob.size>CTP_MAX_BYTES)throw new Error("Photo must be 300 KB or smaller.");
    const path=cloudPath(s.student_id,type,month),db=ctpDb();ctpMsg(`Uploading ${(blob.size/1024).toFixed(0)} KB photo...`,"success");
    const {error}=await db.storage.from(STUDENT_STORAGE_CONFIG.bucket).upload(path,blob,{contentType:"image/jpeg",cacheControl:"3600",upsert:true});if(error)throw error;
    await ctpRpc(db,"portfolio_log_photo_update",{p_student_id:s.student_id,p_photo_type:type,p_month_number:month});studentSignedUrlCache.clear();ctpMsg("✓ Photo uploaded successfully.","success");
  }catch(error){ctpMsg(`Upload failed: ${error.message||"Unknown error"}`);}
}

function ctpEnsureDashboardButton(){
  const grid=document.querySelector(".staff-dashboard-quick-actions");if(!grid||document.getElementById("staffDashboardPortfolioAction"))return;
  const b=document.createElement("button");b.type="button";b.id="staffDashboardPortfolioAction";b.className="staff-dashboard-action ctp-dashboard-action";b.onclick=ctpOpenTeacher;b.innerHTML='<span class="staff-dashboard-action-icon">🎓</span><span class="staff-dashboard-action-copy"><strong>Manage Class Portfolio</strong><small>Available only when Admin enables access</small></span><span class="staff-dashboard-action-arrow">→</span>';grid.appendChild(b);
}
const ctpPreviousDecorate=decorateStaffDashboardActions;decorateStaffDashboardActions=function(){ctpPreviousDecorate();ctpEnsureDashboardButton();};

function ctpEnsureAdminTab(){
  const panel=document.getElementById("websiteAdminPanel");if(!panel||document.getElementById("websiteAdminPortfolioAccessTab"))return;
  const nav=panel.querySelector(".website-admin-tabs")||panel.querySelector(".admin-tab-buttons")||panel.querySelector(".admin-dashboard-tabs");
  const anyTab=panel.querySelector('button[onclick^="showWebsiteAdminTab"]');const parent=nav||(anyTab&&anyTab.parentElement);
  if(parent){const b=document.createElement("button");b.type="button";b.textContent="🎓 Portfolio Access";b.onclick=()=>showWebsiteAdminTab("portfolioAccess");parent.appendChild(b);}
  const content=document.createElement("div");content.id="websiteAdminPortfolioAccessTab";content.style.display="none";content.innerHTML='<div class="admin-section-head"><div><h3>🎓 Student Portfolio Access Control</h3><p>Nursery–Class 10 • Enable or immediately revoke each Class Teacher.</p></div><button class="admin-mini-btn" type="button" onclick="ctpLoadAdminAccess()">↻ Refresh</button></div><div class="ctp-admin-card"><h4 style="margin-top:0">⚡ All Classes Access</h4><p style="color:#667085">Apply one action to every currently assigned Class Teacher. Individual Class controls remain available below.</p><div class="ctp-bulk-grid"><label style="display:grid;gap:6px;font-size:12px;font-weight:800">Common Expiry — Optional<input id="ctpBulkExpiry" type="datetime-local" class="ctp-expiry"></label><button id="ctpBulkOnBtn" class="ctp-btn green" type="button" onclick="ctpSetAllAccess(true)">TURN ON ALL CLASSES</button><button id="ctpBulkOffBtn" class="ctp-btn" type="button" style="background:#b42318" onclick="ctpSetAllAccess(false)">TURN OFF ALL CLASSES</button></div><div id="ctpBulkStatus" style="margin-top:9px;font-size:12px;font-weight:800;color:#667085"></div></div><div id="ctpAdminAccessHost" class="ctp-admin-card"><div class="ctp-spinner">Loading access...</div></div><div class="ctp-admin-card ctp-audit"><h4>Recent Portfolio Updates</h4><div id="ctpAdminAuditHost"><div class="ctp-spinner">Loading history...</div></div></div>';
  const body=panel.querySelector(".website-admin-content")||panel.querySelector(".admin-dashboard-content")||anyTab?.closest(".popup-box")||panel;body.appendChild(content);
}
const ctpPreviousShowAdminTab=showWebsiteAdminTab;showWebsiteAdminTab=function(tab){ctpEnsureAdminTab();ctpPreviousShowAdminTab(tab);const el=document.getElementById("websiteAdminPortfolioAccessTab");if(el)el.style.display=tab==="portfolioAccess"?"block":"none";if(tab==="portfolioAccess")ctpLoadAdminAccess();};
async function ctpLoadAdminAccess(){
  if(!studentAdminSession)return;const host=document.getElementById("ctpAdminAccessHost");if(!host)return;host.innerHTML='<div class="ctp-spinner">Loading Class Teachers and access...</div>';
  try{
    const db=ctpDb("admin");const [teachers,access,audit]=await Promise.all([ctpRpc(db,"ume_get_class_teachers"),ctpRpc(db,"portfolio_admin_list_access"),ctpRpc(db,"portfolio_admin_audit",{p_limit:60})]);ctpAdminAssignments=teachers||[];ctpAdminAccess=access||[];
    host.innerHTML=CTP_CLASSES.map(className=>{
      const teacher=ctpAdminAssignments.find(r=>r.class_name===className),row=ctpAdminAccess.find(r=>r.class_name===className),on=ctpActiveAccess(row)&&row.staff_id===teacher?.staff_id;
      const expiry=row?.expires_at?String(row.expires_at).slice(0,16):"";
      return `<div class="ctp-access-row"><strong>${ctpEsc(className)}</strong><div><strong>${ctpEsc(teacher?.staff_name||"No Class Teacher assigned")}</strong><small style="display:block;color:#667085">${ctpEsc(teacher?.staff_id||"Assign in Marks Entry first")}</small></div><span class="ctp-access-status ${on?"on":""}">${on?"ACTIVE":"DISABLED"}</span><input class="ctp-expiry" id="ctpExpiry_${CTP_CLASSES.indexOf(className)}" type="datetime-local" value="${ctpEsc(expiry)}" title="Optional expiry date"><button class="ctp-btn ${on?"":"green"}" type="button" ${teacher?"":"disabled"} onclick="ctpToggleAdminAccess('${ctpEsc(className)}',${on?"false":"true"})">${on?"Turn OFF":"Turn ON"}</button></div>`;
    }).join("");ctpRenderAudit(audit||[]);
  }catch(error){host.innerHTML=`<div class="ctp-banner off">Could not load Portfolio Access: ${ctpEsc(error.message||"Unknown error")}. Run the supplied SQL once.</div>`;}
}
async function ctpToggleAdminAccess(className,enabled){
  const teacher=ctpAdminAssignments.find(r=>r.class_name===className);if(enabled&&!teacher){alert("Assign a Class Teacher first.");return;}if(!confirm(`${enabled?"Enable":"Disable"} Student Portfolio access for ${className}?`))return;
  const expiry=document.getElementById(`ctpExpiry_${CTP_CLASSES.indexOf(className)}`)?.value||null;
  try{await ctpRpc(ctpDb("admin"),"portfolio_admin_set_access",{p_class_name:className,p_staff_id:teacher?.staff_id||null,p_staff_name:teacher?.staff_name||null,p_enabled:enabled,p_expires_at:expiry?new Date(expiry).toISOString():null});await ctpLoadAdminAccess();alert(enabled?`Access enabled for ${teacher.staff_name}.`:"Access disabled immediately.");}
  catch(error){alert("Access could not be changed: "+(error.message||"Unknown error"));}
}
async function ctpSetAllAccess(enabled){
  if(!studentAdminSession)return;if(!ctpAdminAssignments.length){alert("Class Teacher assignments are not loaded. Press Refresh first.");return;}const assigned=CTP_CLASSES.map(className=>({className,teacher:ctpAdminAssignments.find(r=>r.class_name===className),row:ctpAdminAccess.find(r=>r.class_name===className)})).filter(item=>enabled?!!item.teacher:!!(item.teacher||item.row));if(!assigned.length){alert(enabled?"No Class Teacher is assigned.":"No Portfolio access record is available.");return;}const expiryValue=document.getElementById("ctpBulkExpiry")?.value||"",expiry=enabled&&expiryValue?new Date(expiryValue).toISOString():null;if(!confirm(`${enabled?"Turn ON":"Turn OFF"} Portfolio Access for ${assigned.length} Class(es)?${enabled&&expiry?"\n\nThe common expiry will apply to all.":""}`))return;
  const on=document.getElementById("ctpBulkOnBtn"),off=document.getElementById("ctpBulkOffBtn"),status=document.getElementById("ctpBulkStatus");if(on)on.disabled=true;if(off)off.disabled=true;let completed=0;
  try{for(const item of assigned){const identity=item.teacher||item.row;status.textContent=`Updating ${item.className}... (${completed}/${assigned.length})`;await ctpRpc(ctpDb("admin"),"portfolio_admin_set_access",{p_class_name:item.className,p_staff_id:identity?.staff_id||null,p_staff_name:identity?.staff_name||null,p_enabled:enabled,p_expires_at:expiry});completed++;}status.textContent=`✓ ${completed} Class(es) ${enabled?"enabled":"disabled"} successfully.`;await ctpLoadAdminAccess();alert(`${completed} Class(es) Portfolio Access ${enabled?"turned ON":"turned OFF"} successfully.`);}catch(error){status.textContent=`Stopped after ${completed} Class(es): ${error.message||"Unknown error"}`;alert("Bulk access update could not finish: "+(error.message||"Unknown error"));}finally{if(on)on.disabled=false;if(off)off.disabled=false;}
}
function ctpRenderAudit(rows){const host=document.getElementById("ctpAdminAuditHost");if(!host)return;if(!rows.length){host.innerHTML='<div class="ctp-spinner">No portfolio updates yet.</div>';return;}host.innerHTML=`<div class="ctp-audit-toolbar"><label><input id="ctpAuditSelectAll" type="checkbox" onchange="ctpToggleAllAudit(this.checked)"> Select All</label><span id="ctpAuditSelectedCount">0 selected</span><button type="button" class="ctp-audit-delete" onclick="ctpClearAuditSelection()">Clear Selection</button><button id="ctpAuditDeleteSelected" type="button" class="ctp-audit-delete" onclick="ctpDeleteSelectedAudit()" disabled>🗑 Delete Selected</button></div>`+rows.map(r=>`<div class="ctp-audit-row"><label class="ctp-audit-check" title="Select this update"><input class="ctp-audit-checkbox" type="checkbox" value="${Number(r.id)}" onchange="ctpUpdateAuditSelection()"></label><div><strong>${ctpEsc(r.actor_name||r.actor_staff_id||"Admin")}</strong> — ${ctpEsc(r.action_label||r.action_type)}<br><span style="color:#667085">${ctpEsc(r.student_name||r.student_id||r.class_name||"")} • ${new Date(r.created_at).toLocaleString()}</span></div><button type="button" class="ctp-audit-delete" onclick="ctpDeleteAudit(${Number(r.id)})">🗑 Delete</button></div>`).join("");}
async function ctpDeleteAudit(id){if(!studentAdminSession)return;if(!confirm("Delete only this Portfolio Update record?"))return;try{await ctpRpc(ctpDb("admin"),"portfolio_admin_delete_audit",{p_audit_id:Number(id)});await ctpLoadAdminAccess();}catch(error){alert("History record could not be deleted: "+(error.message||"Unknown error"));}}
function ctpSelectedAuditIds(){return [...document.querySelectorAll(".ctp-audit-checkbox:checked")].map(box=>Number(box.value)).filter(Number.isFinite);}
function ctpUpdateAuditSelection(){const all=[...document.querySelectorAll(".ctp-audit-checkbox")],selected=ctpSelectedAuditIds(),count=document.getElementById("ctpAuditSelectedCount"),button=document.getElementById("ctpAuditDeleteSelected"),master=document.getElementById("ctpAuditSelectAll");if(count)count.textContent=`${selected.length} selected`;if(button)button.disabled=!selected.length;if(master){master.checked=!!all.length&&selected.length===all.length;master.indeterminate=selected.length>0&&selected.length<all.length;}}
function ctpToggleAllAudit(checked){document.querySelectorAll(".ctp-audit-checkbox").forEach(box=>box.checked=checked);ctpUpdateAuditSelection();}
function ctpClearAuditSelection(){document.querySelectorAll(".ctp-audit-checkbox").forEach(box=>box.checked=false);ctpUpdateAuditSelection();}
async function ctpDeleteSelectedAudit(){const ids=ctpSelectedAuditIds();if(!ids.length)return;if(!confirm(`Delete ${ids.length} selected Portfolio Update record(s)?\n\nOnly the selected history records will be removed.`))return;const button=document.getElementById("ctpAuditDeleteSelected");if(button){button.disabled=true;button.textContent="Deleting...";}let deleted=0;try{for(const id of ids){await ctpRpc(ctpDb("admin"),"portfolio_admin_delete_audit",{p_audit_id:id});deleted++;}await ctpLoadAdminAccess();alert(`${deleted} selected Portfolio Update record(s) deleted.`);}catch(error){alert(`Deleted ${deleted} record(s), then stopped: ${error.message||"Unknown error"}`);await ctpLoadAdminAccess();}}
const ctpPreviousOpenWebsiteAdmin=openWebsiteAdminPanel;openWebsiteAdminPanel=function(){const result=ctpPreviousOpenWebsiteAdmin();setTimeout(ctpEnsureAdminTab,0);return result;};
/* Changing a Class Teacher immediately revokes the old teacher. Admin then
   deliberately turns access ON for the newly assigned teacher. */
const ctpPreviousSaveClassTeacher=umeSaveClassTeacherAssignment;
umeSaveClassTeacherAssignment=async function(index){
  const className=UME_CLASSES[index],before=(umeAdminClassTeachers||[]).find(r=>r.class_name===className)?.staff_id||"";
  await ctpPreviousSaveClassTeacher(index);
  try{
    const teachers=await ctpRpc(ctpDb("admin"),"ume_get_class_teachers"),current=(teachers||[]).find(r=>r.class_name===className);
    if(current&&current.staff_id!==before&&CTP_CLASSES.includes(className)){
      await ctpRpc(ctpDb("admin"),"portfolio_admin_set_access",{p_class_name:className,p_staff_id:current.staff_id,p_staff_name:current.staff_name,p_enabled:false,p_expires_at:null});
    }
  }catch(error){console.error("Portfolio access assignment sync:",error);}
};
document.addEventListener("DOMContentLoaded",()=>{ctpEnsureAdminTab();ctpEnsureDashboardButton();});
/* Apply the same 300 KB optimizer to the existing Admin photo uploader. */
compressStudentPhoto=ctpCompressPhoto;

/* ===== SOURCE SCRIPT BLOCK: ctp-standard-list-countdown-js ===== */
let ctpCountdownTimer=null,ctpDashboardAccess=null,ctpVerifyTick=0;
function ctpRemainingText(ms){if(ms<=0)return "00 मिनेट 00 सेकेन्ड";const total=Math.floor(ms/1000),d=Math.floor(total/86400),h=Math.floor((total%86400)/3600),m=Math.floor((total%3600)/60),s=total%60;return `${d?d+" दिन ":""}${String(h).padStart(2,"0")} घण्टा ${String(m).padStart(2,"0")} मिनेट ${String(s).padStart(2,"0")} सेकेन्ड`;}
function ctpPaintCountdown(){
  const selected=document.getElementById("ctpTeacherClass")?.value,access=(ctpMyAccess||[]).find(r=>r.class_name===selected)||ctpDashboardAccess,banner=document.getElementById("ctpAccessBanner"),detail=document.querySelector("#staffDashboardPortfolioAction small"),popupOpen=document.getElementById("ctpTeacherPopup")?.style.display==="flex";
  if(!access||!ctpActiveAccess(access)){if(popupOpen&&banner){banner.className="ctp-banner off";banner.textContent=access?.expires_at?"⛔ Portfolio Access Expired":"Portfolio Access Disabled by Admin";document.querySelectorAll("#ctpTeacherPopup .ctp-btn").forEach(b=>b.disabled=true);}if(detail)detail.textContent="Access disabled or expired";return;}
  if(!access.expires_at){if(popupOpen&&banner){banner.className="ctp-banner";banner.textContent=`✓ Portfolio Access Active — ${access.class_name} • No Expiry`;}if(detail)detail.textContent=`${access.class_name} • Access Active — No Expiry`;return;}
  const ms=new Date(access.expires_at)-Date.now(),remaining=ctpRemainingText(ms),urgent=ms<=600000,warning=ms<=3600000;
  if(popupOpen&&banner){banner.className=`ctp-banner ${urgent?"urgent":warning?"warning":""}`;banner.innerHTML=`⏳ <strong>${ctpEsc(access.class_name)} Access Time Remaining:</strong> ${remaining}<br><small>Access समाप्त हुने समय: ${new Date(access.expires_at).toLocaleString()}</small>`;}
  if(detail)detail.textContent=`${access.class_name} • बाँकी ${remaining}`;
}
function ctpStartCountdown(){if(ctpCountdownTimer)clearInterval(ctpCountdownTimer);ctpPaintCountdown();ctpCountdownTimer=setInterval(()=>{ctpPaintCountdown();if(++ctpVerifyTick%30===0)ctpRefreshDashboardAccess(false);},1000);}
async function ctpRefreshDashboardAccess(startTimer=true){if(!loggedInStaff||!staffAuthSession)return;try{ctpMyAccess=await ctpRpc(ctpDb(),"portfolio_get_my_access")||[];ctpDashboardAccess=ctpMyAccess.find(ctpActiveAccess)||ctpMyAccess[0]||null;if(startTimer)ctpStartCountdown();else ctpPaintCountdown();}catch(_error){ctpDashboardAccess=null;ctpPaintCountdown();}}
ctpOpenTeacher=async function(){
  if(!loggedInStaff||!staffAuthSession){openStaffLogin();return;}const popup=document.getElementById("ctpTeacherPopup");popup.style.display="flex";document.body.style.overflow="hidden";ctpClearMsg();ctpBackToList(false);document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">Checking secure access...</div>';
  try{ctpMyAccess=await ctpRpc(ctpDb(),"portfolio_get_my_access")||[];const active=ctpMyAccess.filter(ctpActiveAccess),select=document.getElementById("ctpTeacherClass");select.innerHTML=active.map(r=>`<option value="${ctpEsc(r.class_name)}">${ctpEsc(r.class_name)}</option>`).join("");ctpDashboardAccess=active[0]||ctpMyAccess[0]||null;if(!active.length){ctpPaintCountdown();document.getElementById("ctpTeacherStudents").innerHTML='<div class="ctp-spinner">You currently cannot edit any class portfolio.</div>';return;}ctpStartCountdown();await ctpLoadTeacherStudents();}catch(error){document.getElementById("ctpAccessBanner").className="ctp-banner off";document.getElementById("ctpAccessBanner").textContent="Portfolio access could not be verified.";ctpMsg(error.message||"Could not open portfolio.");}
};
const ctpOriginalLoadTeacherStudents=ctpLoadTeacherStudents;
ctpLoadTeacherStudents=async function(){await ctpOriginalLoadTeacherStudents();ctpPaintCountdown();};
ctpRenderTeacherStudents=function(){const host=document.getElementById("ctpTeacherStudents"),q=(document.getElementById("ctpTeacherSearch")?.value||"").trim().toLowerCase(),rows=(ctpMyStudents||[]).filter(s=>!q||String(s.name).toLowerCase().includes(q)||String(s.student_id).toLowerCase().includes(q));host.innerHTML=rows.map((s,i)=>`<article class="ctp-student"><div class="ctp-roll">${i+1}</div><div style="min-width:0"><strong>${ctpEsc(s.name)}</strong><small>${ctpEsc(s.student_id)} • ${ctpEsc(s.class_name)}</small></div><button type="button" class="ctp-btn light" onclick="ctpEditStudent('${ctpEsc(s.student_id)}')">✏️ EDIT</button></article>`).join("")||'<div class="ctp-spinner">No students found.</div>';};
function ctpBackToList(scroll=true){ctpEditingStudent=null;document.getElementById("ctpTeacherEditor")?.classList.add("ctp-hidden");document.querySelector("#ctpTeacherPopup .ctp-toolbar")?.classList.remove("ctp-hidden");document.getElementById("ctpTeacherStudents")?.classList.remove("ctp-hidden");if(scroll)document.getElementById("ctpTeacherStudents")?.scrollIntoView({behavior:"smooth",block:"start"});}
async function ctpSetPreview(hostId,studentId,type,month=null){const host=document.getElementById(hostId);if(!host)return;const url=await cloudSignedUrl(cloudPath(studentId,type,month),900);if(host.tagName==="IMG"){if(url){host.src=url;host.style.display="block";host.parentElement?.querySelector(".student-photo-missing")?.style.setProperty("display","none");}else{host.style.display="none";host.parentElement?.querySelector(".student-photo-missing")?.style.setProperty("display","flex");}return;}host.innerHTML=url?`<img src="${ctpEsc(url)}" alt="${type==='profile'?'Student photo':`Month ${month} photo`}">`:(type==="profile"?"👤":"Photo not uploaded");}
async function ctpLoadEditorPhotos(s){await Promise.all([ctpSetPreview("ctpProfilePreview",s.student_id,"profile"),...Array.from({length:12},(_,i)=>ctpSetPreview(`ctpMonthPreview${i+1}`,s.student_id,"month",i+1))]);}
ctpEditStudent=function(studentId){
  const s=ctpMyStudents.find(row=>row.student_id===studentId);if(!s)return;ctpEditingStudent=s;ctpClearMsg();document.querySelector("#ctpTeacherPopup .ctp-toolbar")?.classList.add("ctp-hidden");document.getElementById("ctpTeacherStudents")?.classList.add("ctp-hidden");const host=document.getElementById("ctpTeacherEditor");host.classList.remove("ctp-hidden");
  host.innerHTML=`<button type="button" class="ctp-btn light" onclick="ctpBackToList()">← Back to ${ctpEsc(s.class_name)} Student List</button><div class="ctp-profile-head"><div id="ctpProfilePreview" class="ctp-profile-photo">👤</div><div><h3 style="margin:0 0 5px">${ctpEsc(s.name)}</h3><div style="color:#667085">${ctpEsc(s.student_id)} • ${ctpEsc(s.class_name)}</div><button class="ctp-btn" style="margin-top:10px" type="button" onclick="ctpChoosePhoto('profile')">📷 Upload / Replace Profile Photo</button></div></div><div class="ctp-form"><label>Student Name<input id="ctpEditName" value="${ctpEsc(s.name)}" maxlength="120"></label><label>Date of Birth (B.S.)<input id="ctpEditDob" type="text" inputmode="text" maxlength="10" placeholder="2076-03-02" value="${ctpEsc(s.dob||"")}"></label><label style="grid-column:1/-1">Parent / Guardian Name<input id="ctpEditGuardian" value="${ctpEsc(s.guardian||"")}" maxlength="160"></label><div class="ctp-form-actions"><button type="button" class="ctp-btn green" onclick="ctpSaveStudent()">✓ Save Information</button><button type="button" class="ctp-btn light" onclick="ctpBackToList()">Cancel</button></div></div><h3 style="margin:22px 0 6px">📊 Monthly Progress Photos</h3><div class="ctp-photo-actions">${Array.from({length:12},(_,i)=>`<div class="ctp-photo-card"><strong>Month ${i+1}</strong><div id="ctpMonthPreview${i+1}" class="ctp-month-preview">Loading...</div><button class="ctp-btn light" type="button" onclick="ctpChoosePhoto('month',${i+1})">Upload / Replace</button></div>`).join("")}</div><div class="ctp-file-note">JPG, PNG or WebP • Maximum saved size 300 KB • Upload/replace only; deletion is not available.</div>`;ctpLoadEditorPhotos(s);ctpPaintCountdown();host.scrollIntoView({behavior:"smooth",block:"start"});
};
ctpSaveStudent=async function(){if(!ctpEditingStudent)return;const name=document.getElementById("ctpEditName").value.trim(),dob=document.getElementById("ctpEditDob").value.trim(),guardian=document.getElementById("ctpEditGuardian").value.trim();if(!name){ctpMsg("Student name is required.");return;}if(dob&&!/^\d{4}-\d{2}-\d{2}$/.test(dob)){ctpMsg("B.S. Date of Birth must use Year-Month-Day, for example 2076-03-02.");return;}if(!confirm(`Save changes for ${ctpEditingStudent.name}?`))return;try{await ctpRpc(ctpDb(),"portfolio_update_student",{p_student_id:ctpEditingStudent.student_id,p_name:name,p_dob:dob||null,p_guardian:guardian||null});ctpMsg("✓ Student information updated successfully.","success");ctpEditingStudent={...ctpEditingStudent,name,dob,guardian};await ctpLoadTeacherStudents();ctpBackToList(false);}catch(error){ctpMsg(error.message||"Student information could not be updated.");}};
const ctpOriginalUploadPhoto=ctpUploadPhoto;ctpUploadPhoto=async function(file,type,month){await ctpOriginalUploadPhoto(file,type,month);if(ctpEditingStudent)await ctpLoadEditorPhotos(ctpEditingStudent);};
const ctpOriginalEnsureDashboardButton=ctpEnsureDashboardButton;ctpEnsureDashboardButton=function(){ctpOriginalEnsureDashboardButton();const detail=document.querySelector("#staffDashboardPortfolioAction small");if(detail&&detail.textContent.includes("Available only"))detail.textContent="Checking access and remaining time...";ctpRefreshDashboardAccess();};

/* ===== SOURCE SCRIPT BLOCK: class-6-10-full-portfolio-js ===== */
const CTP_UPPER_CLASSES=["Class 6","Class 7","Class 8","Class 9","Class 10"];
CTP_UPPER_CLASSES.forEach(c=>{if(!CTP_CLASSES.includes(c))CTP_CLASSES.push(c);});
let ctpUpperLoginTarget=null,ctpUpperLoginFailures=0,ctpAdminUpperProfile=null;

function ctpEnsureUpperAddButton(){const toolbar=document.querySelector("#ctpTeacherPopup .ctp-toolbar");if(!toolbar||document.getElementById("ctpUpperAddBtn"))return;const b=document.createElement("button");b.id="ctpUpperAddBtn";b.type="button";b.className="ctp-btn green";b.textContent="+ ADD STUDENT";b.onclick=ctpShowUpperAddForm;toolbar.appendChild(b);}
function ctpUpdateUpperAddButton(){ctpEnsureUpperAddButton();const b=document.getElementById("ctpUpperAddBtn"),className=document.getElementById("ctpTeacherClass")?.value;if(b)b.style.display=CTP_UPPER_CLASSES.includes(className)?"block":"none";}
const ctpUpperPreviousLoad=ctpLoadTeacherStudents;ctpLoadTeacherStudents=async function(){await ctpUpperPreviousLoad();ctpUpdateUpperAddButton();};
function ctpShowUpperAddForm(){
  const className=document.getElementById("ctpTeacherClass")?.value;if(!CTP_UPPER_CLASSES.includes(className))return;ctpEditingStudent=null;document.querySelector("#ctpTeacherPopup .ctp-toolbar")?.classList.add("ctp-hidden");document.getElementById("ctpTeacherStudents")?.classList.add("ctp-hidden");const host=document.getElementById("ctpTeacherEditor");host.classList.remove("ctp-hidden");host.innerHTML=`<button class="ctp-btn light" onclick="ctpBackToList()">← Back to ${ctpEsc(className)} Student List</button><h3>➕ Add New Student — ${ctpEsc(className)}</h3><div class="ctp-form"><label>Student ID<input id="ctpAddUpperId" maxlength="24" placeholder="Example: G6001"></label><label>Student Name<input id="ctpAddUpperName" maxlength="140"></label><label>Initial Portfolio Password<input id="ctpAddUpperPassword" type="password" minlength="6" autocomplete="new-password" placeholder="Minimum 6 characters"></label><label>Date of Birth (B.S.)<input id="ctpAddUpperDob" type="text" inputmode="text" maxlength="10" placeholder="2076-03-02"></label><label style="grid-column:1/-1">Parent / Guardian Name<input id="ctpAddUpperGuardian" maxlength="160"></label><div class="ctp-form-actions"><button class="ctp-btn green" onclick="ctpAddUpperStudent()">✓ ADD STUDENT</button><button class="ctp-btn light" onclick="ctpBackToList()">Cancel</button></div></div><div class="ctp-file-note">The Class Teacher sets the initial password once. Only Admin can reset it later.</div>`;host.scrollIntoView({behavior:"smooth",block:"start"});
}
async function ctpAddUpperStudent(){
  const className=document.getElementById("ctpTeacherClass").value,id=document.getElementById("ctpAddUpperId").value.trim().toUpperCase(),name=document.getElementById("ctpAddUpperName").value.trim().toUpperCase(),password=document.getElementById("ctpAddUpperPassword").value,dob=document.getElementById("ctpAddUpperDob").value.trim(),guardian=document.getElementById("ctpAddUpperGuardian").value.trim();
  if(!/^[A-Z0-9-]{2,24}$/.test(id)){ctpMsg("Student ID must use 2–24 letters, numbers or hyphens.");return;}if(!name){ctpMsg("Student name is required.");return;}if(password.length<6){ctpMsg("Initial password must have at least 6 characters.");return;}if(dob&&!/^\d{4}-\d{2}-\d{2}$/.test(dob)){ctpMsg("B.S. DOB must use YYYY-MM-DD, for example 2076-03-02.");return;}if(!confirm(`Add ${name} to ${className}?`))return;
  try{await ctpRpc(ctpDb(),"portfolio_add_upper_student",{p_student_id:id,p_name:name,p_class_name:className,p_password:password,p_dob:dob||null,p_guardian:guardian||null});ctpMsg("✓ Student added to Portfolio and Marks Roster successfully.","success");await ctpLoadTeacherStudents();ctpBackToList(false);}catch(error){ctpMsg(error.message||"Student could not be added.");}
}

showUpperClassPublicRoster=async function(className){
  document.getElementById("studentClassView").style.display="none";const roll=document.getElementById("studentRollView");roll.style.display="block";roll.innerHTML=`<button class="student-back-btn" onclick="backToStudentClasses()">← Back to Classes</button><h2 class="student-portfolio-title">🎓 ${ctpEsc(className)} - Student Portfolio</h2><div class="student-grid"><div class="ctp-spinner">Loading students...</div></div>`;
  try{const {data,error}=await initStudentSupabase().rpc("portfolio_list_public_upper_students");if(error)throw error;const rows=(data||[]).filter(r=>r.class_name===className);roll.querySelector(".student-grid").innerHTML=rows.map((r,i)=>`<button class="student-roll-btn" onclick="ctpOpenUpperPortfolio('${ctpEsc(r.student_id)}','${ctpEsc(r.class_name)}',${r.password_ready?"true":"false"})">${i+1}. ${ctpEsc(r.name)}${r.password_ready?"":" 🔒"}</button>`).join("")||'<div class="ctp-spinner">No students found.</div>';}catch(error){roll.querySelector(".student-grid").innerHTML='<div class="ctp-spinner">Student list could not be loaded.</div>';}
};
async function ctpOpenUpperPortfolio(studentId,className,passwordReady){
  if(studentAdminSession){try{const rows=await ctpRpc(ctpDb("admin"),"portfolio_admin_get_upper_profile",{p_student_id:studentId});if(rows?.[0])ctpRenderUpperPublicProfile(rows[0]);}catch(error){alert(error.message);}return;}
  if(!passwordReady){alert("This student's Portfolio password has not been set yet. Please contact the Admin.");return;}ctpUpperLoginTarget={studentId,className};document.getElementById("ctpUpperPasswordTitle").textContent=`${studentId} — Enter Portfolio password`;document.getElementById("ctpUpperPasswordInput").value="";document.getElementById("ctpUpperPasswordMessage").className="ctp-message";document.getElementById("ctpUpperPasswordPopup").style.display="flex";document.body.style.overflow="hidden";setTimeout(()=>document.getElementById("ctpUpperPasswordInput").focus(),100);
}
function ctpCloseUpperPassword(){document.getElementById("ctpUpperPasswordPopup").style.display="none";document.body.style.overflow="hidden";}
async function ctpCheckUpperPassword(){const box=document.getElementById("ctpUpperPasswordMessage"),password=document.getElementById("ctpUpperPasswordInput").value;if(!password||!ctpUpperLoginTarget)return;try{const rows=await ctpRpc(initStudentSupabase(),"portfolio_upper_student_login",{p_student_id:ctpUpperLoginTarget.studentId,p_password:password});if(!rows?.length){ctpUpperLoginFailures++;box.textContent=`Incorrect password. ${Math.max(0,5-ctpUpperLoginFailures)} attempt(s) remaining.`;box.className="ctp-message show error";if(ctpUpperLoginFailures>=5){ctpUpperLoginFailures=0;document.getElementById("ctpUpperPasswordInput").disabled=true;setTimeout(()=>document.getElementById("ctpUpperPasswordInput").disabled=false,30000);}return;}ctpUpperLoginFailures=0;ctpCloseUpperPassword();ctpRenderUpperPublicProfile(rows[0]);}catch(error){box.textContent=error.message||"Portfolio could not be opened.";box.className="ctp-message show error";}}
function ctpRenderUpperPublicProfile(s){
  const roll=document.getElementById("studentRollView");activeStudentPortfolio={className:s.class_name,studentId:s.student_id};const months=Array.from({length:12},(_,i)=>`<div class="student-photo-item"><img id="ctpPublicMonth${i+1}" alt="Month ${i+1}" onclick="openStudentPhotoGallery('${ctpEsc(s.student_id)}',${i})"><div class="student-photo-missing">Month ${i+1}<br>Photo not uploaded yet</div><span class="student-month-label">Month ${i+1}</span></div>`).join("");roll.innerHTML=`<button class="student-back-btn" onclick="showUpperClassPublicRoster('${ctpEsc(s.class_name)}')">← Back to ${ctpEsc(s.class_name)}</button><h2 class="student-portfolio-title">🎓 ${ctpEsc(s.name)}</h2><div class="student-profile"><div id="ctpPublicProfile" class="ctp-profile-photo" style="margin:0 auto 15px">👤</div><h3>${ctpEsc(s.name)}</h3><div class="student-profile-row"><strong>Student ID:</strong> ${ctpEsc(s.student_id)}</div><div class="student-profile-row"><strong>Student Name:</strong> ${ctpEsc(s.name)}</div><div class="student-profile-row"><strong>Class:</strong> ${ctpEsc(s.class_name)}</div><div class="student-profile-row"><strong>Date of Birth (B.S.):</strong> ${ctpEsc(s.dob||"To be updated")}</div><div class="student-profile-row"><strong>Parent / Guardian:</strong> ${ctpEsc(s.guardian||"To be updated")}</div><div class="student-photo-gallery"><h4>📊 Monthly Progress Photos</h4><div class="student-photo-grid">${months}</div></div></div>`;ctpSetPreview("ctpPublicProfile",s.student_id,"profile");Array.from({length:12},(_,i)=>ctpSetPreview(`ctpPublicMonth${i+1}`,s.student_id,"month",i+1));
}

function ctpEnhanceUpperAdminRows(){document.querySelectorAll('#adminStudentList button[onclick^="umeOpenAdminUpperStudentEdit"]').forEach(button=>{if(button.parentElement.querySelector(".ctp-upper-manage"))return;const match=button.getAttribute("onclick").match(/'([^']+)'/);if(!match)return;const manage=document.createElement("button");manage.type="button";manage.className="ctp-upper-manage";manage.textContent="Portfolio / Password";manage.onclick=()=>ctpAdminOpenUpperProfile(match[1]);button.parentElement.insertBefore(manage,button);});}
const ctpUpperPreviousRenderAdmin=renderAdminStudentList;renderAdminStudentList=function(){const result=ctpUpperPreviousRenderAdmin();setTimeout(ctpEnhanceUpperAdminRows,100);return result;};
async function ctpAdminOpenUpperProfile(studentId){try{const rows=await ctpRpc(ctpDb("admin"),"portfolio_admin_get_upper_profile",{p_student_id:studentId});if(!rows?.[0])throw new Error("Student profile not found.");ctpAdminUpperProfile=rows[0];const s=rows[0],body=document.getElementById("ctpUpperAdminBody");body.innerHTML=`<div class="ctp-profile-head"><div id="ctpAdminUpperPhoto" class="ctp-profile-photo">👤</div><div><h3>${ctpEsc(s.name)}</h3><div>${ctpEsc(s.student_id)} • ${ctpEsc(s.class_name)}</div><button class="ctp-btn" style="margin-top:10px" onclick="ctpAdminUpperPhotoUpload('profile')">📷 Upload / Replace Photo</button></div></div><div class="ctp-form"><label>Student Name<input id="ctpAdminUpperName" value="${ctpEsc(s.name)}"></label><label>Date of Birth (B.S.)<input id="ctpAdminUpperDob" value="${ctpEsc(s.dob||"")}" placeholder="2076-03-02"></label><label style="grid-column:1/-1">Parent / Guardian<input id="ctpAdminUpperGuardian" value="${ctpEsc(s.guardian||"")}"></label><label style="grid-column:1/-1">New Password (leave blank to keep current)<input id="ctpAdminUpperPassword" type="password" minlength="6" autocomplete="new-password" placeholder="Minimum 6 characters"></label><div class="ctp-form-actions"><button class="ctp-btn green" onclick="ctpAdminSaveUpperProfile()">✓ SAVE / RESET PASSWORD</button><button class="ctp-btn" style="background:#b42318" onclick="ctpAdminDeleteUpperProfile()">🗑 DELETE STUDENT</button></div></div><h3>Monthly Progress Photos</h3><div class="ctp-photo-actions">${Array.from({length:12},(_,i)=>`<div class="ctp-photo-card"><strong>Month ${i+1}</strong><div id="ctpAdminUpperMonth${i+1}" class="ctp-month-preview">Loading...</div><button class="ctp-btn light" onclick="ctpAdminUpperPhotoUpload('month',${i+1})">Upload / Replace</button></div>`).join("")}</div>`;document.getElementById("ctpUpperAdminPopup").style.display="flex";document.body.style.overflow="hidden";ctpSetPreview("ctpAdminUpperPhoto",s.student_id,"profile");Array.from({length:12},(_,i)=>ctpSetPreview(`ctpAdminUpperMonth${i+1}`,s.student_id,"month",i+1));}catch(error){alert(error.message||"Profile could not be opened.");}}
function ctpCloseUpperAdmin(){document.getElementById("ctpUpperAdminPopup").style.display="none";document.body.style.overflow="hidden";ctpAdminUpperProfile=null;}
async function ctpAdminSaveUpperProfile(){if(!ctpAdminUpperProfile)return;const name=document.getElementById("ctpAdminUpperName").value.trim(),dob=document.getElementById("ctpAdminUpperDob").value.trim(),guardian=document.getElementById("ctpAdminUpperGuardian").value.trim(),password=document.getElementById("ctpAdminUpperPassword").value;if(!name)return;if(dob&&!/^\d{4}-\d{2}-\d{2}$/.test(dob)){alert("Use B.S. DOB format YYYY-MM-DD.");return;}if(password&&password.length<6){alert("Password needs at least 6 characters.");return;}if(!confirm("Save student details"+(password?" and reset password?":"?")))return;try{await ctpRpc(ctpDb("admin"),"portfolio_admin_save_upper_profile",{p_student_id:ctpAdminUpperProfile.student_id,p_name:name,p_dob:dob||null,p_guardian:guardian||null,p_new_password:password||null});alert("Student Portfolio updated successfully.");ctpCloseUpperAdmin();renderAdminStudentList();}catch(error){alert(error.message||"Save failed.");}}
async function ctpAdminDeleteUpperProfile(){if(!ctpAdminUpperProfile||!confirm(`Delete ${ctpAdminUpperProfile.name} from active Roster and Portfolio?\n\nSubmitted Marks will remain preserved.`))return;try{await ctpRpc(ctpDb("admin"),"portfolio_admin_delete_upper_student",{p_student_id:ctpAdminUpperProfile.student_id});alert("Student removed. Submitted Marks remain preserved.");ctpCloseUpperAdmin();if(typeof umeLoadAdminUpperStudents==="function")await umeLoadAdminUpperStudents();renderAdminStudentList();}catch(error){alert(error.message||"Delete failed.");}}
umeDeleteAdminUpperStudent=async function(studentId){await ctpAdminOpenUpperProfile(studentId);};
function ctpAdminUpperPhotoUpload(type,month=null){if(!ctpAdminUpperProfile)return;const picker=document.createElement("input");picker.type="file";picker.accept="image/jpeg,image/png,image/webp";picker.style.display="none";document.body.appendChild(picker);picker.onchange=async()=>{const file=picker.files?.[0];try{if(file){const blob=await ctpCompressPhoto(file),path=cloudPath(ctpAdminUpperProfile.student_id,type,month),{error}=await ctpDb("admin").storage.from(STUDENT_STORAGE_CONFIG.bucket).upload(path,blob,{contentType:"image/jpeg",cacheControl:"3600",upsert:true});if(error)throw error;studentSignedUrlCache.clear();await ctpAdminOpenUpperProfile(ctpAdminUpperProfile.student_id);}}catch(error){alert("Upload failed: "+(error.message||"Unknown error"));}finally{picker.remove();}};picker.click();}
document.addEventListener("DOMContentLoaded",ctpEnsureUpperAddButton);

/* ===== SOURCE SCRIPT BLOCK: ctp-draft-save-js ===== */
const ctpTeacherDraftPhotos=new Map(),ctpAdminUpperDraftPhotos=new Map(),ctpAdminLowerDraftPhotos=new Map();
function ctpDraftKey(studentId,type,month){return `${studentId}|${type}|${month||0}`;}
function ctpClearDraftMap(map){for(const item of map.values())if(item.previewUrl)URL.revokeObjectURL(item.previewUrl);map.clear();}
function ctpSetDraft(map,item){const key=ctpDraftKey(item.studentId,item.type,item.month),old=map.get(key);if(old?.previewUrl)URL.revokeObjectURL(old.previewUrl);item.previewUrl=URL.createObjectURL(item.blob);map.set(key,item);return item.previewUrl;}
async function ctpPickDraftPhoto(map,studentId,type,month,onPreview){const picker=document.createElement("input");picker.type="file";picker.accept="image/jpeg,image/png,image/webp";picker.style.display="none";document.body.appendChild(picker);picker.onchange=async()=>{try{const file=picker.files?.[0];if(!file)return;const blob=await ctpCompressPhoto(file),url=ctpSetDraft(map,{studentId,type,month,blob});onPreview(url);ctpMsg("Photo selected as draft. Press Save All Changes to upload it.","success");}catch(error){ctpMsg(error.message||"Photo could not be prepared.");}finally{picker.remove();}};picker.click();}
function ctpPreviewHost(hostId,url){const host=document.getElementById(hostId);if(host)host.innerHTML=`<img src="${url}" alt="Selected draft photo"><span class="ctp-draft-badge" style="position:absolute">DRAFT</span>`;}
async function ctpUploadDrafts(map,db){
  const items=[...map.values()];for(let i=0;i<items.length;i++){const item=items[i],path=cloudPath(item.studentId,item.type,item.month);ctpMsg(`Saving photo ${i+1} of ${items.length}...`,"success");const {error}=await db.storage.from(STUDENT_STORAGE_CONFIG.bucket).upload(path,item.blob,{contentType:"image/jpeg",cacheControl:"3600",upsert:true});if(error)throw error;await ctpRpc(db,"portfolio_log_photo_update",{p_student_id:item.studentId,p_photo_type:item.type,p_month_number:item.month});}studentSignedUrlCache.clear();
}

/* Class Teacher — details and every selected photo commit together on Save. */
ctpChoosePhoto=function(type,month=null){if(!ctpEditingStudent)return;ctpPickDraftPhoto(ctpTeacherDraftPhotos,ctpEditingStudent.student_id,type,month,url=>ctpPreviewHost(type==="profile"?"ctpProfilePreview":`ctpMonthPreview${month}`,url));};
const ctpDraftPreviousEdit=ctpEditStudent;ctpEditStudent=function(studentId){ctpClearDraftMap(ctpTeacherDraftPhotos);ctpDraftPreviousEdit(studentId);const save=document.querySelector("#ctpTeacherEditor .ctp-form-actions .green");if(save)save.textContent="✓ SAVE ALL CHANGES";};
ctpSaveStudent=async function(){
  if(!ctpEditingStudent)return;const s=ctpEditingStudent,name=document.getElementById("ctpEditName").value.trim(),dob=document.getElementById("ctpEditDob").value.trim(),guardian=document.getElementById("ctpEditGuardian").value.trim();if(!name){ctpMsg("Student name is required.");return;}if(dob&&!/^\d{4}-\d{2}-\d{2}$/.test(dob)){ctpMsg("B.S. DOB must use YYYY-MM-DD, for example 2076-03-02.");return;}if(!confirm(`Save all details and ${ctpTeacherDraftPhotos.size} selected photo(s) for ${s.name}?`))return;
  try{const db=ctpDb(),latest=await ctpRpc(db,"portfolio_get_my_access"),access=(latest||[]).find(r=>r.class_name===s.class_name);if(!ctpActiveAccess(access))throw new Error("Admin has disabled or expired your Portfolio Access.");await ctpRpc(db,"portfolio_update_student",{p_student_id:s.student_id,p_name:name,p_dob:dob||null,p_guardian:guardian||null});await ctpUploadDrafts(ctpTeacherDraftPhotos,db);ctpClearDraftMap(ctpTeacherDraftPhotos);ctpMsg("✓ All details and photos saved successfully.","success");await ctpLoadTeacherStudents();ctpBackToList(false);}catch(error){ctpMsg("Save incomplete: "+(error.message||"Unknown error"));}
};
const ctpDraftPreviousBack=ctpBackToList;ctpBackToList=function(scroll=true){if(ctpTeacherDraftPhotos.size&&!confirm("Discard selected photos that have not been saved?"))return;ctpClearDraftMap(ctpTeacherDraftPhotos);return ctpDraftPreviousBack(scroll);};
const ctpDraftPreviousClose=ctpCloseTeacher;ctpCloseTeacher=function(){if(ctpTeacherDraftPhotos.size&&!confirm("Close and discard selected photos that have not been saved?"))return;ctpClearDraftMap(ctpTeacherDraftPhotos);return ctpDraftPreviousClose();};

/* Class 6–10 Admin Manager — stage photos, then Save All. */
ctpAdminUpperPhotoUpload=function(type,month=null){if(!ctpAdminUpperProfile)return;ctpPickDraftPhoto(ctpAdminUpperDraftPhotos,ctpAdminUpperProfile.student_id,type,month,url=>ctpPreviewHost(type==="profile"?"ctpAdminUpperPhoto":`ctpAdminUpperMonth${month}`,url));};
const ctpDraftPreviousAdminOpen=ctpAdminOpenUpperProfile;ctpAdminOpenUpperProfile=async function(studentId){ctpClearDraftMap(ctpAdminUpperDraftPhotos);await ctpDraftPreviousAdminOpen(studentId);const save=document.querySelector("#ctpUpperAdminBody .ctp-form-actions .green");if(save)save.textContent="✓ SAVE ALL CHANGES";};
ctpAdminSaveUpperProfile=async function(){
  if(!ctpAdminUpperProfile)return;const s=ctpAdminUpperProfile,name=document.getElementById("ctpAdminUpperName").value.trim(),dob=document.getElementById("ctpAdminUpperDob").value.trim(),guardian=document.getElementById("ctpAdminUpperGuardian").value.trim(),password=document.getElementById("ctpAdminUpperPassword").value;if(!name)return;if(dob&&!/^\d{4}-\d{2}-\d{2}$/.test(dob)){alert("Use B.S. DOB format YYYY-MM-DD.");return;}if(password&&password.length<6){alert("Password needs at least 6 characters.");return;}if(!confirm(`Save all details${password?", reset password":""} and ${ctpAdminUpperDraftPhotos.size} selected photo(s)?`))return;
  try{const db=ctpDb("admin");await ctpRpc(db,"portfolio_admin_save_upper_profile",{p_student_id:s.student_id,p_name:name,p_dob:dob||null,p_guardian:guardian||null,p_new_password:password||null});await ctpUploadDrafts(ctpAdminUpperDraftPhotos,db);ctpClearDraftMap(ctpAdminUpperDraftPhotos);alert("All Student Portfolio changes saved successfully.");ctpCloseUpperAdmin();renderAdminStudentList();}catch(error){alert("Save incomplete: "+(error.message||"Unknown error"));}
};
const ctpDraftPreviousAdminClose=ctpCloseUpperAdmin;ctpCloseUpperAdmin=function(){if(ctpAdminUpperDraftPhotos.size&&!confirm("Discard selected photos that have not been saved?"))return;ctpClearDraftMap(ctpAdminUpperDraftPhotos);return ctpDraftPreviousAdminClose();};

/* Nursery–Class 5 Admin Portfolio — stage profile/month photos and show
   explicit Save/Cancel controls instead of uploading immediately. */
function ctpEnsureLowerAdminDraftActions(studentId){let box=document.getElementById("ctpLowerAdminDraftActions");if(!box){box=document.createElement("div");box.id="ctpLowerAdminDraftActions";box.className="ctp-draft-actions";document.querySelector("#studentRollView .student-profile")?.appendChild(box);}if(box)box.innerHTML=`<strong style="flex:1;min-width:180px">${ctpAdminLowerDraftPhotos.size} unsaved photo(s)</strong><button class="ctp-btn green" onclick="ctpSaveLowerAdminDrafts('${ctpEsc(studentId)}')">✓ SAVE PHOTO CHANGES</button><button class="ctp-btn light" onclick="ctpCancelLowerAdminDrafts()">Cancel</button>`;}
chooseStudentPortfolioPhoto=function(studentId,type,month=null){
  if(!studentAdminSession){openStudentAdminLogin();return;}ctpPickDraftPhoto(ctpAdminLowerDraftPhotos,studentId,type,month,url=>{if(type==="profile"){const img=document.getElementById("studentMainPhoto"),missing=document.getElementById("studentMainPhotoMissing");if(img){img.src=url;img.style.display="block";}if(missing)missing.style.display="none";}else{const img=document.querySelector(`[data-student-month-photo][data-month="${month}"]`),missing=img?.parentElement?.querySelector(".student-photo-missing");if(img){img.src=url;img.style.display="block";}if(missing)missing.style.display="none";}ctpEnsureLowerAdminDraftActions(studentId);});
};
async function ctpSaveLowerAdminDrafts(studentId){if(!ctpAdminLowerDraftPhotos.size)return;if(!confirm(`Upload and save ${ctpAdminLowerDraftPhotos.size} selected photo(s)?`))return;try{await ctpUploadDrafts(ctpAdminLowerDraftPhotos,ctpDb("admin"));ctpClearDraftMap(ctpAdminLowerDraftPhotos);uploadStatus("✓ All selected photos saved successfully.","success");if(activeStudentPortfolio)renderStudentProfile(activeStudentPortfolio.className,activeStudentPortfolio.studentId);}catch(error){uploadStatus("Save incomplete: "+(error.message||"Unknown error"),"error");}}
function ctpCancelLowerAdminDrafts(){if(ctpAdminLowerDraftPhotos.size&&!confirm("Discard all selected photos that have not been saved?"))return;ctpClearDraftMap(ctpAdminLowerDraftPhotos);if(activeStudentPortfolio)renderStudentProfile(activeStudentPortfolio.className,activeStudentPortfolio.studentId);}
const ctpDraftPreviousRenderProfile=renderStudentProfile;renderStudentProfile=function(className,studentId){ctpClearDraftMap(ctpAdminLowerDraftPhotos);return ctpDraftPreviousRenderProfile(className,studentId);};

/* ===== SOURCE SCRIPT BLOCK: student-portfolio-privacy-script ===== */
(function(){
    "use strict";

    let secureStudentPhotoOpen=false;
    let secureMonthNumber=null;
    let securityRefreshTimer=null;

    function secureEsc(value){
        return String(value==null?"":value)
            .replace(/[&<>"']/g,function(ch){
                return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch];
            });
    }

    function currentStudentPrivacyInfo(){
        const active=(typeof activeStudentPortfolio!=="undefined" && activeStudentPortfolio)
            ? activeStudentPortfolio
            : {};

        const studentId=String(active.studentId||"Student").trim();
        let className=String(active.className||"").trim();
        let studentName="";

        /* Prefer the name already visible in the opened profile. */
        const title=document.querySelector("#studentRollView .student-portfolio-title");
        if(title){
            studentName=title.textContent.replace(/^.*?🎓\s*/,"").trim();
        }

        if(!studentName){
            const nameRows=[...document.querySelectorAll("#studentRollView .student-profile-row")];
            const nameRow=nameRows.find(row=>/Student Name\s*:/i.test(row.textContent||""));
            if(nameRow){
                studentName=(nameRow.textContent||"").replace(/Student Name\s*:/i,"").trim();
            }
        }

        /* If the existing student record helper is available, use it as a fallback. */
        try{
            if((!studentName || !className) &&
               typeof getStudentRecord==="function" &&
               active.className && active.studentId){
                const record=getStudentRecord(active.className,active.studentId);
                if(record){
                    studentName=studentName || String(record.name||"").trim();
                    className=className || String(record.className||record.class_name||"").trim();
                }
            }
        }catch(_e){}

        return {
            studentId:studentId || "Student",
            studentName:studentName || "Student",
            className:className || ""
        };
    }

    function formattedPrivacyTime(){
        try{
            return new Intl.DateTimeFormat("en-GB",{
                timeZone:"Asia/Kathmandu",
                year:"numeric",
                month:"short",
                day:"2-digit",
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12:true
            }).format(new Date());
        }catch(_e){
            return new Date().toLocaleString();
        }
    }

    function watermarkShortText(){
        const info=currentStudentPrivacyInfo();
        return [
            "ST. AUGUSTINE • CONFIDENTIAL",
            `${info.studentName} • ${info.studentId}`,
            formattedPrivacyTime()
        ].join("\n");
    }

    function ensurePrivacyNote(){
        const gallery=document.querySelector("#studentRollView .student-photo-gallery");
        if(!gallery || gallery.querySelector(".student-secure-privacy-note")) return;

        const note=document.createElement("div");
        note.className="student-secure-privacy-note";
        note.innerHTML="🔒 <strong>Private Student Record:</strong> Photos are protected with a dynamic Student ID and date/time watermark. Unauthorized saving, sharing or reproduction is discouraged.";
        gallery.insertBefore(note,gallery.firstChild.nextSibling || gallery.firstChild);
    }

    function addThumbWatermark(host){
        if(!host || host.querySelector(":scope > .student-secure-thumb-watermark")) return;
        const mark=document.createElement("div");
        mark.className="student-secure-thumb-watermark";
        mark.setAttribute("aria-hidden","true");
        mark.dataset.watermark=watermarkShortText();
        host.appendChild(mark);
    }

    function refreshStudentThumbnailSecurity(){
        const root=document.getElementById("studentRollView");
        if(!root) return;

        ensurePrivacyNote();

        root.querySelectorAll(".student-photo-item").forEach(function(item){
            const img=item.querySelector("img");
            if(!img) return;
            img.setAttribute("draggable","false");
            img.setAttribute("oncontextmenu","return false;");
            addThumbWatermark(item);
        });

        const mainWrap=root.querySelector(".student-main-photo-wrap");
        if(mainWrap){
            const img=mainWrap.querySelector("img");
            if(img){
                img.setAttribute("draggable","false");
                img.setAttribute("oncontextmenu","return false;");
            }
            addThumbWatermark(mainWrap);
        }

        /* Class 6–10 public profile photo container. */
        const upperProfile=root.querySelector("#ctpPublicProfile");
        if(upperProfile){
            const img=upperProfile.querySelector("img");
            if(img){
                img.setAttribute("draggable","false");
                img.setAttribute("oncontextmenu","return false;");
            }
            addThumbWatermark(upperProfile);
        }

        root.querySelectorAll(".student-secure-thumb-watermark").forEach(function(mark){
            mark.dataset.watermark=watermarkShortText();
        });
    }

    function ensureLightboxWatermark(){
        const lightbox=document.getElementById("photoLightbox");
        if(!lightbox) return null;

        let wm=document.getElementById("studentSecureLightboxWatermark");
        if(!wm){
            wm=document.createElement("div");
            wm.id="studentSecureLightboxWatermark";
            wm.setAttribute("aria-hidden","true");
            lightbox.appendChild(wm);
        }
        return wm;
    }

    function renderLightboxWatermark(){
        if(!secureStudentPhotoOpen) return;

        const lightbox=document.getElementById("photoLightbox");
        const wm=ensureLightboxWatermark();
        if(!lightbox || !wm) return;

        const info=currentStudentPrivacyInfo();
        const time=formattedPrivacyTime();
        const monthText=secureMonthNumber ? ` • Month ${secureMonthNumber}` : "";
        const cellText=`ST. AUGUSTINE\nCONFIDENTIAL\n${info.studentName}\nID: ${info.studentId}${monthText}\n${time}`;

        let cells="";
        for(let i=0;i<18;i++){
            cells+=`<div class="student-secure-watermark-cell">${secureEsc(cellText).replace(/\n/g,"<br>")}</div>`;
        }

        wm.innerHTML=`
            <div class="student-secure-watermark-grid">${cells}</div>
            <div class="student-secure-watermark-banner">
                🔒 PRIVATE STUDENT RECORD • ${secureEsc(info.studentName)} • ID: ${secureEsc(info.studentId)}
                ${secureMonthNumber ? ` • Month ${secureMonthNumber}` : ""}
                • Viewed ${secureEsc(time)}
            </div>
        `;

        lightbox.classList.add("student-secure-lightbox");

        const img=document.getElementById("largePhoto");
        if(img){
            img.draggable=false;
            img.setAttribute("draggable","false");
            img.setAttribute("oncontextmenu","return false;");
        }
    }

    function clearSecureLightboxMode(){
        secureStudentPhotoOpen=false;
        secureMonthNumber=null;
        const lightbox=document.getElementById("photoLightbox");
        if(lightbox) lightbox.classList.remove("student-secure-lightbox");
        const wm=document.getElementById("studentSecureLightboxWatermark");
        if(wm) wm.innerHTML="";
    }

    /* Wrap the FINAL Student Monthly Report opener after all existing scripts load. */
    function installStudentPhotoWrapper(){
        if(typeof window.openStudentPhotoGallery!=="function") return;
        if(window.openStudentPhotoGallery.__studentPrivacyWrapped) return;

        const original=window.openStudentPhotoGallery;

        const wrapped=async function(studentId,startIndex){
            secureStudentPhotoOpen=true;
            secureMonthNumber=Number(startIndex)+1;

            let result;
            try{
                result=original.apply(this,arguments);
                if(result && typeof result.then==="function"){
                    await result;
                }
            }finally{
                /* Existing code opens the lightbox asynchronously in some versions. */
                setTimeout(renderLightboxWatermark,0);
                setTimeout(renderLightboxWatermark,120);
                setTimeout(renderLightboxWatermark,450);
            }
            return result;
        };

        wrapped.__studentPrivacyWrapped=true;
        window.openStudentPhotoGallery=wrapped;
    }

    /* If the normal gallery openPhoto() is used later, ensure it is NOT treated
       as a protected student image unless openStudentPhotoGallery activated it. */
    function installNormalPhotoWrapper(){
        if(typeof window.openPhoto!=="function") return;
        if(window.openPhoto.__studentPrivacyNormalWrapped) return;

        const original=window.openPhoto;
        const wrapped=function(){
            if(!secureStudentPhotoOpen){
                clearSecureLightboxMode();
            }
            return original.apply(this,arguments);
        };
        wrapped.__studentPrivacyNormalWrapped=true;
        window.openPhoto=wrapped;
    }

    /* Right-click and drag protection, limited strictly to Student Portfolio. */
    document.addEventListener("contextmenu",function(e){
        const inStudent=e.target.closest && e.target.closest("#studentRollView");
        const inSecureLightbox=e.target.closest && e.target.closest("#photoLightbox.student-secure-lightbox");
        if(inStudent || inSecureLightbox){
            e.preventDefault();
        }
    },true);

    document.addEventListener("dragstart",function(e){
        const inStudent=e.target.closest && e.target.closest("#studentRollView");
        const inSecureLightbox=e.target.closest && e.target.closest("#photoLightbox.student-secure-lightbox");
        if((inStudent || inSecureLightbox) && e.target.tagName==="IMG"){
            e.preventDefault();
        }
    },true);

    /* Block common "save/print/source" shortcuts while the protected photo is open.
       This is deterrence only; browser/OS screenshot controls cannot be guaranteed. */
    document.addEventListener("keydown",function(e){
        const lightbox=document.getElementById("photoLightbox");
        const studentView=document.getElementById("studentRollView");
        const protectedOpen=!!(lightbox && lightbox.classList.contains("student-secure-lightbox") &&
                               getComputedStyle(lightbox).display!=="none");
        const studentVisible=!!(studentView && studentView.offsetParent!==null);

        if(!(protectedOpen || studentVisible)) return;

        const key=(e.key||"").toLowerCase();
        const ctrl=e.ctrlKey || e.metaKey;

        if((ctrl && ["s","p","u"].includes(key)) ||
           (ctrl && e.shiftKey && ["i","j","c"].includes(key))){
            e.preventDefault();
            e.stopPropagation();
        }
    },true);

    /* Remove protected mode when the lightbox is closed. */
    document.addEventListener("click",function(e){
        if(!secureStudentPhotoOpen) return;
        const close=e.target.closest && e.target.closest("#photoLightbox .photo-close");
        if(close){
            setTimeout(clearSecureLightboxMode,0);
        }
    },true);

    /* Keep dynamic timestamp and newly rendered student profiles updated. */
    const observer=new MutationObserver(function(){
        clearTimeout(securityRefreshTimer);
        securityRefreshTimer=setTimeout(function(){
            installStudentPhotoWrapper();
            installNormalPhotoWrapper();
            refreshStudentThumbnailSecurity();
            if(secureStudentPhotoOpen) renderLightboxWatermark();
        },60);
    });

    function initStudentPrivacyLayer(){
        installStudentPhotoWrapper();
        installNormalPhotoWrapper();
        refreshStudentThumbnailSecurity();
        ensureLightboxWatermark();

        const root=document.body;
        if(root){
            observer.observe(root,{childList:true,subtree:true});
        }

        /* Timestamp refresh. */
        setInterval(function(){
            refreshStudentThumbnailSecurity();
            if(secureStudentPhotoOpen) renderLightboxWatermark();
        },30000);
    }

    if(document.readyState==="loading"){
        document.addEventListener("DOMContentLoaded",initStudentPrivacyLayer,{once:true});
    }else{
        initStudentPrivacyLayer();
    }

    /* Existing scripts near the end redefine some functions; install once more
       after the entire page load so this remains the final wrapper. */
    window.addEventListener("load",function(){
        setTimeout(function(){
            installStudentPhotoWrapper();
            installNormalPhotoWrapper();
            refreshStudentThumbnailSecurity();
        },900);
    });
})();

/* ===== SOURCE SCRIPT BLOCK: marks-grade-view-final-js ===== */
/* View-only enhancement. Existing save / submit / package / Excel functions remain unchanged. */
const UME_GRADE_SCALE_FINAL=[
  {min:90,grade:"A+",gp:4.0},{min:80,grade:"A",gp:3.6},{min:70,grade:"B+",gp:3.2},
  {min:60,grade:"B",gp:2.8},{min:50,grade:"C+",gp:2.4},{min:40,grade:"C",gp:2.0},
  {min:35,grade:"D",gp:1.6},{min:0,grade:"NG",gp:0.0}
];
const umeFinalFilters={teacherYear:"",classTeacherYear:"",classTeacherClass:"",principalYear:"",principalClass:"",adminYear:"",adminClass:""};
function umeGradeFromPercentFinal(percent){
  const p=Number(percent);if(!Number.isFinite(p))return null;
  const item=UME_GRADE_SCALE_FINAL.find(row=>p>=row.min)||UME_GRADE_SCALE_FINAL[UME_GRADE_SCALE_FINAL.length-1];
  return {...item,percent:Number(p.toFixed(2))};
}
function umeNormFinal(value){return String(value||"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
function umeIsEvComponentFinal(name){const n=umeNormFinal(name);return n==="participation"||n==="project work"||n==="terminal exam"||n==="terminal examination";}
function umeGradeGroupsFinal(bundle){
  const lower=UME_LOWER_CLASSES.has(bundle.project.class_name),components=bundle.components||[];
  if(lower){
    const evals=components.filter(c=>!umeNormFinal(c.component_name).includes("exam"));
    const exams=components.filter(c=>umeNormFinal(c.component_name).includes("exam"));
    return [{key:"ev",label:"Evaluation (EV)",components:evals},{key:"exam",label:"Exam",components:exams}];
  }
  return [
    {key:"ev",label:"Internal Evaluation (EV)",components:components.filter(c=>umeIsEvComponentFinal(c.component_name))},
    {key:"exam",label:"Exam",components:components.filter(c=>!umeIsEvComponentFinal(c.component_name))}
  ];
}
function umeGradeResultFinal(bundle,studentId,group){
  if(!group.components.length)return {state:"empty"};
  const map=umeEntryMap(bundle);let full=0,obtained=0;
  for(const c of group.components){
    full+=Number(c.full_marks)||0;const e=map.get(`${c.id}|${studentId}`);
    if(umeEntryIsAbsent(e))return {state:"absent",full};
    if(!e||e.obtained_marks===null||e.obtained_marks===undefined||e.obtained_marks==="")return {state:"incomplete",full};
    const n=Number(e.obtained_marks);if(!Number.isFinite(n))return {state:"incomplete",full};obtained+=n;
  }
  if(!(full>0))return {state:"incomplete",full,obtained};
  const result=umeGradeFromPercentFinal(obtained/full*100);return {state:"ready",full,obtained,...result};
}
function umeGradeCellFinal(result){
  if(result.state==="empty")return '<td class="ume-grade-cell">—</td>';
  if(result.state==="absent")return '<td class="ume-grade-cell ume-grade-ng">ABS<small>Absent</small></td>';
  if(result.state!=="ready")return '<td class="ume-grade-cell ume-incomplete">Incomplete<small>Enter all required Marks</small></td>';
  return `<td class="ume-grade-cell ${result.grade==="NG"?"ume-grade-ng":""}">${umeEscape(result.grade)}<small>GP ${result.gp.toFixed(1)} • ${umeEscape(umeNumber(result.percent))}%</small></td>`;
}
function umeGradeTableFinal(group,bundles){
  const state=umeCombinedState(bundles);if(!state.bundles.length)return '<div class="ume-empty">No Subject is available.</div>';
  const subjectHeader=state.bundles.map(b=>`<th colspan="2">${umeEscape(b.project.subject_name)}</th>`).join("");
  const groupHeader=state.bundles.map(b=>umeGradeGroupsFinal(b).map(g=>`<th>${umeEscape(g.label)}</th>`).join("")).join("");
  const body=state.students.map((s,index)=>`<tr><td>${index+1}</td><td>${umeEscape(s.student_id)}</td><td class="ume-student">${umeEscape(s.student_name||s.name)}</td>${state.bundles.map(b=>umeGradeGroupsFinal(b).map(g=>umeGradeCellFinal(umeGradeResultFinal(b,s.student_id,g))).join("")).join("")}</tr>`).join("");
  return `<div class="ume-table-wrap"><table class="ume-table"><thead><tr><th rowspan="2">Roll No.</th><th rowspan="2">Student ID</th><th rowspan="2">Student Name</th>${subjectHeader}</tr><tr>${groupHeader}</tr></thead><tbody>${body||'<tr><td colspan="3">No students found.</td></tr>'}</tbody></table></div>`;
}
function umeSwitchCombinedViewFinal(id,mode){
  document.getElementById(`${id}-marks`)?.classList.toggle("ume-hidden-view",mode!=="marks");
  document.getElementById(`${id}-grade`)?.classList.toggle("ume-hidden-view",mode!=="grade");
  document.getElementById(`${id}-marks-btn`)?.classList.toggle("active",mode==="marks");
  document.getElementById(`${id}-grade-btn`)?.classList.toggle("active",mode==="grade");
}
const umeOriginalCombinedTableHtmlFinal=umeCombinedTableHtml;
umeCombinedTableHtml=function(group,bundles){
  const id=`ume-view-${Date.now()}-${Math.floor(Math.random()*100000)}`;
  const marks=umeOriginalCombinedTableHtmlFinal(group,bundles);
  const grade=umeGradeTableFinal(group,bundles);
  return `<div class="ume-view-switch"><button id="${id}-marks-btn" type="button" class="ume-btn ume-secondary active" onclick="umeSwitchCombinedViewFinal('${id}','marks')">MARKS VIEW</button><button id="${id}-grade-btn" type="button" class="ume-btn ume-secondary" onclick="umeSwitchCombinedViewFinal('${id}','grade')">GRADE VIEW</button></div><div id="${id}-marks">${marks}</div><div id="${id}-grade" class="ume-card ume-hidden-view"><div class="ume-group-head"><div><h3>${umeEscape(group.className)} — ${umeEscape(group.term)} — Grade View</h3><div class="ume-meta">Academic Session: ${umeEscape(group.session)} • View only; saved Marks and Excel Export remain component-wise.</div></div></div>${grade}</div>`;
};
function umeCurrentTeacherBundleFinal(){
  if(!umeActiveBundle)return null;let bundle=umeActiveBundle;
  if(umeProjectEditable()){
    try{const current=umeCollectTeacherData(),fullMap=new Map(current.components.map(c=>[String(c.component_id),c.full_marks]));bundle={...umeActiveBundle,components:umeActiveBundle.components.map(c=>({...c,full_marks:fullMap.get(String(c.id))})),entries:current.entries.map(e=>({...e,project_id:umeActiveBundle.project.id}))};}catch(_error){}
  }
  return bundle;
}
function umeTeacherSetViewFinal(mode){
  const host=document.getElementById("umeMarksTableHost"),preview=document.getElementById("umeTeacherGradePreview");if(!host)return;
  const cards=[...host.children].filter(el=>el.id!=="umeTeacherGradePreview");cards.forEach(el=>el.classList.toggle("ume-hidden-view",mode==="grade"));
  if(mode==="marks"){preview?.classList.add("ume-hidden-view");return;}
  const bundle=umeCurrentTeacherBundleFinal();if(!bundle)return;
  let box=preview;if(!box){box=document.createElement("div");box.id="umeTeacherGradePreview";host.appendChild(box);}box.className="ume-card";
  const p=bundle.project,group={className:p.class_name,term:p.term_name,session:p.academic_session};box.innerHTML=`<h4>${umeEscape(p.subject_name)} — Grade Preview</h4><p class="ume-subtitle">Draft preview only. Incomplete sections are marked Incomplete; this does not change saved Marks or Export.</p>${umeGradeTableFinal(group,[bundle])}`;
}
const umeOriginalRenderTeacherProjectFinal=umeRenderTeacherProject;
umeRenderTeacherProject=function(){
  umeOriginalRenderTeacherProjectFinal();const actions=document.getElementById("umeTeacherActions");if(!actions)return;
  actions.insertAdjacentHTML("afterbegin",'<button type="button" class="ume-btn ume-secondary" onclick="umeTeacherSetViewFinal(\'marks\')">MARKS VIEW</button><button type="button" class="ume-btn ume-secondary" onclick="umeTeacherSetViewFinal(\'grade\')">GRADE VIEW</button>');
};

/* ---------- Clean Teacher project list: choose Academic Year first ---------- */
function umeEnsureTeacherYearFilterFinal(){
  const picker=document.querySelector("#umeTeacherPanel .ume-picker");if(!picker||document.getElementById("umeTeacherYearFilter"))return;
  const wrap=document.createElement("div");wrap.id="umeTeacherYearFilter";wrap.className="ume-filter-bar ume-project-year-wrap";wrap.innerHTML='<label class="ume-field">Academic Year / Session<select id="umeTeacherYearSelect" onchange="umeTeacherYearChangedFinal(this.value)"><option value="">— Select Year —</option></select></label><div class="ume-subtitle">Choose a year first. Only your Marks files from that year will appear.</div>';picker.parentElement.insertBefore(wrap,picker);
}
function umeTeacherYearChangedFinal(value){umeFinalFilters.teacherYear=String(value||"");umeRenderTeacherProjectOptionsFinal();}
function umeRenderTeacherProjectOptionsFinal(preferredId=""){
  umeEnsureTeacherYearFilterFinal();const yearSelect=document.getElementById("umeTeacherYearSelect"),select=document.getElementById("umeProjectSelect"),empty=document.getElementById("umeTeacherEmpty"),workspace=document.getElementById("umeTeacherWorkspace");
  const years=[...new Set((umeMyProjects||[]).map(p=>String(p.academic_session||"").trim()).filter(Boolean))].sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
  if(yearSelect){yearSelect.innerHTML='<option value="">— Select Year —</option>'+years.map(y=>`<option value="${umeEscape(y)}">${umeEscape(y)}</option>`).join("");if(years.includes(umeFinalFilters.teacherYear))yearSelect.value=umeFinalFilters.teacherYear;}
  if(!umeFinalFilters.teacherYear){select.innerHTML='<option value="">Select Academic Year first</option>';empty.style.display="block";empty.textContent="Select Academic Year / Session to view your Marks files.";workspace.style.display="none";umeActiveBundle=null;return;}
  const rows=(umeMyProjects||[]).filter(p=>String(p.academic_session||"").trim()===umeFinalFilters.teacherYear);
  if(!rows.length){select.innerHTML='<option value="">No project in this year</option>';empty.style.display="block";empty.textContent=`No Marks file found for ${umeFinalFilters.teacherYear}.`;workspace.style.display="none";umeActiveBundle=null;return;}
  select.innerHTML='<option value="">— Choose Marks File —</option>'+rows.map(p=>`<option value="${Number(p.id)}">${umeEscape(p.class_name)} • ${umeEscape(p.subject_name)} • ${umeEscape(p.term_name)} • ${umeEscape(umeStatusLabel(p.status))}</option>`).join("");empty.style.display="none";workspace.style.display="none";umeActiveBundle=null;
  const wanted=String(preferredId||"");if(wanted&&rows.some(p=>String(p.id)===wanted)){select.value=wanted;umeLoadProject(wanted);}
}
umeLoadMyProjects=async function(preferredId=""){
  const empty=document.getElementById("umeTeacherEmpty"),workspace=document.getElementById("umeTeacherWorkspace");
  try{umeMyProjects=await umeRpc(umeStaffDb(),"ume_list_my_projects");if(preferredId){const project=umeMyProjects.find(p=>String(p.id)===String(preferredId));if(project)umeFinalFilters.teacherYear=String(project.academic_session||"").trim();}umeRenderTeacherProjectOptionsFinal(preferredId);}
  catch(error){empty.style.display="block";workspace.style.display="none";empty.textContent="Marks Entry database is not ready. "+(error.message||"");}
};

/* FIX: after choosing a filtered Marks file, reveal the workspace again. */
const umeFilteredOriginalLoadProjectFinal=umeLoadProject;
umeLoadProject=async function(projectId){
  const workspace=document.getElementById("umeTeacherWorkspace"),empty=document.getElementById("umeTeacherEmpty");
  if(!projectId){if(workspace)workspace.style.display="none";return;}
  await umeFilteredOriginalLoadProjectFinal(projectId);
  if(umeActiveBundle){
    if(empty)empty.style.display="none";
    if(workspace)workspace.style.display="block";
  }
};

/* ---------- Class Teacher roster: blank until assigned Class is explicitly selected ---------- */
umeConfigureClassTeacherRoster=async function(){
  const card=document.getElementById("umeClassRosterCard"),select=document.getElementById("umeTeacherRosterClass"),host=document.getElementById("umeTeacherRosterList");
  const assigned=umeMyClassAssignments.map(row=>row.class_name).filter(name=>UME_UPPER_CLASSES.includes(name));if(!card||!select)return;
  card.style.display=assigned.length?"block":"none";if(!assigned.length)return;
  select.innerHTML='<option value="">— Select Assigned Class —</option>'+assigned.map(name=>`<option value="${umeEscape(name)}">${umeEscape(name)}</option>`).join("");select.value="";if(host)host.innerHTML='<div class="ume-filter-prompt">Select your assigned Class to view its student list.</div>';
};
const umeOriginalLoadClassTeacherRosterFinal=umeLoadClassTeacherRoster;
umeLoadClassTeacherRoster=async function(){const className=document.getElementById("umeTeacherRosterClass")?.value||"",host=document.getElementById("umeTeacherRosterList");if(!className){if(host)host.innerHTML='<div class="ume-filter-prompt">Select your assigned Class to view its student list.</div>';return;}return umeOriginalLoadClassTeacherRosterFinal();};

/* ---------- Year + Class filters for Class Teacher / Principal / Admin ---------- */
function umeAvailableYearsFinal(rows){return [...new Set((rows||[]).map(r=>String(r.academic_session||"").trim()).filter(Boolean))].sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));}
function umeEnsureClassTeacherFiltersFinal(){
  const host=document.getElementById("umeClassTeacherGroups");if(!host||document.getElementById("umeClassTeacherFilterBar"))return;
  const bar=document.createElement("div");bar.id="umeClassTeacherFilterBar";bar.className="ume-filter-bar";bar.innerHTML='<label class="ume-field">Academic Year / Session<select id="umeClassTeacherYearSelect" onchange="umeClassTeacherFilterChangedFinal()"><option value="">— Select Year —</option></select></label><label class="ume-field">Assigned Class<select id="umeClassTeacherClassSelect" onchange="umeClassTeacherFilterChangedFinal()"><option value="">— Select Class —</option></select></label>';
  host.parentElement.insertBefore(bar,host);
}
function umePopulateClassTeacherFiltersFinal(){
  umeEnsureClassTeacherFiltersFinal();const ys=document.getElementById("umeClassTeacherYearSelect"),cs=document.getElementById("umeClassTeacherClassSelect");
  const years=umeAvailableYearsFinal(umeClassTeacherRows),classes=[...new Set(umeMyClassAssignments.map(r=>r.class_name))].filter(Boolean);
  ys.innerHTML='<option value="">— Select Year —</option>'+years.map(y=>`<option value="${umeEscape(y)}">${umeEscape(y)}</option>`).join("");cs.innerHTML='<option value="">— Select Class —</option>'+classes.map(c=>`<option value="${umeEscape(c)}">${umeEscape(c)}</option>`).join("");
  if(years.includes(umeFinalFilters.classTeacherYear))ys.value=umeFinalFilters.classTeacherYear;if(classes.includes(umeFinalFilters.classTeacherClass))cs.value=umeFinalFilters.classTeacherClass;
}
function umeClassTeacherFilterChangedFinal(){umeFinalFilters.classTeacherYear=document.getElementById("umeClassTeacherYearSelect")?.value||"";umeFinalFilters.classTeacherClass=document.getElementById("umeClassTeacherClassSelect")?.value||"";umeSelectedGroups.classTeacher=null;document.getElementById("umeClassTeacherDetail").innerHTML="";umeRenderGroupCards("classTeacher",umeRoleGroups("classTeacher"),document.getElementById("umeClassTeacherGroups"));}
const umeOriginalLoadClassTeacherInboxFinal=umeLoadClassTeacherInbox;
umeLoadClassTeacherInbox=async function(){
  const host=document.getElementById("umeClassTeacherGroups"),detail=document.getElementById("umeClassTeacherDetail");host.innerHTML='<div class="ume-empty">Loading submissions...</div>';detail.innerHTML="";
  try{umeClassTeacherRows=await umeRpc(umeStaffDb(),"ume_list_class_teacher_projects");umePopulateClassTeacherFiltersFinal();umeRenderGroupCards("classTeacher",umeRoleGroups("classTeacher"),host);}catch(error){host.innerHTML=`<div class="ume-empty">Could not load Class Teacher Inbox: ${umeEscape(error.message||"Unknown error")}</div>`;}
};
function umeRenderYearClassFilterFinal(role){
  const host=document.getElementById(role==="principal"?"umePrincipalClassFilter":"umeAdminClassFilter");if(!host)return;
  const rows=role==="principal"?umePrincipalRows:umeAdminRows,years=umeAvailableYearsFinal(rows),yearKey=role+"Year",classKey=role+"Class";
  host.className="ume-filter-bar";host.innerHTML=`<label class="ume-field">Academic Year / Session<select onchange="umePackageFilterChangedFinal('${role}','year',this.value)"><option value="">— Select Year —</option>${years.map(y=>`<option value="${umeEscape(y)}" ${umeFinalFilters[yearKey]===y?"selected":""}>${umeEscape(y)}</option>`).join("")}</select></label><label class="ume-field">Class<select onchange="umePackageFilterChangedFinal('${role}','class',this.value)" ${umeFinalFilters[yearKey]?"":"disabled"}><option value="">All Classes</option>${UME_CLASSES.map(c=>`<option value="${umeEscape(c)}" ${umeFinalFilters[classKey]===c?"selected":""}>${umeEscape(c)}</option>`).join("")}</select></label>`;
}
function umePackageFilterChangedFinal(role,type,value){umeFinalFilters[role+(type==="year"?"Year":"Class")]=String(value||"");if(type==="year")umeFinalFilters[role+"Class"]="";umeSelectedGroups[role]=null;umeRenderYearClassFilterFinal(role);const host=document.getElementById(role==="principal"?"umePrincipalGroups":"umeAdminGroups"),detail=umeGroupDetailHost(role);if(detail)detail.innerHTML="";umeRenderGroupCards(role,umeRoleGroups(role),host);}
umeRenderPackageClassFilter=function(role){if(role==="principal"||role==="admin")umeRenderYearClassFilterFinal(role);};
const umeOriginalRoleGroupsFinal=umeRoleGroups;
umeRoleGroups=function(role){
  const groups=umeGroupRows(umePackageRoleRows(role));
  if(role==="classTeacher")return groups.filter(g=>umeFinalFilters.classTeacherYear&&umeFinalFilters.classTeacherClass&&String(g.session).trim()===umeFinalFilters.classTeacherYear&&g.className===umeFinalFilters.classTeacherClass);
  if(role==="principal"||role==="admin"){
    const year=umeFinalFilters[role+"Year"],cls=umeFinalFilters[role+"Class"];if(!year)return [];
    return groups.filter(g=>String(g.session).trim()===year&&(!cls||g.className===cls));
  }
  return umeOriginalRoleGroupsFinal(role);
};
const umeOriginalRenderGroupCardsFinal=umeRenderGroupCards;
umeRenderGroupCards=function(role,groups,host){
  if(role==="classTeacher"&&(!umeFinalFilters.classTeacherYear||!umeFinalFilters.classTeacherClass)){host.innerHTML='<div class="ume-filter-prompt">Select Academic Year and Assigned Class to view submissions.</div>';return;}
  if((role==="principal"||role==="admin")&&!umeFinalFilters[role+"Year"]){host.innerHTML='<div class="ume-filter-prompt">Select Academic Year / Session to view Marks packages.</div>';return;}
  return umeOriginalRenderGroupCardsFinal(role,groups,host);
};

/* ===== SOURCE SCRIPT BLOCK: exam-management-final-js ===== */
const EXAM_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
const EXAM_SUBJECTS=["NEPALI","ENGLISH","MATH","SCIENCE","SEROPHERO","SURYODAYA","SOCIAL","HEALTH","COMPUTER","MORAL","G.K.","ACCOUNT","ECONOMICS","REVISION","HOLIDAY","LEAVE","—"];
const EXAM_NO_QUESTION=new Set(["REVISION","HOLIDAY","LEAVE","—","-","DASH","OFF","NO EXAM",""]);
let examPortalRole="staff",examPeriods=[],examDays=[],examEntries=[],examStatuses=[],examCurrentPeriod=null,examActiveTab="routine",examPeriodEditId=null,examEditMode=false,examCoordinatorRows=[],examVisibilityTimer=null;
function examEscape(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}
function examNormalize(v){return String(v??"").trim().replace(/\s+/g," ")}
function examUpper(v){return examNormalize(v).toUpperCase()}
function examCsv(v){const s=String(v??"");return /[\",\n]/.test(s)?`\"${s.replace(/\"/g,'\"\"')}\"`:s}
function examIsCoreManager(){return examPortalRole==="admin"||examPortalRole==="principal"}
function examIsManager(){return examIsCoreManager()||examPortalRole==="coordinator"}
function examRoleLabel(){return examPortalRole==="admin"?"ADMIN — FULL CONTROL":examPortalRole==="principal"?"PRINCIPAL — FULL CONTROL":examPortalRole==="coordinator"?"EXAM COORDINATOR — FULL CONTROL":"STAFF — PUBLISHED VIEW / EXPORT"}
function examDb(){return examPortalRole==="admin"?(typeof initStudentSupabase==="function"?initStudentSupabase():null):(typeof initStaffSupabase==="function"?initStaffSupabase():null)}
function examActorName(){return examPortalRole==="admin"?"Website Admin":String(window.loggedInStaff?.name||loggedInStaff?.name||"Staff Member")}
function examActorId(){return examPortalRole==="admin"?"admin":String(window.loggedInStaff?.username||loggedInStaff?.username||"")}
function examDbError(error){const m=String(error?.message||"Unknown error");if(error?.code==="42P01"||/exam_periods|exam_days|exam_routine_entries|exam_question_status|exam_coordinators/i.test(m))return "Exam Management database is not ready. Run the updated Exam Management SQL once, then refresh.";if(/row-level security|permission denied|policy/i.test(m))return "This account does not have permission for that Exam Management action.";return m}
function examMessage(message,type="error"){const h=document.getElementById("examStatusMessage");if(!h)return;h.innerHTML=`<div class="${type==="success"?"exam-success":"exam-error"}">${examEscape(message)}</div>`;if(type==="success")setTimeout(()=>{if(h.textContent===message)h.innerHTML=""},2600)}
function examClearMessage(){const h=document.getElementById("examStatusMessage");if(h)h.innerHTML=""}
function examPopulateDatalists(){const s=document.getElementById("examSubjectSuggestions");if(s)s.innerHTML=EXAM_SUBJECTS.map(v=>`<option value="${examEscape(v)}"></option>`).join("");const dir=typeof STAFF_LOGIN_DIRECTORY!=="undefined"?STAFF_LOGIN_DIRECTORY:{};const names=[...new Set(Object.values(dir).map(v=>examNormalize(v?.name)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));const t=document.getElementById("examTeacherSuggestions");if(t)t.innerHTML=names.map(v=>`<option value="${examEscape(v)}"></option>`).join("");const c=document.getElementById("examClasswiseSelect");if(c&&c.options.length===1)c.insertAdjacentHTML("beforeend",EXAM_CLASSES.map(v=>`<option value="${examEscape(v)}">${examEscape(v)}</option>`).join(""));const sc=document.getElementById("examCoordinatorStaffSelect");if(sc&&sc.options.length===1)sc.insertAdjacentHTML("beforeend",Object.entries(dir).filter(([id])=>id!==String(typeof PRINCIPAL_STAFF_ID!=="undefined"?PRINCIPAL_STAFF_ID:"joseph")).map(([id,v])=>`<option value="${examEscape(id)}">${examEscape(v.name)} — ${examEscape(v.designation||"Staff")}</option>`).join(""))}
async function examResolveStaffRole(){if(examPortalRole==="admin"||examPortalRole==="principal")return;try{const db=examDb(),id=examActorId();if(!db||!id)return;const {data,error}=await db.from("exam_coordinators").select("staff_id,staff_name,enabled").eq("staff_id",id).eq("enabled",true).maybeSingle();if(error&&error.code!=="PGRST116")throw error;if(data?.enabled)examPortalRole="coordinator"}catch(e){console.warn("Exam coordinator role check:",e)}}
async function openExamManagement(source="staff"){
  const requestedRole=String(source||"staff").toLowerCase();
  const isPrincipalNow=(typeof staffDashboardIsPrincipal==="function"&&staffDashboardIsPrincipal());
  if(requestedRole==="admin") examPortalRole="admin";
  else if(requestedRole==="principal"||isPrincipalNow) examPortalRole="principal";
  else examPortalRole="staff";

  if(examPortalRole==="admin"){
    if(!studentAdminSession){
      if(typeof openStudentAdminLogin==="function") openStudentAdminLogin();
      return;
    }
  }else{
    if(!loggedInStaff||!staffAuthSession){
      if(typeof openStaffLogin==="function") openStaffLogin();
      return;
    }
  }

  await examResolveStaffRole();
  examClearMessage();
  examCurrentPeriod=null;examDays=[];examEntries=[];examStatuses=[];examPeriodEditId=null;examEditMode=false;
  examPopulateDatalists();
  const p=document.getElementById("examManagementPopup");
  if(!p){
    alert("Exam Management panel could not be opened. Please refresh the page once.");
    return;
  }
  p.style.display="block";
  p.style.zIndex="100000";
  document.body.style.overflow="hidden";
  examApplyRoleUI();
  examTogglePeriodForm(false);
  examShowTab("routine");
  examResetSelectionUI();
  await examLoadPeriods();
  examStartVisibilityWatch();
}
function closeExamManagement(){document.getElementById("examManagementPopup").style.display="none";document.body.style.overflow="auto";examEditMode=false;examStopVisibilityWatch();examClearMessage()}
function examApplyRoleUI(){const b=document.getElementById("examRoleBadge");if(b)b.textContent=examRoleLabel();document.getElementById("examManagerBar")?.classList.toggle("show",examIsManager());const cb=document.getElementById("examCoordinatorManageBtn");if(cb)cb.style.display=examIsCoreManager()?"inline-block":"none";const tab=document.getElementById("examTabRoutine"),head=document.getElementById("examRoutineHeading"),note=document.getElementById("examRoutineNote");if(tab)tab.textContent=examIsManager()?"1. ROUTINE MANAGEMENT":"1. OVERALL ROUTINE";if(head)head.textContent=examIsManager()?"📅 Routine Management":"📅 Overall Routine";if(note)note.textContent=examIsManager()?"Routine opens in View Mode. Use Edit Routine only when changes are needed.":"Published Routine for all Classes.";examUpdateRoutineButtons()}
function examUpdatePublishBadge(){const b=document.getElementById("examPublishBadge");if(!b)return;if(!examCurrentPeriod){b.style.display="none";return}b.style.display="inline-flex";b.textContent=examCurrentPeriod.is_published?"PUBLISHED ✓":"UNPUBLISHED / DRAFT";b.className=`exam-publish-badge ${examCurrentPeriod.is_published?"published":"draft"}`}
function examUpdateRoutineButtons(){const ready=!!examCurrentPeriod,manager=examIsManager();const show=(id,on)=>{const e=document.getElementById(id);if(e)e.style.display=on?"inline-block":"none"};show("examEditRoutineBtn",manager&&ready&&!examEditMode);show("examAddDayBtn",manager&&ready&&examEditMode);show("examSaveDraftBtn",manager&&ready&&examEditMode);show("examSavePublishBtn",manager&&ready&&examEditMode);show("examCancelEditBtn",manager&&ready&&examEditMode);show("examPublishBtn",manager&&ready&&!examEditMode&&!examCurrentPeriod?.is_published);show("examUnpublishBtn",manager&&ready&&!examEditMode&&!!examCurrentPeriod?.is_published);const ep=document.getElementById("examEditPeriodBtn"),dp=document.getElementById("examDeletePeriodBtn");if(ep)ep.disabled=!manager||!ready;if(dp)dp.disabled=!manager||!ready}
function examResetSelectionUI(){const y=document.getElementById("examYearSelect"),t=document.getElementById("examTermSelect");if(y)y.value="";if(t){t.innerHTML='<option value="">— Select Term —</option>';t.disabled=true}document.getElementById("examClasswiseSelect").disabled=true;document.getElementById("examClasswiseSelect").value="";document.getElementById("examSelectedExamInfo").textContent=examIsManager()?"Select Academic Year and Term first.":"Only published Exam Routines are shown here.";document.getElementById("examRoutineHost").innerHTML='<div class="exam-empty">Select Academic Year and Term to view the Routine.</div>';document.getElementById("examTrackerHost").innerHTML='<div class="exam-empty">Select Academic Year and Term to view Question Submission status.</div>';document.getElementById("examClasswiseHost").innerHTML='<div class="exam-empty">Select Academic Year, Term and Class to view Class-wise Routine.</div>';examUpdatePublishBadge();examUpdateRoutineButtons()}
async function examLoadPeriods(preferredId=null){try{const db=examDb();if(!db)throw new Error("Supabase connection unavailable.");const {data,error}=await db.from("exam_periods").select("id,academic_year,term_name,exam_title,is_published,published_at,published_by_name,created_at,updated_at").order("academic_year",{ascending:false}).order("created_at",{ascending:false});if(error)throw error;examPeriods=(data||[]).filter(p=>examIsManager()||p.is_published);const years=[...new Set(examPeriods.map(r=>examNormalize(r.academic_year)).filter(Boolean))];const y=document.getElementById("examYearSelect");y.innerHTML='<option value="">— Select Year —</option>'+years.map(v=>`<option value="${examEscape(v)}">${examEscape(v)}</option>`).join("");if(!examPeriods.length&&!examIsManager())document.getElementById("examSelectedExamInfo").textContent="No Exam Routine has been published yet.";if(preferredId){const p=examPeriods.find(r=>String(r.id)===String(preferredId));if(p){y.value=p.academic_year;examYearChanged(p.academic_year,String(p.id))}}}catch(e){examMessage(examDbError(e))}}
function examYearChanged(yearValue,preferredId=""){examCurrentPeriod=null;examDays=[];examEntries=[];examStatuses=[];examEditMode=false;const year=examNormalize(yearValue),t=document.getElementById("examTermSelect"),list=examPeriods.filter(r=>examNormalize(r.academic_year)===year);t.innerHTML='<option value="">— Select Term —</option>'+list.map(r=>`<option value="${Number(r.id)}">${examEscape(r.term_name)}${r.is_published?" ✓":" (Draft)"}</option>`).join("");t.disabled=!year||!list.length;document.getElementById("examClasswiseSelect").disabled=true;document.getElementById("examSelectedExamInfo").textContent=year?(list.length?"Now select a Term / Examination.":"No available Term for this Year."):"Select Academic Year and Term first.";examUpdatePublishBadge();examUpdateRoutineButtons();if(preferredId){t.value=preferredId;examTermChanged(preferredId)}}
async function examTermChanged(periodId){examEditMode=false;examCurrentPeriod=examPeriods.find(r=>String(r.id)===String(periodId))||null;if(!examCurrentPeriod){examYearChanged(document.getElementById("examYearSelect")?.value||"");return}document.getElementById("examSelectedExamInfo").textContent=`${examCurrentPeriod.academic_year} • ${examCurrentPeriod.term_name}${examCurrentPeriod.exam_title?" • "+examCurrentPeriod.exam_title:""}`;const c=document.getElementById("examClasswiseSelect");c.disabled=false;c.value="";document.getElementById("examClasswiseInfo").textContent="Select a Class to view only that Class's Routine.";examUpdatePublishBadge();examUpdateRoutineButtons();await examLoadCurrentPeriodData()}
async function examLoadCurrentPeriodData(){if(!examCurrentPeriod)return;try{const db=examDb(),pid=examCurrentPeriod.id;let [d,e,s]=await Promise.all([db.from("exam_days").select("id,period_id,day_label,exam_date,sort_order").eq("period_id",pid).order("sort_order").order("id"),db.from("exam_routine_entries").select("id,period_id,day_id,class_name,activity_title,teacher_name,teacher_staff_id,question_required,updated_at").eq("period_id",pid),db.from("exam_question_status").select("entry_id,submitted,submitted_at,submitted_by_name,printed,printed_at,printed_by_name").eq("period_id",pid)]);if(d.error)throw d.error;if(e.error)throw e.error;if(s.error)throw s.error;if(examIsManager()&&!(d.data||[]).length){const defaults=Array.from({length:8},(_,i)=>({period_id:pid,day_label:`Day ${i+1}`,exam_date:null,sort_order:i+1}));const created=await db.from("exam_days").insert(defaults);if(created.error)throw created.error;d=await db.from("exam_days").select("id,period_id,day_label,exam_date,sort_order").eq("period_id",pid).order("sort_order").order("id");if(d.error)throw d.error}examDays=d.data||[];examEntries=e.data||[];examStatuses=s.data||[];examRenderAll()}catch(err){examMessage(examDbError(err))}}
function examEntryFor(dayId,cls){return examEntries.find(r=>String(r.day_id)===String(dayId)&&r.class_name===cls)||null}function examStatusFor(id){return examStatuses.find(r=>String(r.entry_id)===String(id))||null}function examIsNoQuestionTitle(title){return EXAM_NO_QUESTION.has(examUpper(title))}
function examRenderAll(){examRenderRoutine();examRenderTracker();examRenderClasswise();examUpdateRoutineButtons();examUpdatePublishBadge()}
function examShowTab(tab){examActiveTab=tab;[["routine","Routine"],["tracker","Tracker"],["classwise","Classwise"]].forEach(([n,s])=>{document.getElementById(`examPanel${s}`)?.classList.toggle("active",n===tab)});[["routine","Routine"],["tracker","Tracker"],["classwise","Class"]].forEach(([n,s])=>document.getElementById(`examTab${s}`)?.classList.toggle("active",n===tab));if(tab==="classwise")examRenderClasswise()}
function examTogglePeriodForm(show,period=null){if(show&&!examIsManager())return;const f=document.getElementById("examPeriodForm");f.classList.toggle("show",!!show);if(!show){examPeriodEditId=null;["examPeriodYear","examPeriodTerm","examPeriodTitle"].forEach(id=>document.getElementById(id).value="");return}examPeriodEditId=period?.id||null;document.getElementById("examPeriodYear").value=period?.academic_year||"";document.getElementById("examPeriodTerm").value=period?.term_name||"";document.getElementById("examPeriodTitle").value=period?.exam_title||""}
function examEditCurrentPeriod(){if(examCurrentPeriod&&examIsManager())examTogglePeriodForm(true,examCurrentPeriod)}
async function examSavePeriod(){if(!examIsManager())return;const academic_year=examNormalize(document.getElementById("examPeriodYear").value),term_name=examNormalize(document.getElementById("examPeriodTerm").value),exam_title=examNormalize(document.getElementById("examPeriodTitle").value)||null;if(!academic_year||!term_name){examMessage("Academic Year and Term are required.");return}try{const db=examDb();let res,isNew=!examPeriodEditId;if(examPeriodEditId)res=await db.from("exam_periods").update({academic_year,term_name,exam_title,updated_at:new Date().toISOString()}).eq("id",examPeriodEditId).select("id").single();else res=await db.from("exam_periods").insert({academic_year,term_name,exam_title,is_published:false,created_by_role:examPortalRole,created_by_name:examActorName()}).select("id").single();if(res.error)throw res.error;const id=res.data?.id||examPeriodEditId;if(isNew){const defaults=Array.from({length:8},(_,i)=>({period_id:id,day_label:`Day ${i+1}`,exam_date:null,sort_order:i+1}));const dr=await db.from("exam_days").insert(defaults);if(dr.error)throw dr.error}examTogglePeriodForm(false);examMessage(isNew?"Exam created with Day 1–Day 8. Add Routine and Publish when ready.":"Exam Year / Term updated.","success");await examLoadPeriods(id)}catch(e){examMessage(examDbError(e))}}
async function examDeleteCurrentPeriod(){if(!examCurrentPeriod||!examIsManager())return;if(!confirm(`Delete ${examCurrentPeriod.academic_year} • ${examCurrentPeriod.term_name}?\n\nIts Routine and tracker status will also be deleted.`))return;try{const r=await examDb().from("exam_periods").delete().eq("id",examCurrentPeriod.id);if(r.error)throw r.error;examCurrentPeriod=null;await examLoadPeriods();examResetSelectionUI();examMessage("Exam deleted.","success")}catch(e){examMessage(examDbError(e))}}
function examEnterEditMode(){if(!examIsManager()||!examCurrentPeriod)return;examEditMode=true;examRenderRoutine();examUpdateRoutineButtons()}
function examCancelEditMode(){examEditMode=false;examRenderRoutine();examUpdateRoutineButtons()}
async function examAddDay(){if(!examIsManager()||!examCurrentPeriod||!examEditMode)return;try{const next=Math.max(0,...examDays.map(d=>Number(d.sort_order)||0))+1,r=await examDb().from("exam_days").insert({period_id:examCurrentPeriod.id,day_label:`Day ${next}`,exam_date:null,sort_order:next});if(r.error)throw r.error;await examMarkDraft();await examLoadCurrentPeriodData();examEditMode=true;examRenderRoutine();examUpdateRoutineButtons();examMessage(`Day ${next} added.`,"success")}catch(e){examMessage(examDbError(e))}}
async function examDeleteDay(dayId){if(!examIsManager()||!examEditMode)return;const d=examDays.find(x=>String(x.id)===String(dayId));if(!d||!confirm(`Delete ${d.day_label}? All Routine entries under this Day will also be deleted.`))return;try{const r=await examDb().from("exam_days").delete().eq("id",dayId);if(r.error)throw r.error;await examMarkDraft();await examLoadCurrentPeriodData();examEditMode=true;examRenderRoutine();examUpdateRoutineButtons()}catch(e){examMessage(examDbError(e))}}
function examRenderRoutine(){const host=document.getElementById("examRoutineHost");if(!examCurrentPeriod){host.innerHTML='<div class="exam-empty">Select Academic Year and Term to view the Routine.</div>';return}if(!examDays.length){host.innerHTML=`<div class="exam-empty">No Exam Days found.${examIsManager()?" Create or Add Day to continue.":""}</div>`;return}const heads=examDays.map((d,i)=>examEditMode?`<th class="exam-day-head"><div class="exam-day-edit"><input id="examDayLabel_${d.id}" value="${examEscape(d.day_label)}" placeholder="Day ${i+1}"><input id="examDayDate_${d.id}" value="${examEscape(d.exam_date||"")}" placeholder="Date"><button type="button" onclick="examDeleteDay(${Number(d.id)})">DELETE DAY</button></div></th>`:`<th class="exam-day-head"><strong>${examEscape(d.day_label)}</strong><small>${examEscape(d.exam_date||"Date not set")}</small></th>`).join("");const rows=EXAM_CLASSES.map((cls,ri)=>`<tr><td class="exam-class-col">${examEscape(cls)}</td>${examDays.map(d=>examRoutineCellHtml(d,cls,ri)).join("")}</tr>`).join("");host.innerHTML=`${examEditMode?'<div class="exam-edit-note">Subject / Activity and Teacher Name are both optional. Use REVISION, HOLIDAY, LEAVE or — where needed. Subject is shown first and Teacher Name directly underneath in the same cell.</div>':""}<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th class="exam-class-col">CLASS</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div>`}
function examRoutineCellHtml(day,cls,rowIndex){const e=examEntryFor(day.id,cls);if(!examEditMode){if(!e||(!examNormalize(e.activity_title)&&!examNormalize(e.teacher_name)))return '<td><div class="exam-view-cell"><span class="exam-special">—</span></div></td>';const title=examNormalize(e.activity_title),teacher=examNormalize(e.teacher_name);return `<td><div class="exam-view-cell">${title?`<strong class="${examIsNoQuestionTitle(title)?"exam-special":""}">${examEscape(title)}</strong>`:""}${teacher?`<span>${examEscape(teacher)}</span>`:""}</div></td>`}const key=`${day.id}_${rowIndex}`;return `<td><div class="exam-cell-editor"><input id="examActivity_${key}" type="text" list="examSubjectSuggestions" maxlength="80" value="${examEscape(e?.activity_title||"")}" placeholder="Subject / Activity" autocomplete="off"><input id="examTeacher_${key}" type="text" list="examTeacherSuggestions" maxlength="120" value="${examEscape(e?.teacher_name||"")}" placeholder="Teacher Name" autocomplete="off"></div></td>`}
async function examMarkDraft(){if(!examCurrentPeriod||!examIsManager())return;const r=await examDb().from("exam_periods").update({is_published:false,published_at:null,published_by_name:null,updated_at:new Date().toISOString()}).eq("id",examCurrentPeriod.id);if(r.error)throw r.error;examCurrentPeriod.is_published=false;examCurrentPeriod.published_at=null;examCurrentPeriod.published_by_name=null}
async function examSaveRoutine(publishAfter=false){if(!examIsManager()||!examCurrentPeriod||!examEditMode)return;try{const db=examDb(),pid=examCurrentPeriod.id,now=new Date().toISOString();if(examCurrentPeriod.is_published)await examMarkDraft();const dayUpdates=examDays.map((d,i)=>({id:d.id,period_id:pid,day_label:examNormalize(document.getElementById(`examDayLabel_${d.id}`)?.value)||`Day ${i+1}`,exam_date:examNormalize(document.getElementById(`examDayDate_${d.id}`)?.value)||null,sort_order:i+1,updated_at:now}));if(dayUpdates.length){const r=await db.from("exam_days").upsert(dayUpdates,{onConflict:"id"});if(r.error)throw r.error}const upserts=[],deleteIds=[],resetStatusIds=[];EXAM_CLASSES.forEach((cls,ri)=>examDays.forEach(d=>{const key=`${d.id}_${ri}`,title=examNormalize(document.getElementById(`examActivity_${key}`)?.value),teacher=examNormalize(document.getElementById(`examTeacher_${key}`)?.value),old=examEntryFor(d.id,cls);if(!title&&!teacher){if(old)deleteIds.push(old.id);return}const questionRequired=!!title&&!examIsNoQuestionTitle(title);if(old&&(examNormalize(old.activity_title)!==title||examNormalize(old.teacher_name)!==teacher||!!old.question_required!==questionRequired))resetStatusIds.push(old.id);upserts.push({period_id:pid,day_id:d.id,class_name:cls,activity_title:title||null,teacher_name:teacher||null,teacher_staff_id:null,question_required:questionRequired,updated_at:now})}));if(upserts.length){const r=await db.from("exam_routine_entries").upsert(upserts,{onConflict:"period_id,day_id,class_name"});if(r.error)throw r.error}if(resetStatusIds.length){const r=await db.from("exam_question_status").delete().in("entry_id",resetStatusIds);if(r.error)throw r.error}if(deleteIds.length){const r=await db.from("exam_routine_entries").delete().in("id",deleteIds);if(r.error)throw r.error}if(!examCurrentPeriod.is_published)await examMarkDraft();if(publishAfter)await examDoPublish();examEditMode=false;await examLoadPeriods(pid);examMessage(publishAfter?"Routine updated and published successfully. All Staff now see the latest version.":"Routine saved as Unpublished / Draft. It is hidden from ordinary Staff until Publish.","success")}catch(e){examMessage(examDbError(e))}}
async function examDoPublish(){const now=new Date().toISOString(),r=await examDb().from("exam_periods").update({is_published:true,published_at:now,published_by_name:examActorName(),updated_at:now}).eq("id",examCurrentPeriod.id);if(r.error)throw r.error;examCurrentPeriod.is_published=true;examCurrentPeriod.published_at=now;examCurrentPeriod.published_by_name=examActorName()}
async function examPublishCurrent(){if(!examIsManager()||!examCurrentPeriod)return;if(!confirm("Publish this Routine now? The latest saved Routine will become visible to all Staff."))return;try{await examDoPublish();await examLoadPeriods(examCurrentPeriod.id);examMessage("Routine published. All Staff now see the latest saved version.","success")}catch(e){examMessage(examDbError(e))}}
async function examUnpublishCurrent(){if(!examIsManager()||!examCurrentPeriod||!examCurrentPeriod.is_published)return;if(!confirm("Unpublish this Routine now? It will immediately be hidden from ordinary Staff until you Publish it again."))return;try{const pid=examCurrentPeriod.id;await examMarkDraft();await examLoadPeriods(pid);examMessage("Routine unpublished. It is now hidden from ordinary Staff. Edit if needed, then Publish again.","success")}catch(e){examMessage(examDbError(e))}}
function examStopVisibilityWatch(){if(examVisibilityTimer){clearInterval(examVisibilityTimer);examVisibilityTimer=null}}
function examStartVisibilityWatch(){examStopVisibilityWatch();if(examIsManager())return;examVisibilityTimer=setInterval(async()=>{const popup=document.getElementById("examManagementPopup");if(!popup||popup.style.display==="none"||!examCurrentPeriod)return;const pid=examCurrentPeriod.id,knownUpdated=examCurrentPeriod.updated_at||"";try{const {data,error}=await examDb().from("exam_periods").select("id,is_published,updated_at").eq("id",pid).maybeSingle();if(error&&error.code!=="PGRST116")throw error;if(!data||!data.is_published){examCurrentPeriod=null;examDays=[];examEntries=[];examStatuses=[];examEditMode=false;await examLoadPeriods();examResetSelectionUI();examMessage("This Exam Routine has been unpublished and is temporarily hidden from Staff.","error");return}if((data.updated_at||"")!==knownUpdated){await examLoadPeriods(pid);examMessage("Exam Routine was updated. The latest published version is now shown.","success")}}catch(e){console.warn("Exam publish visibility watch:",e)}},15000)}
function examRenderTracker(){const host=document.getElementById("examTrackerHost");if(!examCurrentPeriod){host.innerHTML='<div class="exam-empty">Select Academic Year and Term to view Question Submission status.</div>';return}if(!examDays.length){host.innerHTML='<div class="exam-empty">No Exam Days are available.</div>';return}const head=examDays.map(d=>`<th class="exam-day-head"><strong>${examEscape(d.day_label)}</strong><small>${examEscape(d.exam_date||"Date not set")}</small></th>`).join("");const rows=EXAM_CLASSES.map(cls=>`<tr><td class="exam-class-col">${examEscape(cls)}</td>${examDays.map(d=>examTrackerCellHtml(d,cls)).join("")}</tr>`).join("");host.innerHTML=`<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th class="exam-class-col">CLASS</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`}
function examTrackerCellHtml(day,cls){const e=examEntryFor(day.id,cls);if(!e||!examNormalize(e.activity_title))return '<td class="exam-tracker-cell"><span class="exam-special">—</span></td>';if(!e.question_required)return `<td class="exam-tracker-cell"><span class="exam-special">${examEscape(e.activity_title)}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:""}</td>`;const s=examStatusFor(e.id)||{},submitted=!!s.submitted,printed=!!s.printed,m=examIsManager();return `<td class="exam-tracker-cell"><span class="exam-subject">${examEscape(e.activity_title)}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:""}<div class="exam-status-stack"><label class="exam-status-line ${submitted?"active":""}"><span class="exam-bulb ${submitted?"on":""}">💡</span>${m?`<input type="checkbox" ${submitted?"checked":""} onchange="examSetStatus(${Number(e.id)},'submitted',this.checked)">`:submitted?"✅":"☐"}<span>${submitted?"Submitted":"Submit"}</span></label><label class="exam-status-line ${printed?"printed":""}">${m?`<input type="checkbox" ${printed?"checked":""} ${submitted?"":"disabled"} onchange="examSetStatus(${Number(e.id)},'printed',this.checked)">`:printed?"✅":"☐"}<span>🖨 ${printed?"Printed":"Print"}</span></label></div></td>`}
async function examSetStatus(entryId,field,checked){if(!examIsManager()||!examCurrentPeriod)return;const e=examEntries.find(r=>String(r.id)===String(entryId));if(!e?.question_required)return;const old=examStatusFor(entryId)||{};let submitted=!!old.submitted,printed=!!old.printed;if(field==="submitted"){submitted=!!checked;if(!submitted)printed=false}else if(field==="printed"){if(!submitted&&checked){examMessage("Mark Submitted first.");examRenderTracker();return}printed=!!checked}const now=new Date().toISOString(),p={entry_id:entryId,period_id:examCurrentPeriod.id,submitted,printed,updated_at:now};if(submitted&&!old.submitted){p.submitted_at=now;p.submitted_by_role=examPortalRole;p.submitted_by_name=examActorName()}else if(!submitted){p.submitted_at=null;p.submitted_by_role=null;p.submitted_by_name=null}if(printed&&!old.printed){p.printed_at=now;p.printed_by_role=examPortalRole;p.printed_by_name=examActorName()}else if(!printed){p.printed_at=null;p.printed_by_role=null;p.printed_by_name=null}try{const r=await examDb().from("exam_question_status").upsert(p,{onConflict:"entry_id"});if(r.error)throw r.error;await examLoadCurrentPeriodData()}catch(err){examMessage(examDbError(err));examRenderTracker()}}
function examRenderClasswise(){const host=document.getElementById("examClasswiseHost"),sel=document.getElementById("examClasswiseSelect");if(!examCurrentPeriod){host.innerHTML='<div class="exam-empty">Select Academic Year, Term and Class to view Class-wise Routine.</div>';return}const cls=sel.value;if(!cls){host.innerHTML='<div class="exam-empty">Select one Class to view its Routine.</div>';return}const rows=examDays.map(d=>{const e=examEntryFor(d.id,cls),title=examNormalize(e?.activity_title),teacher=examNormalize(e?.teacher_name);return `<tr><td><strong>${examEscape(d.day_label)}</strong></td><td>${examEscape(d.exam_date||"—")}</td><td>${title?`<strong>${examEscape(title)}</strong>${teacher?`<br>${examEscape(teacher)}`:""}`:"—"}</td></tr>`}).join("");host.innerHTML=`<div class="exam-info-line"><span class="exam-info-chip">${examEscape(examCurrentPeriod.academic_year)}</span><span class="exam-info-chip">${examEscape(examCurrentPeriod.term_name)}</span><span class="exam-info-chip">${examEscape(cls)}</span></div><div class="exam-table-wrap"><table class="exam-class-routine"><thead><tr><th>Day</th><th>Date</th><th>Routine</th></tr></thead><tbody>${rows}</tbody></table></div>`}
function examCurrentSelectionReady(){return !!examCurrentPeriod}
function examExportCSV(kind){if(!examCurrentSelectionReady()){examMessage("Select Academic Year and Term first.");return}let rows=[],p=examCurrentPeriod;if(kind==="routine"){rows.push(["Academic Year",p.academic_year],["Term",p.term_name],["Status",p.is_published?"Published":"Draft"],[]);rows.push(["Class",...examDays.flatMap(d=>[`${d.day_label} - Routine`,`${d.day_label} - Teacher`,`${d.day_label} - Date`])]);EXAM_CLASSES.forEach(cls=>rows.push([cls,...examDays.flatMap(d=>{const e=examEntryFor(d.id,cls);return[e?.activity_title||"—",e?.teacher_name||"",d.exam_date||""]})]))}else if(kind==="tracker"){rows.push(["Academic Year",p.academic_year],["Term",p.term_name],[]);rows.push(["Class",...examDays.flatMap(d=>[`${d.day_label} - Routine`,`${d.day_label} - Teacher`,`${d.day_label} - Submission`,`${d.day_label} - Print`])]);EXAM_CLASSES.forEach(cls=>rows.push([cls,...examDays.flatMap(d=>{const e=examEntryFor(d.id,cls);if(!e)return["—","","",""];if(!e.question_required)return[e.activity_title||"—",e.teacher_name||"","N/A","N/A"];const s=examStatusFor(e.id)||{};return[e.activity_title||"",e.teacher_name||"",s.submitted?"Submitted":"Not Submitted",s.printed?"Printed":"Not Printed"]})]))}else{const cls=document.getElementById("examClasswiseSelect").value;if(!cls){examMessage("Select a Class first.");return}rows.push(["Academic Year",p.academic_year],["Term",p.term_name],["Class",cls],[]);rows.push(["Day","Date","Routine","Teacher"]);examDays.forEach(d=>{const e=examEntryFor(d.id,cls);rows.push([d.day_label,d.exam_date||"",e?.activity_title||"—",e?.teacher_name||""])})}const csv="\ufeff"+rows.map(r=>r.map(examCsv).join(",")).join("\r\n"),blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`exam_${kind}_${String(p.academic_year).replace(/\W+/g,"_")}_${String(p.term_name).replace(/\W+/g,"_")}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function examPrintableRoutine(){const head=examDays.map(d=>`<th>${examEscape(d.day_label)}<br>${examEscape(d.exam_date||"")}</th>`).join("");const rows=EXAM_CLASSES.map(cls=>`<tr><td><strong>${examEscape(cls)}</strong></td>${examDays.map(d=>{const e=examEntryFor(d.id,cls);return `<td>${e?.activity_title?`<strong>${examEscape(e.activity_title)}</strong>`:"—"}${e?.teacher_name?`<br>${examEscape(e.teacher_name)}`:""}</td>`}).join("")}</tr>`).join("");return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>CLASS</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`}
function examPrintableTracker(){const head=examDays.map(d=>`<th>${examEscape(d.day_label)}<br>${examEscape(d.exam_date||"")}</th>`).join("");const rows=EXAM_CLASSES.map(cls=>`<tr><td><strong>${examEscape(cls)}</strong></td>${examDays.map(d=>{const e=examEntryFor(d.id,cls);if(!e?.activity_title)return"<td>—</td>";if(!e.question_required)return`<td><strong>${examEscape(e.activity_title)}</strong>${e.teacher_name?`<br>${examEscape(e.teacher_name)}`:""}</td>`;const s=examStatusFor(e.id)||{};return`<td><strong>${examEscape(e.activity_title)}</strong>${e.teacher_name?`<br>${examEscape(e.teacher_name)}`:""}<br>${s.submitted?"✅ Submitted":"☐ Submit"}<br>${s.printed?"✅ Printed":"☐ Print"}</td>`}).join("")}</tr>`).join("");return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>CLASS</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`}
function examPrintCurrent(kind){if(!examCurrentPeriod){examMessage("Select Academic Year and Term first.");return}let title="Exam Routine",html="";if(kind==="routine")html=examPrintableRoutine();else if(kind==="tracker"){title="Question Submission & Printing Tracker";html=examPrintableTracker()}else{const cls=document.getElementById("examClasswiseSelect").value;if(!cls){examMessage("Select a Class first.");return}title=`${cls} — Exam Routine`;html=document.getElementById("examClasswiseHost").innerHTML}const p=examCurrentPeriod,w=window.open("","_blank","width=1200,height=800");if(!w){examMessage("Pop-up was blocked. Allow pop-ups to Print / PDF.");return}w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${examEscape(title)}</title><style>body{font-family:Arial,sans-serif;padding:24px}.exam-table,.exam-class-routine{width:100%;border-collapse:collapse;font-size:10px}.exam-table th,.exam-table td,.exam-class-routine th,.exam-class-routine td{border:1px solid #888;padding:6px;text-align:center;vertical-align:top}.exam-table th,.exam-class-routine th{background:#eee}.exam-info-line{margin:10px 0}.exam-info-chip{margin-right:8px;font-weight:bold}@page{size:landscape;margin:10mm}</style></head><body><h1>${examEscape(title)}</h1><p>${examEscape(p.academic_year)} • ${examEscape(p.term_name)}</p>${html}<script>window.onload=function(){window.print()}<\/script></body></html>`);w.document.close()}
function examToggleCoordinatorPanel(force){if(!examIsCoreManager())return;const p=document.getElementById("examCoordinatorPanel"),show=typeof force==="boolean"?force:!p.classList.contains("show");p.classList.toggle("show",show);if(show)examLoadCoordinators()}
async function examLoadCoordinators(){if(!examIsCoreManager())return;const host=document.getElementById("examCoordinatorList");host.innerHTML='<span class="exam-note">Loading...</span>';try{const {data,error}=await examDb().from("exam_coordinators").select("staff_id,staff_name,enabled,granted_by_name,granted_at").eq("enabled",true).order("staff_name");if(error)throw error;examCoordinatorRows=data||[];host.innerHTML=examCoordinatorRows.length?examCoordinatorRows.map(r=>`<span class="exam-coordinator-chip">${examEscape(r.staff_name||r.staff_id)} <button type="button" onclick="examRemoveCoordinator('${examEscape(r.staff_id)}')">REMOVE</button></span>`).join(""):'<span class="exam-note">No Exam Coordinator access is active.</span>'}catch(e){host.innerHTML=`<span class="exam-error">${examEscape(examDbError(e))}</span>`}}
async function examGrantCoordinator(){if(!examIsCoreManager())return;const id=document.getElementById("examCoordinatorStaffSelect").value;if(!id){examMessage("Select a Staff member first.");return}const staff=typeof STAFF_LOGIN_DIRECTORY!=="undefined"?STAFF_LOGIN_DIRECTORY[id]:null;if(!staff){examMessage("Staff record not found.");return}try{const now=new Date().toISOString(),r=await examDb().from("exam_coordinators").upsert({staff_id:id,staff_name:staff.name,enabled:true,granted_by_role:examPortalRole,granted_by_name:examActorName(),granted_at:now,updated_at:now},{onConflict:"staff_id"});if(r.error)throw r.error;document.getElementById("examCoordinatorStaffSelect").value="";await examLoadCoordinators();examMessage(`${staff.name} now has Exam Coordinator full control.`,"success")}catch(e){examMessage(examDbError(e))}}
async function examRemoveCoordinator(id){if(!examIsCoreManager())return;if(!confirm("Remove Exam Coordinator access from this Staff member?"))return;try{const r=await examDb().from("exam_coordinators").delete().eq("staff_id",id);if(r.error)throw r.error;await examLoadCoordinators();examMessage("Exam Coordinator access removed.","success")}catch(e){examMessage(examDbError(e))}}
document.addEventListener("DOMContentLoaded",()=>{examPopulateDatalists();const adminTabs=document.querySelector("#websiteAdminPanel .website-admin-tabs");if(adminTabs&&!document.getElementById("websiteAdminExamButton")){const b=document.createElement("button");b.id="websiteAdminExamButton";b.type="button";b.innerHTML="📝 Exam Management";b.addEventListener("click",()=>openExamManagement("admin"));adminTabs.appendChild(b)}const quick=document.querySelector("#staffDashboardPopup .staff-dashboard-quick-actions");if(quick&&!document.getElementById("staffDashboardExamAction")){const b=document.createElement("button");b.id="staffDashboardExamAction";b.type="button";b.className="staff-dashboard-action exam";b.innerHTML='<span class="staff-dashboard-action-icon">📝</span><span class="staff-dashboard-action-copy"><strong>Exam Management</strong><small>Routine, submission & class-wise view</small></span><span class="staff-dashboard-action-arrow">→</span>';b.addEventListener("click",()=>openExamManagement((typeof staffDashboardIsPrincipal==="function"&&staffDashboardIsPrincipal())?"principal":"staff"));const marks=document.getElementById("staffDashboardMarksAction");marks?marks.insertAdjacentElement("afterend",b):quick.appendChild(b)}});

/* ===== SOURCE SCRIPT BLOCK: saaf-final-stability-js ===== */
(function(){
  "use strict";
  const INITIAL_YEAR="2083";
  const ALL_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
  window.SAAF_CURRENT_ACADEMIC_YEAR=window.SAAF_CURRENT_ACADEMIC_YEAR||INITIAL_YEAR;
  let saafRoster=[],saafActions=new Map(),saafArchives=[],saafHistory=[];

  function esc(v){return typeof window.umeEscape==="function"?window.umeEscape(v):typeof window.escapeHtml==="function"?window.escapeHtml(String(v??"")):String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function adminDb(){const db=typeof window.initStudentSupabase==="function"?window.initStudentSupabase():null;if(!db)throw new Error("Supabase connection is unavailable.");return db;}
  async function rpc(name,args={}){const {data,error}=await adminDb().rpc(name,args);if(error)throw error;return data;}
  function msg(text,type=""){const el=document.getElementById("saafSystemMessage");if(!el)return;el.className=`saaf-note ${type}`;el.textContent=text;}
  function dateText(v){if(!v)return "—";try{return new Date(v).toLocaleString("en-GB",{timeZone:"Asia/Kathmandu"});}catch(_){return String(v)}}
  function downloadCsv(filename,rows){const q=x=>{const s=String(x??"");return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s};const csv="\ufeff"+rows.map(r=>r.map(q).join(",")).join("\r\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

  /* ---------- Current Academic Year ---------- */
  window.saafFinalLoadAcademicYear=async function(){
    try{
      const db=typeof window.initStudentSupabase==="function"?window.initStudentSupabase():null;if(!db)return window.SAAF_CURRENT_ACADEMIC_YEAR;
      const {data,error}=await db.rpc("saaf_get_current_academic_year");if(error)throw error;
      const year=String(data||INITIAL_YEAR).trim();if(/^\d{4}$/.test(year))window.SAAF_CURRENT_ACADEMIC_YEAR=year;
    }catch(error){console.warn("Academic Year setup not loaded yet:",error?.message||error)}
    (typeof studentSignedUrlCache!=="undefined"&&studentSignedUrlCache?.clear?.());saafApplyYearDefaults();saafPaintCurrentYear();return window.SAAF_CURRENT_ACADEMIC_YEAR;
  };
  function saafApplyYearDefaults(){["marksProjectSession","umeCreateSession","internalCreateSession","examPeriodYear"].forEach(id=>{const el=document.getElementById(id);if(el&&!String(el.value||"").trim())el.value=window.SAAF_CURRENT_ACADEMIC_YEAR;});}
  function saafPaintCurrentYear(){document.querySelectorAll("[data-saaf-current-year]").forEach(el=>el.textContent=window.SAAF_CURRENT_ACADEMIC_YEAR);const next=document.getElementById("saafNewAcademicYear");if(next&&!next.value&&/^\d{4}$/.test(window.SAAF_CURRENT_ACADEMIC_YEAR))next.value=String(Number(window.SAAF_CURRENT_ACADEMIC_YEAR)+1);}
  document.addEventListener("focusin",e=>{if(["marksProjectSession","umeCreateSession","internalCreateSession","examPeriodYear"].includes(e.target?.id)&&!e.target.value)e.target.value=window.SAAF_CURRENT_ACADEMIC_YEAR});
  if(typeof window.examTogglePeriodForm==="function"){const prev=window.examTogglePeriodForm;window.examTogglePeriodForm=function(show,period=null){const out=prev.apply(this,arguments);if(show&&!period)setTimeout(saafApplyYearDefaults,0);return out;};}

  /* ---------- Year-wise Student Portfolio monthly photos ----------
     Profile photo remains one permanent file. Existing 2083 legacy month files
     are still readable; every new upload uses students/ID/YEAR/month-N.jpg. */
  const originalCloudSignedUrl=typeof window.cloudSignedUrl==="function"?window.cloudSignedUrl:null;
  if(typeof window.cloudPath==="function"){
    window.cloudPath=function(studentId,type,month=null){const id=String(studentId||"").trim();return type==="profile"?`students/${id}/profile.jpg`:`students/${id}/${window.SAAF_CURRENT_ACADEMIC_YEAR||INITIAL_YEAR}/month-${month}.jpg`;};
  }
  if(originalCloudSignedUrl){
    window.cloudSignedUrl=async function(path,expiresIn=900){
      let url=await originalCloudSignedUrl(path,expiresIn);if(url)return url;
      if(String(window.SAAF_CURRENT_ACADEMIC_YEAR)===INITIAL_YEAR){const m=String(path||"").match(/^students\/([^/]+)\/2083\/month-(\d+)\.jpg$/);if(m)url=await originalCloudSignedUrl(`students/${m[1]}/month-${m[2]}.jpg`,expiresIn);}
      return url||"";
    };
  }

  /* ---------- Never delete Marks history when Class Teacher changes ---------- */
  if(typeof window.deleteMarksTeacherAssignment==="function"){
    window.deleteMarksTeacherAssignment=async function(className,button=null){
      if(!(typeof studentAdminSession!=="undefined"?studentAdminSession?.access_token:null))return;
      if(!confirm(`Remove the current Class Teacher assignment for ${className}?\n\nStudent Marks projects and historical records will NOT be deleted.`))return;
      const old=button?.textContent||"DELETE";try{if(button){button.disabled=true;button.textContent="REMOVING..."}const {error}=await adminDb().from("marks_teacher_assignments").delete().eq("class_name",className);if(error)throw error;await window.loadAdminMarksAssignments?.();alert("Class Teacher assignment removed. Existing Marks history is preserved.");}catch(error){alert("Assignment could not be removed: "+(error?.message||"Unknown error"));}finally{if(button){button.disabled=false;button.textContent=old}}
    };
  }

  /* ---------- Safe Student Delete = Archive ---------- */
  async function archiveActiveStudent(studentId,name,className,refresh){
    const status=prompt(`Remove ${name} (${studentId}) from the ACTIVE ${className} list without losing history.\n\nType one: LEFT, TRANSFERRED, ARCHIVED`,`ARCHIVED`);if(status===null)return;
    const value=String(status).trim().toLowerCase();if(!["left","transferred","archived"].includes(value)){alert("Type LEFT, TRANSFERRED or ARCHIVED.");return;}
    if(!confirm(`Confirm: ${name} will be removed from the active roster and kept safely in Archive as ${value.toUpperCase()}.`))return;
    try{await rpc("saaf_admin_archive_student",{p_student_id:studentId,p_status:value});(typeof studentAuthenticatedProfiles!=="undefined"&&studentAuthenticatedProfiles?.delete?.(studentId));await refresh();alert("Student removed from active roster. History and password are preserved in Admin → Academic Year & Archive.");}catch(error){alert("Student could not be archived: "+(error?.message||"Run FINAL STABILIZATION SQL first."));}
  }
  if(typeof window.deleteStudentItem==="function")window.deleteStudentItem=async function(studentId){const s=((typeof adminManagedStudents!=="undefined"?adminManagedStudents:[])||[]).find(x=>x.studentId===studentId);if(!s)return;await archiveActiveStudent(studentId,s.name,s.className,async()=>{await window.loadAdminStudentsFromSupabase?.();window.renderAdminStudentList?.();});};
  if(typeof window.umeDeleteAdminUpperStudent==="function")window.umeDeleteAdminUpperStudent=async function(studentId){const s=((typeof umeAdminUpperStudents!=="undefined"?umeAdminUpperStudents:[])||[]).find(x=>x.student_id===studentId);if(!s)return;await archiveActiveStudent(studentId,s.name,s.class_name,async()=>{await window.umeLoadAdminUpperStudents?.();window.renderAdminStudentList?.();});};

  /* ---------- Dynamic Staff Accounts: newly added Staff also appear ---------- */
  window.renderAdminStaffAccountList=function(){
    const host=document.getElementById("adminStaffAccountList");if(!host)return;
    const map=new Map(),knownNames=new Set();Object.entries((typeof STAFF_LOGIN_DIRECTORY!=="undefined"?STAFF_LOGIN_DIRECTORY:{})||{}).forEach(([id,s])=>{map.set(id,{id,name:s.name||id,designation:s.designation||"Staff"});knownNames.add(String(s.name||"").trim().toLowerCase())});Object.entries((typeof adminManagedStaff!=="undefined"?adminManagedStaff:{})||{}).forEach(([key,s])=>{const id=String(s.staffKey||key||"").trim().toLowerCase(),name=String(s.name||id).trim();if(!id||knownNames.has(name.toLowerCase()))return;map.set(id,{id,name,designation:s.designation||"Staff"})});let rows=[...map.values()];
    rows.sort((a,b)=>String(a.name).localeCompare(String(b.name),undefined,{sensitivity:"base"}));
    host.innerHTML=rows.map(s=>`<div class="staff-account-row"><div><div class="staff-account-name">${esc(s.name)}</div><div class="staff-account-id">${esc(s.designation||"Staff")}</div></div><div><strong>Staff ID</strong><br><span class="staff-account-id">${esc(s.id)}</span></div><div><input id="staffResetPassword_${esc(s.id)}" type="password" autocomplete="new-password" placeholder="New password (8+)"></div><button type="button" class="staff-reset-btn" onclick="requestStaffPasswordReset('${esc(s.id)}')">Set / Reset Login</button></div>`).join("")||'<div class="review-empty">No Staff records found.</div>';
  };
  window.requestStaffPasswordReset=async function(staffId){
    if(!(typeof studentAdminSession!=="undefined"?studentAdminSession?.access_token:null)){alert("Admin login is required.");window.openStudentAdminLogin?.();return;}const input=document.getElementById(`staffResetPassword_${staffId}`),password=input?.value||"";if(password.length<8){alert("Enter a password with at least 8 characters.");input?.focus();return;}
    if(!confirm(`Create or reset the secure login for Staff ID ${staffId}?`))return;const btn=input?.closest(".staff-account-row")?.querySelector(".staff-reset-btn"),old=btn?.textContent||"Set / Reset Login";
    try{if(btn){btn.disabled=true;btn.textContent="Saving..."}const response=await fetch(`${STUDENT_STORAGE_CONFIG.url}/functions/v1/reset-staff-password`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${studentAdminSession.access_token}`,"apikey":STUDENT_STORAGE_CONFIG.anonKey},body:JSON.stringify({staffId,newPassword:password})});let result={};try{result=await response.json()}catch(_){ }if(!response.ok)throw new Error(result.error||result.message||`Request failed (${response.status})`);if(input)input.value="";alert(result.created?"✓ New Staff login account created successfully.":"✓ Staff login password updated successfully.");}catch(error){alert("Staff login setup failed: "+(error?.message||"Unknown error")+"\n\nDeploy the supplied final reset-staff-password Edge Function once if this is a newly added Staff ID.");}finally{if(btn){btn.disabled=false;btn.textContent=old}}
  };

  /* ---------- Admin System Control UI ---------- */
  function ensureSystemControl(){
    const panel=document.getElementById("websiteAdminPanel");if(!panel)return;
    const tabs=panel.querySelector(".website-admin-tabs");if(tabs&&!document.getElementById("saafSystemMenuButton")){const b=document.createElement("button");b.id="saafSystemMenuButton";b.type="button";b.className="saaf-system-menu";b.innerHTML="⚙️ Academic Year &amp; Archive";b.onclick=()=>window.showWebsiteAdminTab("systemControl");tabs.appendChild(b);}
    if(document.getElementById("saafSystemControlTab"))return;
    const tab=document.createElement("div");tab.id="saafSystemControlTab";tab.className="website-admin-tab";tab.innerHTML=`
      <div class="admin-section-head"><div><h3>⚙️ Academic Year &amp; Long-Term Control</h3><p>Use this only for yearly rollover, archived students and historical records. Existing website design and features remain unchanged.</p></div><button type="button" class="admin-mini-btn" onclick="saafLoadSystemControl()">↻ Refresh</button></div>
      <div id="saafSystemMessage" class="saaf-note">Loading long-term controls...</div>
      <div class="saaf-system-grid">
        <section class="saaf-system-card"><h4>Current Academic Year</h4><div class="saaf-year-hero"><div class="saaf-year-badge"><small>CURRENT</small><strong data-saaf-current-year>${esc(window.SAAF_CURRENT_ACADEMIC_YEAR)}</strong></div><div style="flex:1"><p>This year is used as the default in Marks, Internal Evaluation, Exam creation and Student monthly photo storage.</p><div class="saaf-inline"><label class="saaf-field">Correct Current Year<input id="saafManualYear" inputmode="numeric" maxlength="4" placeholder="2083"></label><button class="saaf-btn secondary" type="button" onclick="saafSetCurrentYearOnly()">SAVE YEAR ONLY</button></div></div></div><div class="saaf-note warn" style="margin-top:10px">Use SAVE YEAR ONLY only to correct a wrong setting. At the end of a school year, use the Promotion / Rollover section below.</div></section>
        <section class="saaf-system-card"><h4>Yearly Safety</h4><p>The rollover is blocked while current-year Unified Marks files are Draft, Pending or Returned. Submitted historical Marks are never changed.</p><div class="saaf-note good">✓ Student ID/password preserved<br>✓ Class 5 → Class 6 transferred safely<br>✓ Class 10 → Passed Out archive<br>✓ School Monthly Report copied to history<br>✓ Student Month 1–12 photos stored year-wise</div></section>
        <section class="saaf-system-card saaf-wide"><h4>Student Promotion / New Academic Year</h4><p>Default is Promote. Change only the students who Repeat, Transfer, Leave, or (Class 10) Pass Out. Review the list before running.</p><div class="saaf-inline"><label class="saaf-field" style="max-width:220px">New Academic Year<input id="saafNewAcademicYear" inputmode="numeric" maxlength="4" placeholder="2084"></label><button class="saaf-btn secondary" type="button" onclick="saafLoadYearRoster()">REFRESH STUDENT LIST</button><button class="saaf-btn success" type="button" onclick="saafRunRollover()">RUN FINAL YEAR ROLLOVER</button></div><div class="saaf-toolbar"><select id="saafRosterClassFilter" onchange="saafRenderRoster()"><option value="ALL">All Classes</option>${ALL_CLASSES.map(c=>`<option>${c}</option>`).join("")}</select><input id="saafRosterSearch" type="search" placeholder="Search Student ID / name" oninput="saafRenderRoster()"><button class="saaf-btn secondary" type="button" onclick="saafExportRosterCsv()">EXPORT PREVIEW CSV</button></div><div id="saafRolloverSummary" class="saaf-summary"></div><div id="saafRolloverRoster" class="saaf-roster"><div class="saaf-empty">Load the student list.</div></div></section>
        <section class="saaf-system-card saaf-wide"><h4>Archived / Passed Out Students</h4><p>Students removed from the active roster are not destroyed. Restore them to any class if needed.</p><div class="saaf-inline"><input id="saafArchiveSearch" type="search" placeholder="Search archived student" oninput="saafRenderArchives()" style="min-height:42px;flex:1;border:1px solid #cbd9e6;border-radius:10px;padding:9px 11px"><button class="saaf-btn secondary" type="button" onclick="saafLoadArchives()">REFRESH ARCHIVE</button></div><div id="saafArchiveList" class="saaf-archive-list" style="margin-top:10px"><div class="saaf-empty">Loading archive...</div></div></section>
        <section class="saaf-system-card saaf-wide"><h4>Student Academic History</h4><div class="saaf-inline"><label class="saaf-field" style="max-width:210px">Academic Year<input id="saafHistoryYear" inputmode="numeric" maxlength="4" placeholder="Blank = all"></label><button class="saaf-btn secondary" type="button" onclick="saafLoadHistory()">LOAD HISTORY</button><button class="saaf-btn secondary" type="button" onclick="saafExportHistoryCsv()">EXPORT CSV</button></div><div id="saafHistoryList" class="saaf-history-list" style="margin-top:10px"><div class="saaf-empty">Load academic history.</div></div></section>
        <section class="saaf-system-card saaf-wide"><h4>Archived School Monthly Reports</h4><p>When you run yearly rollover, the current Baishakh–Chaitra report photos are copied here before the live slots are cleared for the new year.</p><div class="saaf-inline"><label class="saaf-field" style="max-width:210px">Archived Year<input id="saafMonthlyHistoryYear" inputmode="numeric" maxlength="4" placeholder="2083"></label><button class="saaf-btn secondary" type="button" onclick="saafLoadMonthlyHistory()">VIEW ARCHIVE</button></div><div id="saafMonthlyHistory" class="saaf-month-grid" style="margin-top:10px"><div class="saaf-empty" style="grid-column:1/-1">Choose an archived year.</div></div></section>
        <section class="saaf-system-card saaf-wide"><h4>Year Rollover Log</h4><div id="saafRolloverLog" class="saaf-history-list"><div class="saaf-empty">No rollover history loaded.</div></div></section>
      </div>`;
    const anchor=document.getElementById("websiteAdminPortfolioAccessTab")||panel.lastElementChild;anchor?.parentElement?.appendChild(tab);
  }

  const previousShowAdminTab=typeof window.showWebsiteAdminTab==="function"?window.showWebsiteAdminTab:null;
  if(previousShowAdminTab)window.showWebsiteAdminTab=function(tab){ensureSystemControl();if(tab==="systemControl"){previousShowAdminTab("__saaf_none__");const el=document.getElementById("saafSystemControlTab");if(el)el.style.display="block";window.saafLoadSystemControl();}else{previousShowAdminTab(tab);const el=document.getElementById("saafSystemControlTab");if(el)el.style.display="none";}saafMarkAdminMenu(tab);};
  function saafMarkAdminMenu(tab){document.querySelectorAll("#websiteAdminPanel .website-admin-tabs>button").forEach(b=>b.classList.remove("saaf-admin-active"));const system=document.getElementById("saafSystemMenuButton");if(tab==="systemControl"){system?.classList.add("saaf-admin-active");return}document.querySelectorAll("#websiteAdminPanel .website-admin-tabs>button").forEach(b=>{const a=b.getAttribute("onclick")||"";if(a.includes(`'${tab}'`)||a.includes(`\"${tab}\"`))b.classList.add("saaf-admin-active")});}

  window.saafLoadSystemControl=async function(){ensureSystemControl();await window.saafFinalLoadAcademicYear();saafPaintCurrentYear();const manual=document.getElementById("saafManualYear"),mh=document.getElementById("saafMonthlyHistoryYear");if(manual&&!manual.value)manual.value=window.SAAF_CURRENT_ACADEMIC_YEAR;if(mh&&!mh.value)mh.value=window.SAAF_CURRENT_ACADEMIC_YEAR;try{await Promise.all([window.saafLoadYearRoster(),window.saafLoadArchives(),window.saafLoadRolloverLog()]);msg("Long-term controls are ready.","good");}catch(error){msg("Final Stabilization database setup is not ready: "+(error?.message||"Run the supplied SQL once."),"bad")}};
  window.saafSetCurrentYearOnly=async function(){const input=document.getElementById("saafManualYear"),year=String(input?.value||"").trim();if(!/^\d{4}$/.test(year)){alert("Enter a 4-digit year.");return}if(!confirm(`Change only the Current Academic Year setting to ${year}?\n\nThis does NOT promote students.`))return;try{await rpc("saaf_admin_set_current_academic_year",{p_year:year});window.SAAF_CURRENT_ACADEMIC_YEAR=year;(typeof studentSignedUrlCache!=="undefined"&&studentSignedUrlCache?.clear?.());saafApplyYearDefaults();saafPaintCurrentYear();msg(`Current Academic Year changed to ${year}.`,"good");}catch(error){msg(error?.message||"Year could not be saved.","bad")}};

  window.saafLoadYearRoster=async function(){const host=document.getElementById("saafRolloverRoster");if(host)host.innerHTML='<div class="saaf-empty">Loading all active students...</div>';saafRoster=await rpc("saaf_admin_year_roster");(saafRoster||[]).forEach(r=>{if(!saafActions.has(r.student_id))saafActions.set(r.student_id,r.default_action||"promote")});window.saafRenderRoster();};
  window.saafSetRolloverAction=function(id,value){saafActions.set(id,value);saafRenderSummary();};
  function saafRenderSummary(){const counts={promote:0,repeat:0,left:0,transferred:0,passed_out:0};saafRoster.forEach(r=>{const a=saafActions.get(r.student_id)||r.default_action||"promote";counts[a]=(counts[a]||0)+1});const el=document.getElementById("saafRolloverSummary");if(el)el.innerHTML=`<span class="saaf-chip">Total ${saafRoster.length}</span><span class="saaf-chip">Promote ${counts.promote}</span><span class="saaf-chip">Repeat ${counts.repeat}</span><span class="saaf-chip">Transferred ${counts.transferred}</span><span class="saaf-chip">Left ${counts.left}</span><span class="saaf-chip">Passed Out ${counts.passed_out}</span>`;}
  window.saafRenderRoster=function(){const host=document.getElementById("saafRolloverRoster");if(!host)return;const cls=document.getElementById("saafRosterClassFilter")?.value||"ALL",q=String(document.getElementById("saafRosterSearch")?.value||"").trim().toLowerCase();const rows=saafRoster.filter(r=>(cls==="ALL"||r.class_name===cls)&&(!q||String(r.student_name).toLowerCase().includes(q)||String(r.student_id).toLowerCase().includes(q)));host.innerHTML=rows.map(r=>{const action=saafActions.get(r.student_id)||r.default_action||"promote";const label=r.next_class_name?`${r.class_name} → ${r.next_class_name}`:`${r.class_name} → Passed Out`;return `<div class="saaf-roster-row"><div><strong>${esc(r.student_name)}</strong><small>${esc(r.student_id)} • ${esc(r.source_area)} roster</small></div><div class="saaf-meta">${esc(label)}</div><select onchange="saafSetRolloverAction('${esc(r.student_id)}',this.value)"><option value="promote" ${action==="promote"?"selected":""}>PROMOTE</option><option value="repeat" ${action==="repeat"?"selected":""}>REPEAT SAME CLASS</option><option value="transferred" ${action==="transferred"?"selected":""}>TRANSFERRED</option><option value="left" ${action==="left"?"selected":""}>LEFT SCHOOL</option><option value="passed_out" ${action==="passed_out"?"selected":""}>PASSED OUT</option></select></div>`}).join("")||'<div class="saaf-empty">No students match this filter.</div>';saafRenderSummary();};
  window.saafExportRosterCsv=function(){downloadCsv(`Student_Rollover_Preview_${window.SAAF_CURRENT_ACADEMIC_YEAR}.csv`,[["Student ID","Student Name","Current Class","Action","Next Class"],...saafRoster.map(r=>[r.student_id,r.student_name,r.class_name,saafActions.get(r.student_id)||r.default_action,r.next_class_name||""])]);};
  window.saafRunRollover=async function(){const newYear=String(document.getElementById("saafNewAcademicYear")?.value||"").trim();if(!/^\d{4}$/.test(newYear)){alert("Enter the new 4-digit Academic Year.");return}if(!saafRoster.length){alert("Load the Student list first.");return}if(!confirm(`FINAL YEAR ROLLOVER\n\n${window.SAAF_CURRENT_ACADEMIC_YEAR} → ${newYear}\nStudents: ${saafRoster.length}\n\nThis will promote the active roster according to the list and archive current School Monthly Reports. Continue?`))return;if(!confirm("Final confirmation: Have you checked Repeat / Transferred / Left / Passed Out students?"))return;const actions=saafRoster.map(r=>({student_id:r.student_id,action:saafActions.get(r.student_id)||r.default_action||"promote"}));const btn=document.querySelector('button[onclick="saafRunRollover()"]'),old=btn?.textContent||"RUN FINAL YEAR ROLLOVER";try{if(btn){btn.disabled=true;btn.textContent="RUNNING..."}msg("Running secure year rollover. Do not close this page.","warn");const result=await rpc("saaf_admin_rollover",{p_new_year:newYear,p_actions:actions});window.SAAF_CURRENT_ACADEMIC_YEAR=newYear;(typeof studentSignedUrlCache!=="undefined"&&studentSignedUrlCache?.clear?.());saafActions=new Map();await window.loadAllManagedContentFromSupabase?.();await window.loadAdminStudentsFromSupabase?.();if(typeof window.umeLoadAdminUpperStudents==="function")await window.umeLoadAdminUpperStudents();saafApplyYearDefaults();saafPaintCurrentYear();await Promise.all([window.saafLoadYearRoster(),window.saafLoadArchives(),window.saafLoadHistory(),window.saafLoadRolloverLog()]);msg(`✓ Rollover complete: ${result?.old_year||""} → ${result?.new_year||newYear}. Promoted ${result?.promoted||0}, Repeated ${result?.repeated||0}, Archived ${result?.archived||0}.`,"good");alert("✓ Academic Year rollover completed successfully. The website is now ready for the new year.");}catch(error){msg("Rollover stopped safely: "+(error?.message||"Unknown error"),"bad");alert("Year rollover was NOT completed: "+(error?.message||"Unknown error"));}finally{if(btn){btn.disabled=false;btn.textContent=old}}};

  window.saafLoadArchives=async function(){saafArchives=await rpc("saaf_admin_list_archived_students",{p_limit:1000});window.saafRenderArchives();};
  window.saafRenderArchives=function(){const host=document.getElementById("saafArchiveList");if(!host)return;const q=String(document.getElementById("saafArchiveSearch")?.value||"").trim().toLowerCase();const rows=saafArchives.filter(r=>!q||String(r.student_name).toLowerCase().includes(q)||String(r.student_id).toLowerCase().includes(q)||String(r.last_class_name).toLowerCase().includes(q));host.innerHTML=rows.map(r=>`<div class="saaf-archive-row"><div><strong>${esc(r.student_name)}</strong><div class="saaf-meta">${esc(r.student_id)} • ${esc(r.last_class_name)} • Year ${esc(r.academic_year)}<br>Archived: ${esc(dateText(r.archived_at))}</div><div class="saaf-status ${r.restored_at?"restored":"archived"}">${r.restored_at?`RESTORED → ${esc(r.restored_to_class||"")}`:esc(r.archive_status)}</div></div>${r.restored_at?'<div class="saaf-meta">Record kept for history</div>':`<select id="saafRestoreClass_${Number(r.id)}">${ALL_CLASSES.map(c=>`<option ${c===r.last_class_name?"selected":""}>${c}</option>`).join("")}</select><button class="saaf-btn success" type="button" onclick="saafRestoreStudent(${Number(r.id)})">RESTORE</button>`}</div>`).join("")||'<div class="saaf-empty">No archived students found.</div>';};
  window.saafRestoreStudent=async function(id){const row=saafArchives.find(r=>Number(r.id)===Number(id)),cls=document.getElementById(`saafRestoreClass_${id}`)?.value;if(!row||!cls)return;if(!confirm(`Restore ${row.student_name} (${row.student_id}) to ${cls}?`))return;try{await rpc("saaf_admin_restore_student",{p_archive_id:Number(id),p_class_name:cls});await window.loadAdminStudentsFromSupabase?.();if(typeof window.umeLoadAdminUpperStudents==="function")await window.umeLoadAdminUpperStudents();await Promise.all([window.saafLoadArchives(),window.saafLoadYearRoster(),window.saafLoadHistory()]);alert("Student restored successfully. Original ID/password and photo path are preserved.");}catch(error){alert("Restore failed: "+(error?.message||"Unknown error"));}};

  window.saafLoadHistory=async function(){const year=String(document.getElementById("saafHistoryYear")?.value||"").trim();saafHistory=await rpc("saaf_admin_student_history",{p_year:year||null,p_limit:2000});const host=document.getElementById("saafHistoryList");if(host)host.innerHTML=saafHistory.map(r=>`<div class="saaf-history-row"><div><strong>${esc(r.student_name)}</strong><div class="saaf-meta">${esc(r.student_id)} • ${esc(r.class_name)} ${r.next_class_name?`→ ${esc(r.next_class_name)}`:""}</div></div><div class="saaf-meta">Year ${esc(r.academic_year)}</div><div class="saaf-status ${r.action==="restored"?"restored":"archived"}">${esc(r.action)}</div></div>`).join("")||'<div class="saaf-empty">No history found.</div>';};
  window.saafExportHistoryCsv=function(){if(!saafHistory.length){alert("Load history first.");return}downloadCsv(`Student_Academic_History_${document.getElementById("saafHistoryYear")?.value||"ALL"}.csv`,[["Academic Year","Student ID","Student Name","Class","Action","Next Class","Recorded"],...saafHistory.map(r=>[r.academic_year,r.student_id,r.student_name,r.class_name,r.action,r.next_class_name||"",dateText(r.recorded_at)])]);};
  window.saafLoadMonthlyHistory=async function(){const year=String(document.getElementById("saafMonthlyHistoryYear")?.value||"").trim(),host=document.getElementById("saafMonthlyHistory");if(!/^\d{4}$/.test(year)){alert("Enter a 4-digit archived year.");return}if(host)host.innerHTML='<div class="saaf-empty" style="grid-column:1/-1">Loading archived monthly reports...</div>';try{const rows=await rpc("saaf_admin_monthly_history",{p_year:year});if(host)host.innerHTML=(rows||[]).map(r=>`<div class="saaf-month-photo">${r.photo_url?`<img src="${esc(r.photo_url)}" alt="${esc(r.title||r.month)}">`:'<div class="saaf-empty" style="border:0">No photo</div>'}<div><strong>${esc(r.month)} • Slot ${Number(r.slot)}</strong><br>${esc(r.title||"")}</div></div>`).join("")||'<div class="saaf-empty" style="grid-column:1/-1">No archived School Monthly Report was found for this year.</div>';}catch(error){if(host)host.innerHTML=`<div class="saaf-empty" style="grid-column:1/-1">${esc(error?.message||"Could not load archive")}</div>`;}};
  window.saafLoadRolloverLog=async function(){const host=document.getElementById("saafRolloverLog");if(!host)return;try{const rows=await rpc("saaf_admin_rollover_history");host.innerHTML=(rows||[]).map(r=>`<div class="saaf-history-row"><div><strong>${esc(r.old_year)} → ${esc(r.new_year)}</strong><div class="saaf-meta">${esc(dateText(r.run_at))}</div></div><div class="saaf-meta">Total ${Number(r.total_students||0)}</div><div class="saaf-meta">↑ ${Number(r.promoted_students||0)} • Repeat ${Number(r.repeated_students||0)} • Archive ${Number(r.archived_students||0)}</div></div>`).join("")||'<div class="saaf-empty">No year rollover has been run yet.</div>';}catch(error){host.innerHTML=`<div class="saaf-empty">${esc(error?.message||"Could not load rollover history")}</div>`;}};

  /* New dynamic controls can be added by Portfolio Access after DOM load; keep menu styling automatic. */
  const obs=new MutationObserver(()=>{ensureSystemControl();document.querySelectorAll("#websiteAdminPanel .website-admin-tabs>button").forEach(b=>b.setAttribute("data-saaf-admin-menu","1"));});
  document.addEventListener("DOMContentLoaded",()=>{ensureSystemControl();const panel=document.getElementById("websiteAdminPanel");if(panel)obs.observe(panel,{childList:true,subtree:true});window.saafFinalLoadAcademicYear();setTimeout(()=>{saafApplyYearDefaults();window.renderAdminStaffAccountList?.()},400);});
})();

/* ===== SOURCE SCRIPT BLOCK: staff-pwa-install-js ===== */
(function(){
  let deferredStaffPwaPrompt=null;

  function pwaIsStandalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone===true;
  }
  function pwaIsIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  }
  function pwaIsAndroid(){ return /Android/i.test(navigator.userAgent); }
  function pwaIsMobile(){ return pwaIsIOS() || pwaIsAndroid() || window.innerWidth<=900; }

  function ensureStaffPwaButton(){
    const host=document.querySelector('#staffDashboardPopup .staff-dashboard-quick-actions');
    if(!host || document.getElementById('staffDashboardInstallAction')) return;
    const button=document.createElement('button');
    button.id='staffDashboardInstallAction';
    button.type='button';
    button.className='staff-dashboard-action install-app';
    button.setAttribute('onclick','installStaffPwa()');
    button.innerHTML='<span class="staff-dashboard-action-icon">📲</span><span class="staff-dashboard-action-copy"><strong>Install Staff App</strong><small>Install on this mobile</small></span><span class="staff-dashboard-action-arrow">→</span>';
    host.appendChild(button);
  }

  function refreshStaffPwaButton(){
    ensureStaffPwaButton();
    const button=document.getElementById('staffDashboardInstallAction');
    if(!button) return;
    const loggedIn=typeof loggedInStaff!=='undefined' && !!loggedInStaff;
    const canShow=loggedIn && pwaIsMobile() && !pwaIsStandalone();
    button.style.display=canShow?'flex':'none';
    const title=button.querySelector('strong');
    const detail=button.querySelector('small');
    if(pwaIsIOS()){
      if(title) title.textContent='Add Staff App to Home Screen';
      if(detail) detail.textContent='iPhone / iPad';
    }else{
      if(title) title.textContent='Install Staff App';
      if(detail) detail.textContent=deferredStaffPwaPrompt?'Ready to install':'Install on this mobile';
    }
  }

  function showStaffPwaGuide(kind){
    const popup=document.getElementById('staffPwaGuide');
    const intro=document.getElementById('staffPwaGuideIntro');
    const steps=document.getElementById('staffPwaGuideSteps');
    if(!popup || !steps) return;
    if(kind==='ios'){
      if(intro) intro.textContent='On iPhone/iPad, add the Staff App from Safari:';
      steps.innerHTML='<div class="staff-pwa-guide-step">Open this website in <strong>Safari</strong>.</div><div class="staff-pwa-guide-step">Tap the <strong>Share</strong> button (⬆).</div><div class="staff-pwa-guide-step">Choose <strong>Add to Home Screen</strong>.</div><div class="staff-pwa-guide-step">Tap <strong>Add</strong>. The St. Staff icon will appear on the Home Screen.</div>';
    }else{
      if(intro) intro.textContent='If the install popup does not appear automatically:';
      steps.innerHTML='<div class="staff-pwa-guide-step">Open this website in <strong>Chrome</strong>.</div><div class="staff-pwa-guide-step">Tap the browser menu <strong>⋮</strong>.</div><div class="staff-pwa-guide-step">Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</div><div class="staff-pwa-guide-step">Confirm <strong>Install</strong>.</div>';
    }
    popup.classList.add('show');
    document.body.style.overflow='hidden';
  }

  window.closeStaffPwaGuide=function(){
    document.getElementById('staffPwaGuide')?.classList.remove('show');
    const dashboard=document.getElementById('staffDashboardPopup');
    document.body.style.overflow=dashboard?.style.display==='block'?'hidden':'auto';
  };

  window.installStaffPwa=async function(){
    if(typeof loggedInStaff==='undefined' || !loggedInStaff){
      if(typeof openStaffLogin==='function') openStaffLogin();
      return;
    }
    if(pwaIsStandalone()){
      if(typeof showStaffDashboardToast==='function') showStaffDashboardToast('Staff App is already installed.');
      return;
    }
    if(deferredStaffPwaPrompt){
      try{
        deferredStaffPwaPrompt.prompt();
        const choice=await deferredStaffPwaPrompt.userChoice;
        if(choice?.outcome==='accepted') deferredStaffPwaPrompt=null;
        refreshStaffPwaButton();
        return;
      }catch(error){ console.warn('PWA install prompt failed:',error); }
    }
    showStaffPwaGuide(pwaIsIOS()?'ios':'android');
  };

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredStaffPwaPrompt=event;
    refreshStaffPwaButton();
  });
  window.addEventListener('appinstalled',()=>{
    deferredStaffPwaPrompt=null;
    refreshStaffPwaButton();
    if(typeof showStaffDashboardToast==='function') showStaffDashboardToast('✓ St. Staff App installed.');
  });
  window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change',refreshStaffPwaButton);
  window.addEventListener('resize',refreshStaffPwaButton);

  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('Service worker registration failed:',error));
    });
  }

  const previousUpdateStaffLoginUI=window.updateStaffLoginUI;
  if(typeof previousUpdateStaffLoginUI==='function'){
    window.updateStaffLoginUI=function(){
      const result=previousUpdateStaffLoginUI.apply(this,arguments);
      ensureStaffPwaButton();
      refreshStaffPwaButton();
      return result;
    };
  }

  const previousOpenStaffDashboard=window.openStaffDashboard;
  if(typeof previousOpenStaffDashboard==='function'){
    window.openStaffDashboard=async function(){
      ensureStaffPwaButton();
      const result=await previousOpenStaffDashboard.apply(this,arguments);
      ensureStaffPwaButton();
      refreshStaffPwaButton();
      return result;
    };
  }

  async function openStaffAppStart(){
    const launchedForStaff=new URLSearchParams(location.search).get('staffapp')==='1' || pwaIsStandalone();
    if(!launchedForStaff) return;
    for(let i=0;i<40;i++){
      if(typeof loggedInStaff!=='undefined' && loggedInStaff && typeof staffAuthSession!=='undefined' && staffAuthSession) break;
      await new Promise(resolve=>setTimeout(resolve,150));
    }
    if(typeof loggedInStaff!=='undefined' && loggedInStaff && typeof staffAuthSession!=='undefined' && staffAuthSession){
      if(typeof showStaffDashboardWelcome==='function') showStaffDashboardWelcome();
      else if(typeof openStaffDashboard==='function') openStaffDashboard();
    }else if(typeof openStaffLogin==='function'){
      openStaffLogin();
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    ensureStaffPwaButton();
    refreshStaffPwaButton();
    setTimeout(openStaffAppStart,450);
  });
})();

/* ===== SOURCE SCRIPT BLOCK: staff-app-mode-v2-js ===== */
(function(){
  function staffAppMode(){
    return window.matchMedia?.('(display-mode: standalone)').matches ||
           window.navigator.standalone===true ||
           new URLSearchParams(location.search).get('staffapp')==='1';
  }
  window.isStaffInstalledApp=staffAppMode;

  function staffAppSignedIn(){
    return typeof loggedInStaff!=='undefined' && !!loggedInStaff &&
           typeof staffAuthSession!=='undefined' && !!staffAuthSession;
  }

  function syncStaffAppShell(){
    if(!staffAppMode()) return;
    const status=document.getElementById('staffAppShellStatus');
    const button=document.getElementById('staffAppShellOpen');
    if(staffAppSignedIn()){
      if(status) status.textContent=`✓ Signed in as ${loggedInStaff.name}`;
      if(button) button.textContent='OPEN MY DASHBOARD';
    }else{
      if(status) status.textContent='Staff login required on this device.';
      if(button) button.textContent='STAFF LOGIN';
    }
  }

  window.staffAppOpenWorkspace=async function(){
    if(!staffAppMode()) return;
    syncStaffAppShell();
    if(staffAppSignedIn()){
      if(typeof openStaffDashboard==='function') await openStaffDashboard();
    }else if(typeof openStaffLogin==='function'){
      openStaffLogin();
    }
  };

  /* In the installed app, skip the decorative welcome screen and go directly
     to the working dashboard after login/session restore. Browser behavior is unchanged. */
  const originalWelcome=window.showStaffDashboardWelcome;
  if(typeof originalWelcome==='function'){
    window.showStaffDashboardWelcome=function(){
      if(staffAppMode()){
        if(staffAppSignedIn()) return window.openStaffDashboard?.();
        return window.openStaffLogin?.();
      }
      return originalWelcome.apply(this,arguments);
    };
  }

  /* Keep the dashboard underneath work panels in app mode. Existing feature
     functions call closeStaffDashboard() before opening their popup; here that
     becomes a no-op only inside the installed app, so closing a work panel
     naturally returns to the dashboard instead of the public website. */
  const originalCloseDashboard=window.closeStaffDashboard;
  if(typeof originalCloseDashboard==='function'){
    window.closeStaffDashboard=function(){
      if(staffAppMode() && staffAppSignedIn()) return;
      return originalCloseDashboard.apply(this,arguments);
    };
  }

  /* Explicit Log Out is the only action that clears the remembered Supabase session. */
  const originalStaffLogout=window.staffLogout;
  if(typeof originalStaffLogout==='function'){
    window.staffLogout=async function(){
      const result=await originalStaffLogout.apply(this,arguments);
      if(staffAppMode()){
        const dashboard=document.getElementById('staffDashboardPopup');
        const welcome=document.getElementById('staffDashboardWelcomePopup');
        if(dashboard) dashboard.style.display='none';
        if(welcome) welcome.style.display='none';
        document.body.style.overflow='auto';
        syncStaffAppShell();
        setTimeout(()=>window.openStaffLogin?.(),120);
      }
      return result;
    };
  }

  /* Keep shell status synced whenever auth UI changes. */
  const originalUpdateLoginUI=window.updateStaffLoginUI;
  if(typeof originalUpdateLoginUI==='function'){
    window.updateStaffLoginUI=function(){
      const result=originalUpdateLoginUI.apply(this,arguments);
      syncStaffAppShell();
      return result;
    };
  }

  async function bootStaffInstalledApp(){
    if(!staffAppMode()) return;
    document.body.classList.add('staff-app-mode');
    document.getElementById('staffAppShell')?.setAttribute('aria-hidden','false');
    syncStaffAppShell();

    /* restoreStaffSession already uses Supabase persistSession:true.
       Give it time to restore/refresh the session without ever storing password. */
    for(let i=0;i<50;i++){
      if(staffAppSignedIn()) break;
      await new Promise(resolve=>setTimeout(resolve,120));
    }
    syncStaffAppShell();
    if(staffAppSignedIn()){
      await window.openStaffDashboard?.();
    }else{
      window.openStaffLogin?.();
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    if(!staffAppMode()) return;
    document.body.classList.add('staff-app-mode');
    syncStaffAppShell();
    setTimeout(bootStaffInstalledApp,500);
  });
})();

/* ===== SOURCE SCRIPT BLOCK: staff-pwa-mobile-v3-js ===== */
(function(){
  "use strict";
  function isStaffApp(){
    return window.matchMedia?.('(display-mode: standalone)').matches ||
           window.navigator.standalone===true ||
           new URLSearchParams(location.search).get('staffapp')==='1';
  }
  if(!isStaffApp()) return; // Normal website stays exactly as before.

  document.body?.classList.add('staff-app-mode');
  let launchUnlocked=false;
  let pendingOpen=null;
  const launchStarted=Date.now();

  const realOpenDashboard=typeof window.openStaffDashboard==='function' ? window.openStaffDashboard : null;
  const realOpenLogin=typeof window.openStaffLogin==='function' ? window.openStaffLogin : null;

  function signedIn(){
    /* staffAuthSession and loggedInStaff are top-level `let` bindings, not
       properties on window. Reading them directly is required here. */
    return typeof loggedInStaff!=='undefined' && !!loggedInStaff &&
           typeof staffAuthSession!=='undefined' && !!staffAuthSession;
  }

  async function ensureRememberedStaffSession(){
    if(signedIn()) return true;
    try{
      const client=typeof initStaffSupabase==='function' ? initStaffSupabase() : null;
      if(!client) return false;

      /* Supabase persistSession:true stores only the auth session/refresh token,
         never the staff password. Restore it before deciding that login is needed. */
      const {data,error}=await client.auth.getSession();
      if(error) return false;
      const session=data?.session||null;
      if(!session?.user?.email) return false;

      const username=normalizeStaffId(session.user.email.split('@')[0]);
      let profile=null;
      if(typeof umeResolveStaffLoginProfile==='function'){
        profile=await umeResolveStaffLoginProfile(username);
      }else if(typeof STAFF_LOGIN_DIRECTORY==='object'){
        profile=STAFF_LOGIN_DIRECTORY[username]||null;
      }
      if(!profile) return false;

      staffAuthSession=session;
      loggedInStaff={username,...profile};
      if(typeof updateStaffLoginUI==='function') updateStaffLoginUI();
      return true;
    }catch(_error){
      return false;
    }
  }

  function setShellStatus(){
    const status=document.getElementById('staffAppShellStatus');
    const btn=document.getElementById('staffAppShellOpen');
    if(!status||!btn) return;
    if(signedIn()){
      status.textContent=`✓ Ready for ${loggedInStaff?.name || 'Staff'}`;
      btn.textContent='OPEN MY DASHBOARD';
    }else{
      status.textContent='Secure staff login is ready.';
      btn.textContent='STAFF LOGIN';
    }
  }
  function showWorkspace(){
    document.body.classList.add('staff-app-workspace-open');
  }

  /* Guard the two old auto-start timers in the existing code. They may request
     Dashboard/Login at 450–500ms; V3 holds them behind the new visible splash. */
  if(realOpenDashboard){
    window.openStaffDashboard=async function(){
      if(!launchUnlocked){ pendingOpen='dashboard'; setShellStatus(); return; }
      showWorkspace();
      return await realOpenDashboard.apply(this,arguments);
    };
  }
  if(realOpenLogin){
    window.openStaffLogin=function(){
      if(!launchUnlocked){ pendingOpen='login'; setShellStatus(); return; }
      showWorkspace();
      return realOpenLogin.apply(this,arguments);
    };
  }

  window.staffAppOpenWorkspace=async function(){
    launchUnlocked=true;
    setShellStatus();
    showWorkspace();
    if(signedIn() && realOpenDashboard) return await realOpenDashboard();
    if(realOpenLogin) return realOpenLogin();
  };

  async function finishLaunch(){
    document.body.classList.add('staff-app-mode');
    const shell=document.getElementById('staffAppShell');
    if(shell) shell.setAttribute('aria-hidden','false');
    setShellStatus();

    /* Restore the persisted Supabase session first. This makes the installed
       app reopen directly to the dashboard until the user explicitly logs out. */
    if(!signedIn()) await ensureRememberedStaffSession();

    /* Give the existing restore listener a short chance to finish too, while
       keeping the splash visible for at least 1.25s. */
    for(let i=0;i<12;i++){
      if(signedIn()) break;
      await new Promise(r=>setTimeout(r,100));
    }
    const remain=Math.max(0,1250-(Date.now()-launchStarted));
    if(remain) await new Promise(r=>setTimeout(r,remain));
    setShellStatus();
    launchUnlocked=true;
    showWorkspace();

    if(signedIn() && realOpenDashboard) await realOpenDashboard();
    else if(realOpenLogin) realOpenLogin();
  }

  /* Make installed-app updates pick up the newest worker without changing database behavior. */
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
    window.addEventListener('load',async()=>{
      try{
        const reg=await navigator.serviceWorker.register('./sw.js?v=6',{scope:'./',updateViaCache:'none'});
        await reg.update();
        if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
      }catch(e){ console.warn('Staff PWA V3 update check:',e); }
    },{once:true});
  }

  document.addEventListener('DOMContentLoaded',()=>{
    document.body.classList.add('staff-app-mode');
    document.body.classList.remove('staff-app-workspace-open');
    setShellStatus();
    setTimeout(finishLaunch,80);
  },{once:true});
})();

/* ===== SOURCE SCRIPT BLOCK: ume-attendance-package-final-js ===== */
(function(){
  let umeAttendanceBundle=null;
  let umeAttendanceContext={className:"",term:"",session:""};

  function attendanceDb(role="classTeacher"){return role==="admin"?umeAdminDb():umeStaffDb();}
  function attendanceMessage(text,type="error"){
    const box=document.getElementById("umeAttendanceMessage");if(!box)return;
    box.textContent=text||"";box.className=`ume-attendance-message ${text?"show":""} ${type}`;
  }
  function currentSchoolYear(){return String(window.SAAF_CURRENT_ACADEMIC_YEAR||umeFinalFilters?.classTeacherYear||"").trim();}
  function attendanceClassChoices(){return [...new Set((umeMyClassAssignments||[]).map(r=>r.class_name).filter(Boolean))];}

  function ensureAttendanceCard(){
    const panel=document.getElementById("umeClassTeacherPanel");if(!panel||document.getElementById("umeAttendancePrepCard"))return;
    const card=document.createElement("div");card.id="umeAttendancePrepCard";card.className="ume-card ume-attendance-card";card.innerHTML=`
      <div class="ume-attendance-head">
        <div><h3>Student Attendance Preparation</h3><p class="ume-subtitle">Prepare Attendance anytime. You do not need to wait for Subject Teachers to submit Marks.</p></div>
        <span class="ume-attendance-badge">CLASS TEACHER ONLY</span>
      </div>
      <div class="ume-attendance-controls">
        <label class="ume-field">Academic Year / Session<input id="umeAttendanceSession" maxlength="40" placeholder="Example: 2083"></label>
        <label class="ume-field">Assigned Class<select id="umeAttendanceClass"><option value="">— Select Class —</option></select></label>
        <label class="ume-field">Term / Examination<input id="umeAttendanceTerm" list="umeAttendanceTermSuggestions" maxlength="100" placeholder="Example: Second Term"><datalist id="umeAttendanceTermSuggestions"></datalist></label>
        <button type="button" class="ume-btn ume-primary" onclick="umeAttendanceLoadEditor()">LOAD / PREPARE</button>
      </div>
      <div id="umeAttendanceEditor" class="ume-attendance-editor"><div class="ume-filter-prompt">Choose Academic Year, Assigned Class and Term / Examination to prepare Attendance.</div></div>
      <div id="umeAttendanceMessage" class="ume-attendance-message"></div>`;
    panel.insertBefore(card,panel.firstElementChild);
    populateAttendanceChoices();
  }

  function populateAttendanceChoices(){
    ensureAttendanceCard();
    const select=document.getElementById("umeAttendanceClass"),session=document.getElementById("umeAttendanceSession");if(!select)return;
    const classes=attendanceClassChoices(),current=select.value;
    select.innerHTML='<option value="">— Select Class —</option>'+classes.map(c=>`<option value="${umeEscape(c)}">${umeEscape(c)}</option>`).join("");
    if(classes.includes(current))select.value=current;else if(classes.length===1)select.value=classes[0];
    if(session&&!session.value)session.value=currentSchoolYear();
    refreshAttendanceTermSuggestions();
  }

  function refreshAttendanceTermSuggestions(){
    const list=document.getElementById("umeAttendanceTermSuggestions");if(!list)return;
    const cls=document.getElementById("umeAttendanceClass")?.value||"",session=document.getElementById("umeAttendanceSession")?.value||"";
    const terms=[...new Set((umeClassTeacherRows||[]).filter(r=>(!cls||r.class_name===cls)&&(!session||String(r.academic_session||"").trim()===String(session).trim())).map(r=>String(r.term_name||"").trim()).filter(Boolean))];
    list.innerHTML=terms.map(t=>`<option value="${umeEscape(t)}"></option>`).join("");
  }

  async function fetchAttendance(role,group){
    return await umeRpc(attendanceDb(role),"ume_get_attendance_bundle",{
      p_class_name:group.className,
      p_term_name:group.term,
      p_academic_session:group.session
    });
  }

  function attendanceEntryMap(bundle){return new Map((bundle?.entries||[]).map(e=>[String(e.student_id),e]));}
  function attendanceIsLocked(bundle){return bundle?.header?.status==="submitted";}

  function renderAttendanceEditor(bundle){
    const host=document.getElementById("umeAttendanceEditor");if(!host)return;
    const students=bundle?.students||[],entries=attendanceEntryMap(bundle),header=bundle?.header||null,locked=attendanceIsLocked(bundle);
    const opening=header?.total_opening_days??"";
    const stateClass=locked?"locked":bundle?.is_complete?"ready":header?"warn":"";
    const stateText=locked?"Submitted with the Class package — Attendance is locked.":bundle?.is_complete?"Attendance is saved and ready to go with the Class package.":header?"Saved Attendance needs review before package submission.":"New Attendance sheet — enter all Present Days and save.";
    host.innerHTML=`
      <div class="ume-attendance-summary">
        <label class="ume-field">Total School Opening Days<input id="umeAttendanceOpeningDays" type="number" min="1" max="366" step="1" inputmode="numeric" value="${umeEscape(opening)}" ${locked?"disabled":""} oninput="umeAttendanceOpeningChanged()"></label>
        <div class="ume-attendance-state ${stateClass}">${umeEscape(stateText)}</div>
      </div>
      <div class="ume-attendance-table-wrap"><table class="ume-attendance-table"><thead><tr><th>S.N.</th><th>Student ID</th><th>Student Name</th><th>Present Days</th></tr></thead><tbody>
      ${students.map((s,i)=>{const e=entries.get(String(s.student_id));return `<tr><td>${i+1}</td><td>${umeEscape(s.student_id)}</td><td><strong>${umeEscape(s.student_name||s.name||"")}</strong></td><td><input class="ume-attendance-present" data-student-id="${umeEscape(s.student_id)}" data-student-name="${umeEscape(s.student_name||s.name||"")}" type="number" min="0" max="${umeEscape(opening||366)}" step="1" inputmode="numeric" value="${e?.present_days??""}" ${locked?"disabled":""} oninput="umeAttendanceLimitPresent(this)"></td></tr>`;}).join("")||'<tr><td colspan="4">No students found in this Class.</td></tr>'}
      </tbody></table></div>
      <div class="ume-attendance-actions">
        <button type="button" class="ume-btn ume-success" onclick="umeAttendanceSave()" ${locked||!students.length?"disabled":""}>SAVE ATTENDANCE</button>
        ${header&&!locked?'<button type="button" class="ume-btn ume-danger" onclick="umeAttendanceDeleteDraft()">DELETE ATTENDANCE</button>':""}
        <button type="button" class="ume-btn ume-secondary" onclick="umeAttendanceLoadEditor()">↻ REFRESH</button>
      </div>`;
  }

  window.umeAttendanceOpeningChanged=function(){
    const opening=Number(document.getElementById("umeAttendanceOpeningDays")?.value||0);
    document.querySelectorAll(".ume-attendance-present").forEach(input=>{
      input.max=opening>0?String(opening):"366";
      if(opening>0&&input.value!==""&&Number(input.value)>opening)input.value=String(opening);
    });
  };
  window.umeAttendanceLimitPresent=function(input){
    const opening=Number(document.getElementById("umeAttendanceOpeningDays")?.value||0);if(input.value==="")return;
    let n=Number(input.value);if(!Number.isFinite(n))return;
    n=Math.trunc(n);if(n<0)n=0;if(opening>0&&n>opening)n=opening;input.value=String(n);
  };

  window.umeAttendanceLoadEditor=async function(){
    ensureAttendanceCard();attendanceMessage("");
    const className=document.getElementById("umeAttendanceClass")?.value||"";
    const term=document.getElementById("umeAttendanceTerm")?.value.trim()||"";
    const session=document.getElementById("umeAttendanceSession")?.value.trim()||"";
    if(!className||!term||!session){attendanceMessage("Choose Academic Year, Assigned Class and Term / Examination first.");return;}
    const host=document.getElementById("umeAttendanceEditor");host.innerHTML='<div class="ume-empty">Loading Attendance...</div>';
    try{
      umeAttendanceContext={className,term,session};
      umeAttendanceBundle=await fetchAttendance("classTeacher",umeAttendanceContext);
      renderAttendanceEditor(umeAttendanceBundle);
    }catch(error){host.innerHTML='<div class="ume-filter-prompt">Attendance could not be loaded.</div>';attendanceMessage(error.message||"Unknown error");}
  };

  window.umeAttendanceSave=async function(){
    attendanceMessage("");
    const className=umeAttendanceContext.className||document.getElementById("umeAttendanceClass")?.value||"";
    const term=umeAttendanceContext.term||document.getElementById("umeAttendanceTerm")?.value.trim()||"";
    const session=umeAttendanceContext.session||document.getElementById("umeAttendanceSession")?.value.trim()||"";
    const opening=Number(document.getElementById("umeAttendanceOpeningDays")?.value||0);
    if(!Number.isInteger(opening)||opening<1||opening>366){attendanceMessage("Total School Opening Days must be a whole number between 1 and 366.");return;}
    const inputs=[...document.querySelectorAll(".ume-attendance-present")];if(!inputs.length){attendanceMessage("No students were found for Attendance.");return;}
    const entries=[];
    for(const input of inputs){
      if(input.value===""){attendanceMessage(`Enter Present Days for ${input.dataset.studentName||input.dataset.studentId}.`);input.focus();return;}
      const present=Number(input.value);if(!Number.isInteger(present)||present<0||present>opening){attendanceMessage(`Present Days must be a whole number from 0 to ${opening}.`);input.focus();return;}
      entries.push({student_id:input.dataset.studentId,present_days:present});
    }
    const button=document.querySelector("#umeAttendanceEditor .ume-btn.ume-success"),old=button?.textContent||"SAVE ATTENDANCE";if(button){button.disabled=true;button.textContent="SAVING...";}
    try{
      await umeRpc(umeStaffDb(),"ume_save_attendance",{p_class_name:className,p_term_name:term,p_academic_session:session,p_total_opening_days:opening,p_entries:entries});
      umeAttendanceBundle=await fetchAttendance("classTeacher",{className,term,session});renderAttendanceEditor(umeAttendanceBundle);attendanceMessage("Attendance saved successfully. It is ready to go with the Class package.","success");
      const host=document.getElementById("umeClassTeacherGroups");if(host)umeRenderGroupCards("classTeacher",umeRoleGroups("classTeacher"),host);
    }catch(error){attendanceMessage("Attendance could not be saved: "+(error.message||"Unknown error"));}
    finally{if(button&&document.body.contains(button)){button.disabled=false;button.textContent=old;}}
  };

  window.umeAttendanceDeleteDraft=async function(){
    attendanceMessage("");
    const className=umeAttendanceContext.className||document.getElementById("umeAttendanceClass")?.value||"";
    const term=umeAttendanceContext.term||document.getElementById("umeAttendanceTerm")?.value.trim()||"";
    const session=umeAttendanceContext.session||document.getElementById("umeAttendanceSession")?.value.trim()||"";
    if(!className||!term||!session)return;
    if(!confirm(`DELETE saved Attendance for ${className} — ${term}?\n\nThis is allowed only before the Class package is submitted. Marks files will not be deleted.`))return;
    try{
      await umeRpc(umeStaffDb(),"ume_delete_attendance_draft",{p_class_name:className,p_term_name:term,p_academic_session:session});
      umeAttendanceBundle=await fetchAttendance("classTeacher",{className,term,session});
      renderAttendanceEditor(umeAttendanceBundle);
      attendanceMessage("Attendance deleted. You can prepare a new Attendance sheet anytime before package submission.","success");
      const host=document.getElementById("umeClassTeacherGroups");if(host)umeRenderGroupCards("classTeacher",umeRoleGroups("classTeacher"),host);
    }catch(error){attendanceMessage("Attendance could not be deleted: "+(error.message||"Unknown error"));}
  };

  window.umeAttendanceOpenForGroup=async function(index){
    const group=umeRoleGroups("classTeacher")[index];if(!group)return;ensureAttendanceCard();
    document.getElementById("umeAttendanceSession").value=group.session;
    document.getElementById("umeAttendanceClass").value=group.className;
    document.getElementById("umeAttendanceTerm").value=group.term;
    refreshAttendanceTermSuggestions();
    await window.umeAttendanceLoadEditor();
    document.getElementById("umeAttendancePrepCard")?.scrollIntoView({behavior:"smooth",block:"start"});
  };

  function attendanceReadonlyHtml(bundle,group){
    const h=bundle?.header;if(!h)return "";
    const rows=(bundle.entries||[]).map((e,i)=>`<tr><td>${i+1}</td><td>${umeEscape(e.student_id)}</td><td><strong>${umeEscape(e.student_name)}</strong></td><td>${umeEscape(e.present_days)}</td></tr>`).join("");
    return `<div class="ume-card ume-attendance-readonly"><div class="ume-group-head"><div><h4>Attendance</h4><div class="ume-meta">${umeEscape(group.className)} • ${umeEscape(group.term)} • Academic Session ${umeEscape(group.session)}</div></div><div class="ume-attendance-state ${h.status==="submitted"?"locked":"ready"}">Total School Opening Days: <strong>${umeEscape(h.total_opening_days)}</strong></div></div><div class="ume-attendance-table-wrap"><table class="ume-attendance-table"><thead><tr><th>S.N.</th><th>Student ID</th><th>Student Name</th><th>Present Days</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No Attendance rows found.</td></tr>'}</tbody></table></div></div>`;
  }

  async function decoratePackageAttendance(role,groups,host){
    if(!host||!groups?.length)return;const cards=[...host.children].filter(el=>el.classList?.contains("ume-group"));if(!cards.length)return;
    const token=String(Date.now())+Math.random();host.dataset.attendanceToken=token;
    await Promise.all(groups.map(async(group,index)=>{
      const card=cards[index];if(!card)return;
      try{
        const bundle=await fetchAttendance(role,group);if(host.dataset.attendanceToken!==token)return;
        const old=card.querySelector(".ume-attendance-package-status");old?.remove();
        const target=card.querySelector(".ume-group-head > div:first-child")||card.querySelector(".ume-group-head");
        let text="Attendance: NOT SAVED",cls="missing";
        if(bundle?.header){if(bundle.header.status==="submitted"){text="Attendance: INCLUDED IN PACKAGE";cls="ready";}else if(bundle.is_complete){text="Attendance: READY";cls="ready";}else{text="Attendance: NEEDS REVIEW";cls="draft";}}
        if(bundle?.header||role==="classTeacher")target?.insertAdjacentHTML("beforeend",`<div class="ume-meta ume-attendance-package-status ${cls}">${umeEscape(text)}</div>`);
        if(role==="classTeacher"){
          const actions=card.querySelector(".ume-group-actions");if(actions&&!actions.querySelector(".ume-attendance-open-btn"))actions.insertAdjacentHTML("beforeend",`<button type="button" class="ume-btn ume-secondary ume-attendance-open-btn" onclick="umeAttendanceOpenForGroup(${index})">ATTENDANCE</button>`);
        }
        if(role==="admin"&&bundle?.header){
          const actions=card.querySelector(".ume-group-actions");if(actions&&!actions.querySelector(".ume-attendance-admin-delete-btn"))actions.insertAdjacentHTML("beforeend",`<button type="button" class="ume-btn ume-danger ume-attendance-admin-delete-btn" onclick="umeAdminDeleteAttendance(${index})">DELETE ATTENDANCE</button>`);
        }
      }catch(_error){}
    }));
  }

  window.umeAdminDeleteAttendance=async function(index){
    const group=umeRoleGroups("admin")[index];if(!group)return;
    if(!confirm(`DELETE Attendance only for ${group.className} — ${group.term} — ${group.session}?\n\nThe submitted Marks package will remain. This removes Total School Opening Days and all Present Days from this package.`))return;
    try{
      await umeRpc(umeAdminDb(),"ume_admin_delete_attendance",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session});
      umeSelectedGroups.admin=null;
      await renderAdminMarks();
      alert("Attendance deleted successfully. The Marks package is unchanged.");
    }catch(error){alert("Attendance could not be deleted: "+(error.message||"Unknown error"));}
  };

  const previousRenderGroupCards=umeRenderGroupCards;
  umeRenderGroupCards=function(role,groups,host){const result=previousRenderGroupCards(role,groups,host);setTimeout(()=>decoratePackageAttendance(role,groups,host),0);return result;};

  const previousLoadClassTeacherInbox=umeLoadClassTeacherInbox;
  umeLoadClassTeacherInbox=async function(){ensureAttendanceCard();populateAttendanceChoices();const result=await previousLoadClassTeacherInbox();populateAttendanceChoices();refreshAttendanceTermSuggestions();return result;};

  const previousClassTeacherFilterChanged=umeClassTeacherFilterChangedFinal;
  umeClassTeacherFilterChangedFinal=function(){previousClassTeacherFilterChanged();const year=document.getElementById("umeClassTeacherYearSelect")?.value||"",cls=document.getElementById("umeClassTeacherClassSelect")?.value||"";if(year)document.getElementById("umeAttendanceSession").value=year;if(cls)document.getElementById("umeAttendanceClass").value=cls;refreshAttendanceTermSuggestions();};

  const previousSubmitPackage=umeSubmitPackage;
  umeSubmitPackage=async function(index){
    const group=umeRoleGroups("classTeacher")[index];if(!group)return;
    try{
      const attendance=await fetchAttendance("classTeacher",group);
      if(!attendance?.header||!attendance.is_complete){
        document.getElementById("umeAttendanceSession").value=group.session;document.getElementById("umeAttendanceClass").value=group.className;document.getElementById("umeAttendanceTerm").value=group.term;
        await window.umeAttendanceLoadEditor();document.getElementById("umeAttendancePrepCard")?.scrollIntoView({behavior:"smooth",block:"start"});
        alert("Complete and SAVE Student Attendance before submitting this Class package.");return;
      }
    }catch(error){alert("Attendance check failed: "+(error.message||"Unknown error"));return;}
    return await previousSubmitPackage(index);
  };

  umeViewCombined=async function(role,index){
    const host=umeGroupDetailHost(role);host.innerHTML='<div class="ume-card"><div class="ume-empty">Loading combined Class package...</div></div>';
    try{
      const selected=await umeLoadGroupBundles(role,index);
      const attendance=await fetchAttendance(role,selected.group);
      host.innerHTML=umeCombinedTableHtml(selected.group,selected.bundles)+attendanceReadonlyHtml(attendance,selected.group);
      host.scrollIntoView({behavior:"smooth",block:"start"});
    }catch(error){host.innerHTML=`<div class="ume-card"><div class="ume-empty">Could not load combined package: ${umeEscape(error.message||"Unknown error")}</div></div>`;}
  };

  function writeWorkbookWithAttendance(group,bundles,attendance){
    if(!window.XLSX)throw new Error("Excel export library is still loading. Try again in a moment.");
    const {state,rows}=umeExcelState(group,bundles);if(!state.bundles.length)throw new Error("No Subject is available for Export.");
    const book=XLSX.utils.book_new(),sheet=XLSX.utils.aoa_to_sheet(rows);
    const lastCol=Math.max(2,2+state.bundles.reduce((sum,b)=>sum+b.components.length,0));
    const merges=[{s:{r:0,c:0},e:{r:0,c:lastCol}},{s:{r:1,c:0},e:{r:1,c:lastCol}},{s:{r:4,c:0},e:{r:5,c:0}},{s:{r:4,c:1},e:{r:5,c:1}},{s:{r:4,c:2},e:{r:5,c:2}}];
    let col=3;for(const b of state.bundles){const start=col,end=col+b.components.length-1;if(end>=start)merges.push({s:{r:4,c:start},e:{r:4,c:end}});col+=b.components.length;}
    sheet["!merges"]=merges;sheet["!cols"]=[{wch:8},{wch:16},{wch:28},...Array.from({length:Math.max(0,lastCol-2)},()=>({wch:19}))];
    XLSX.utils.book_append_sheet(book,sheet,"Combined Marks");

    const h=attendance?.header;
    if(h){
      const attendanceRows=[
        ["ST. AUGUSTINE ACADEMIC FOUNDATION"],
        ["ATTENDANCE"],
        ["Class",group.className,"Term / Examination",group.term,"Academic Session",group.session],
        ["Total School Opening Days",h.total_opening_days],
        [],
        ["S.N.","Student ID","Student Name","Present Days"]
      ];
      (attendance?.entries||[]).forEach((e,i)=>attendanceRows.push([i+1,e.student_id,e.student_name,e.present_days]));
      const attendanceSheet=XLSX.utils.aoa_to_sheet(attendanceRows);
      attendanceSheet["!merges"]=[{s:{r:0,c:0},e:{r:0,c:3}},{s:{r:1,c:0},e:{r:1,c:3}}];
      attendanceSheet["!cols"]=[{wch:8},{wch:16},{wch:30},{wch:18}];
      XLSX.utils.book_append_sheet(book,attendanceSheet,"Attendance");
    }
    XLSX.writeFile(book,`${umeSafeFile(group.className)}_${umeSafeFile(group.term)}_${umeSafeFile(group.session)}_Combined_With_Attendance.xlsx`,{compression:true});
  }

  umeExportCombined=async function(role,index){
    try{const selected=await umeLoadGroupBundles(role,index);const attendance=await fetchAttendance(role,selected.group);writeWorkbookWithAttendance(selected.group,selected.bundles,attendance);}
    catch(error){alert("Excel could not be exported: "+(error.message||"Unknown error"));}
  };

  document.addEventListener("DOMContentLoaded",()=>{ensureAttendanceCard();populateAttendanceChoices();},{once:true});
})();
