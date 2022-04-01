const dropZone = document.querySelector('.drop-zone')
const fileBtn = document.querySelector('#file-btn')
const browerBtn = document.querySelector('.brower-btn')
const bgProgress = document.querySelector('.bg-progress')
const percentText = document.querySelector('.percent-text')
const percentLine = document.querySelector('.percent-line')
const progressContainer = document.querySelector('.progress-container')
const linkInput = document.querySelector('.link-input')
const linkSharingContainer = document.querySelector('.link-sharing-container')
const copyIcon = document.querySelector('.copy-icon')

const emailContainer = document.querySelector('.email-container')
const btnSubmit = document.querySelector('#btn-submit')
const emailForm = document.forms['form-email']

const emailFromInput = document.querySelector("#email-from")
const emailToInput = document.querySelector("#email-to")
const sharingContainer = document.querySelector('.sharing-container')
const toastMessage = document.querySelector('.toast-message')

const uploadURL = 'https://ppshare.herokuapp.com/files/uploads'


dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    if(!e.target.classList.contains('dragged')) {
        e.target.classList.add('dragged')
    }
}) 

dropZone.addEventListener('dragleave', function(e) {
    e.target.classList.remove('dragged')
})

dropZone.addEventListener('drop', function(e) {
    e.preventDefault()
    e.target.classList.remove('dragged')
    files = e.dataTransfer.files
    if(files.length) {
        fileBtn.files = files 
        requestUploadFile()
    }
})

browerBtn.addEventListener('click', function(e) {
    fileBtn.click()
})
fileBtn.addEventListener('change', function(e) {
    requestUploadFile()
})

// Resquest Upload
const requestUploadFile =  () =>{
    progressContainer.style.display = 'block'
    const file = fileBtn.files[0]
    const formData = new FormData()
    formData.append("myfile",file)

    const xmlRequest = new XMLHttpRequest()
    xmlRequest.onreadystatechange = () => {
        if(xmlRequest.readyState === XMLHttpRequest.DONE){
            console.log('DONE')
            console.log(xmlRequest.response);
            if(JSON.parse(xmlRequest.response).error){
                showToastMessage(JSON.parse(xmlRequest.response).error)
            }else {
                sharingContainer.style.display = 'block'
                showLinkDownload(JSON.parse(xmlRequest.response))
            }
        }
    }
    xmlRequest.upload.onprogress = updateProgress
    xmlRequest.open('POST', uploadURL)
    xmlRequest.send(formData)
}

const updateProgress = (e) => {
    let percent = Math.round(( e.loaded / e.total)*100)
    let scale = Math.round(( e.loaded / e.total))
    bgProgress.style.transform = `scaleX(${scale})`
    percentLine.style.transform = `scaleX(${scale})`
    percentText.innerText = percent + '%'
}   

const showLinkDownload = function({file: link}) {
    console.log(link)
    linkSharingContainer.style.display = 'block'
    linkInput.value = link
    // thực hiện khi upload xong
    // progressContainer.style.display = 'none'
    setTimeout(() =>{
        progressContainer.style.display = 'none'
    }, 3000)
    emailContainer.style.display = 'block'
}

// Chức năng copy link qua icon copy icon

copyIcon.addEventListener('click', function() {
    linkInput.select()
    document.execCommand('copy')
    showToastMessage('Link Copired')
})

// Sự kiện cho Form Email
emailForm.addEventListener('submit', function(e) {
    e.preventDefault()
    let uuid = linkInput.value
    if(linkInput.value){
        uuid = linkInput.value.split('/').splice(-1, 1)[0]
    }
    const emailFrom  = emailFromInput.value
    const emailTo  = emailToInput.value

    const formData = {
        uuid,
        emailFrom,
        emailTo,
    }
    // gui request len server 
    const emailURL = 'https://ppshare.herokuapp.com/files/sends'
    fetch(emailURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then( (res) => {
            return res.json()
        })
        .then( ({success}) => {
            if(success) {
                setTimeout(() => {
                    sharingContainer.style.display = 'none'
                }, 1000)
                emailFromInput.value = ''
                emailToInput.value= ''
                showToastMessage('Email Send')
            }
        })
})

// show Toast Message
const showToastMessage = function(message, time = 2000) {
    toastMessage.innerText = message
    toastMessage.style.bottom = '10px'
    setTimeout( () => {
        toastMessage.style.bottom = '-50px'
    }, time)
}