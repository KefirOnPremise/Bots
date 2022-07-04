import fetch from "node-fetch"


const getApi = async () => {
    let randomUser = {
	'gender': null,
	'name': {
	    'first': null,
	    'last': null
	},
	'email': null,
	'login': {
	    'username': null,
	    'password': null,
	},
	'birth': {
	    'date': null,
	    'age': null
	},
	'picture': null
    }

    const api = 'https://randomuser.me/api/'
    const result = await fetch(api)
	  .then(x => x.json())
	  .then(x => {
	      randomUser.gender = x.results[0].gender,
	      randomUser.name.first = x.results[0].name.first,
	      randomUser.name.last = x.results[0].name.last,
	      randomUser.email = x.results[0].email,
	      randomUser.login.username =
		  x.results[0].login.username,
	      randomUser.login.password =
		  x.results[0].login.password,
	      randomUser.birth.date =
		  x.results[0].dob.date,
	      randomUser.birth.age =
		  x.results[0].dob.age,
	      randomUser.picture = x.results[0].picture.medium
	  })
	  .catch(function(error) {
	      console.log(`An error occured - ${error}`)
	  })

    return randomUser
}

let eee = await getApi()
console.log(eee)
