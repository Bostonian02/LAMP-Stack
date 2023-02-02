const urlBase = 'http://group3isamazing.xyz/LAMPAPI'
const extension = 'php'

let userId = 0
let firstName = ''
let lastName = ''

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

  let tmp = {
    name: newContactName,
    phone: newContactPhone,
    email: newContactEmail,
    userID: userId,
  }
  let jsonPayload = JSON.stringify(tmp)
  console.log(jsonPayload)
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

function searchContact() {
  let srch = document.getElementById('searchName').value
  document.getElementById('contactSearchResult').innerHTML = ''

  let contactList = ''

  let tmp = { Name: srch, UserID: userId }
  let jsonPayload = JSON.stringify(tmp)

  let url = urlBase + '/SearchContacts.' + extension

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('contactSearchResult').innerHTML =
          'Contact(s) has been retrieved'
        let jsonObject = JSON.parse(xhr.responseText)

        for (let i = 0; i < jsonObject.results.length; i++) {
          contactList += jsonObject.results[i]
          if (i < jsonObject.results.length - 1) {
            contactList += '<br />\r\n'
          }
        }

        console.log(contactList)

        document.getElementsByTagName('p')[0].innerHTML = contactList
      }
    }
    xhr.send(jsonPayload)
  } catch (err) {
    document.getElementById('contactSearchResult').innerHTML = err.message
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function openForm() {
  document.getElementById('addForm').style.display = 'flex'
  document.getElementById('contact-container').style.background =
    'rgba(255,255,255,.8)'
  document.getElementById('contact-container').style.width = '100%'
  // document.getElementById('bg-contact').style.backgroundImage =
  //   "url('../images/bg-sunset2-opaque50.png')"
}

function closeForm() {
  document.getElementById('addForm').style.display = 'none'
  document.getElementById('contact-container').style.background = ''
  document.getElementById('contact-container').style.width = '90%'
}
