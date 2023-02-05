const urlBase = 'http://group3isamazing.xyz/LAMPAPI'
const extension = 'php'

let userId = 0
let firstName = ''
let lastName = ''
let searchStr = ''

const ids = []

let currentPage = 1
const prevBtn = document.getElementById('previous-page')
const nextBtn = document.getElementById('next-page')
const pageCounter = document.getElementById('page-counter')
const entriesPerPage = 10

function doLogin() {
  userId = 0
  firstName = ''
  lastName = ''

  let login = document.getElementById('loginName').value
  let password = document.getElementById('loginPassword').value
  //	var hash = md5( password );

  document.getElementById('loginResult').innerHTML = ''

  let tmp = { login: login, password: password }
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp)

  let url = urlBase + '/Login.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText)
        userId = jsonObject.id

        if (userId < 1) {
          document.getElementById('loginResult').innerHTML =
            'User/Password combination incorrect'
          return
        }

        firstName = jsonObject.firstName
        lastName = jsonObject.lastName

        saveCookie()

        window.location.href = 'contact.html'
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    document.getElementById('loginResult').innerHTML = err.message
  }
}

function doRegister() {
  userId = 0
  firstName = ''
  lastName = ''

  firstName = document.getElementById('firstName').value
  lastName = document.getElementById('lastName').value
  let login = document.getElementById('loginName-s').value
  let password = document.getElementById('loginPassword-s').value
  //	var hash = md5( password );

  document.getElementById('loginResult').innerHTML = ''

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    login: login,
    password: password,
  }
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp)

  let url = urlBase + '/Register.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText)
        userId = jsonObject.id

        if (userId < 1) {
          document.getElementById('loginResult').innerHTML =
            'User/Password combination incorrect'
          return
        }

        firstName = jsonObject.firstName
        lastName = jsonObject.lastName

        saveCookie()

        window.location.href = 'contact.html'
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    document.getElementById('loginResult').innerHTML = err.message
  }
}

function saveCookie() {
  let minutes = 20
  let date = new Date()
  date.setTime(date.getTime() + minutes * 60 * 1000)
  document.cookie =
    'firstName=' +
    firstName +
    ',lastName=' +
    lastName +
    ',userId=' +
    userId +
    ';expires=' +
    date.toGMTString()
}

function readCookie() {
  userId = -1
  let data = document.cookie
  let splits = data.split(',')
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim()
    let tokens = thisOne.split('=')
    if (tokens[0] == 'firstName') {
      firstName = tokens[1]
    } else if (tokens[0] == 'lastName') {
      lastName = tokens[1]
    } else if (tokens[0] == 'userId') {
      userId = parseInt(tokens[1].trim())
    }
  }

  if (userId < 0) {
    window.location.href = 'index.html'
  } else {
    document.getElementById('userName').innerHTML =
      'Welcome ' +
      capitalizeFirstLetter(firstName) +
      ' ' +
      capitalizeFirstLetter(lastName)
  }
}

function doLogout() {
  userId = 0
  firstName = ''
  lastName = ''
  document.cookie = 'firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
  window.location.href = 'index.html'
}

function addContact() {
  console.log('addContact Called')
  let newContactName = document.getElementById('contactName').value
  let newContactPhone = document.getElementById('contactPhone').value
  let newContactEmail = document.getElementById('contactEmail').value
  document.getElementById('contactAddResult').innerHTML = ''
  let nameSplit = newContactName.split(' ')
  if (nameSplit.length == 2) {
    nameSplit[0] = capitalizeFirstLetter(nameSplit[0])
    nameSplit[1] = capitalizeFirstLetter(nameSplit[1])
    newContactName = nameSplit.join(' ')
  }

  let tmp = {
    name: newContactName,
    phone: newContactPhone,
    email: newContactEmail,
    userID: userId,
  }
  let jsonPayload = JSON.stringify(tmp)
  // console.log(jsonPayload)
  // debugger
  let url = urlBase + '/AddContact.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('contactAddResult').innerHTML =
          'Contact has been added'
        // console.log('this worked')
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    document.getElementById('contactAddResult').innerHTML = err.message
  }
  closeForm()
}

function searchContact(
  srch = document.getElementById('searchName').value,
  currentPage = 1
) {
  // let srch = document.getElementById('searchName').value
  // document.getElementById('contactSearchResult').innerHTML = ''
  // searchStr = document.getElementById('searchName').value
  document.getElementById('tableDiv').style.display = 'block'
  let text = ''

  let tmp = { Name: srch, UserID: userId }
  let jsonPayload = JSON.stringify(tmp)

  let url = urlBase + '/SearchContacts.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById('contactSearchResult').innerHTML =
        //   'Contact(s) has been retrieved'
        let jsonObject = JSON.parse(`${xhr.responseText}`)
        // console.log(jsonObject)
        if (jsonObject.results.length <= entriesPerPage) {
          prevBtn.style.display = 'none'
          nextBtn.style.display = 'none'
        } else {
          prevBtn.style.display = 'inline-block'
          nextBtn.style.display = 'inline-block'
        }

        pageCounter.innerHTML = `Page ${currentPage} of ${Math.ceil(
          jsonObject.results.length / entriesPerPage
        )}`
        prevBtn.disabled = currentPage === 1
        nextBtn.disabled =
          currentPage === Math.ceil(jsonObject.results.length / entriesPerPage)

        const startIndex = (currentPage - 1) * entriesPerPage
        const endIndex = startIndex + entriesPerPage
        const pageData = jsonObject.results.slice(startIndex, endIndex)

        // console.log(pageData)

        let i = 0
        pageData.forEach((entry) => {
          ids[i] = entry.ID
          text += "<tr id='row" + i + "'>"
          text += "<td id='Name" + i + "'><span>" + entry.Name + '</span></td>'
          text +=
            "<td id='phone" + i + "'><span>" + entry.Email + '</span></td>'
          text +=
            "<td id='email" + i + "'><span>" + entry.Phone + '</span></td>'
          text +=
            '<td>' +
            "<button type='button' id='edit_button" +
            i +
            "' class='edit' onclick='edit_row(" +
            i +
            ")'>" +
            "<span class=''>Edit</span>" +
            '</button>' +
            "<button type='button' id='save_button" +
            i +
            "' value='Save' class='save' onclick='save_row(" +
            i +
            ")' style='display: none'>" +
            "<span class=''>Save</span>" +
            '</button>' +
            "<button type='button' onclick='delete_row(" +
            i +
            ")' class='delete'>" +
            "<span class=''>Delete</span> " +
            '</button>' +
            '</td>'
          text += '<tr/>'
          i++
        })

        document.getElementById('tbody').innerHTML = text
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    document.getElementById('contactSearchResult').innerHTML = err.message
  }
}

function edit_row(id) {
  document.getElementById('edit_button' + id).style.display = 'none'
  document.getElementById('save_button' + id).style.display = 'inline-block'

  let NameI = document.getElementById('Name' + id)
  let email = document.getElementById('email' + id)
  let phone = document.getElementById('phone' + id)

  let name_data = NameI.innerText
  let email_data = email.innerText
  let phone_data = phone.innerText

  NameI.innerHTML =
    "<input type='text' id='name_text" + id + "' value='" + name_data + "'>"
  email.innerHTML =
    "<input type='text' id='email_text" + id + "' value='" + email_data + "'>"
  phone.innerHTML =
    "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}

function save_row(no) {
  let newName_val = document.getElementById('name_text' + no).value
  let newEmail_val = document.getElementById('email_text' + no).value
  let newPhone_val = document.getElementById('phone_text' + no).value
  let id_val = ids[no]

  document.getElementById('Name' + no).innerHTML = newName_val
  document.getElementById('email' + no).innerHTML = newEmail_val
  document.getElementById('phone' + no).innerHTML = newPhone_val

  document.getElementById('edit_button' + no).style.display = 'inline-block'
  document.getElementById('save_button' + no).style.display = 'none'

  let tmp = {
    id: id_val,
    name: newName_val,
    phone: newPhone_val,
    email: newEmail_val,
  }

  let jsonPayload = JSON.stringify(tmp)
  console.log(jsonPayload)

  let url = urlBase + '/UpdateContact.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('Contact has been updated')
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    console.log(err.message)
  }
}

function delete_row(no) {
  let name_val = document.getElementById('Name' + no).innerText
  let check = confirm('Confirm deletion of contact: ' + name_val)
  if (check === true) {
    document.getElementById('row' + no + '').outerHTML = ''
    let id_val = ids[no]
    let tmp = {
      ID: id_val,
    }

    let jsonPayload = JSON.stringify(tmp)

    let url = urlBase + '/DeleteContact.' + extension

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log('Contact has been deleted')
          searchContact(searchStr)
        }
      }
      xhr.send(jsonPayload)
    } catch (err) {
      console.log(err.message)
    }
  }
}

prevBtn.addEventListener('click', () => {
  currentPage--
  searchContact(searchStr, currentPage)
})

nextBtn.addEventListener('click', () => {
  currentPage++
  searchContact(searchStr, currentPage)
})

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function openForm() {
  document.getElementById('addForm').style.display = 'flex'
  document.getElementById('contact-container').style.background =
    'rgba(255,255,255,.8)'
  document.getElementById('contact-container').style.width = '100%'
  document.getElementById('tableDiv').style.opacity = '0.2'
  // document.getElementById('bg-contact').style.backgroundImage =
  //   "url('../images/bg-sunset2-opaque50.png')"
}

function closeForm() {
  document.getElementById('addForm').style.display = 'none'
  document.getElementById('contact-container').style.background = ''
  document.getElementById('contact-container').style.width = '90%'
  document.getElementById('tableDiv').style.opacity = '1'
}
