const cl = console.log

const BASE_URL = `https://jsonplaceholder.typicode.com`
const MOVIE_URL = `${BASE_URL}/posts`

const movieForm = document.getElementById('movieForm')
const titleControl = document.getElementById('title')
const directorControl = document.getElementById('director')
const genreControl = document.getElementById('genre')
const addMovieBtn = document.getElementById('addMovieBtn')
const updateMovieBtn = document.getElementById('updateMovieBtn')
const spinner = document.getElementById('spinner')

let moviesArr = []
let updateId = null

function snackbar(msg, icon){
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

fetchMovies()

function createMovieCards(arr){
    const movieContainer = document.getElementById('movieContainer')
    let result = ''

    arr.forEach(movie => {
        result += `
            <div class="col-md-3 mb-3" id="${movie.id}">
                <div class="card movie-card h-100">

                    <div class="card-header">
                        <h3>${movie.title}</h3>
                    </div>

                    <div class="card-body">
                        <p class="movie-director">Director : ${movie.director || movie.body}</p>
                        <p class="movie-genre">Genre : ${movie.genre || movie.userId}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-outline-info">
                            Edit
                        </button>

                        <button onclick="onRemove(this)" class="btn btn-sm btn-outline-danger">
                            Remove
                        </button>
                    </div>

                </div>
            </div>
        `
    })

    movieContainer.innerHTML = result
}

function fetchMovies(){
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open('GET', MOVIE_URL)
    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)

            moviesArr = [...data]

            createMovieCards(data.reverse())

            spinner.classList.add('d-none')
        }else{
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }

    xhr.onerror = function(){
        spinner.classList.add('d-none')
        snackbar('Something went wrong', 'error')
    }
}

function onMovieSubmit(eve){
    eve.preventDefault()

    if(
        !titleControl.value.trim() ||
        !directorControl.value.trim() ||
        !genreControl.value.trim()
    ){
        Swal.fire({
            title: 'All Fields Are Required',
            text: 'Please fill all the fields before submitting.',
            icon: 'warning',
            confirmButtonText: 'OK'
        })
        return
    }

    let MOVIE_OBJ = {
        title: titleControl.value,
        director: directorControl.value,
        genre: genreControl.value
    }

    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open('POST', MOVIE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify(MOVIE_OBJ))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            res.title = MOVIE_OBJ.title
            res.director = MOVIE_OBJ.director
            res.genre = MOVIE_OBJ.genre

            movieForm.reset()

            let col = document.createElement('div')
            col.className = 'col-md-3 mb-3'
            col.id = res.id

            col.innerHTML = `
                <div class="card movie-card h-100">

                    <div class="card-header">
                        <h3>${res.title}</h3>
                    </div>

                    <div class="card-body">
                        <p class="movie-director">Director : ${res.director}</p>
                        <p class="movie-genre">Genre : ${res.genre}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-outline-info">
                            Edit
                        </button>

                        <button onclick="onRemove(this)" class="btn btn-sm btn-outline-danger">
                            Remove
                        </button>
                    </div>

                </div>
            `

            const movieContainer = document.getElementById('movieContainer')
            movieContainer.prepend(col)

            spinner.classList.add('d-none')
            snackbar(`New movie with id ${res.id} created successfully !!!`, 'success')
        }else{
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }

    xhr.onerror = function(){
        spinner.classList.add('d-none')
        snackbar('Something went wrong', 'error')
    }
}

function onEdit(ele){
    updateId = ele.closest('.col-md-3').id

    let EDIT_URL = `${BASE_URL}/posts/${updateId}`

    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open('GET', EDIT_URL)
    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            titleControl.value = res.title
            directorControl.value = res.body
            genreControl.value = res.userId

            addMovieBtn.classList.add('d-none')
            updateMovieBtn.classList.remove('d-none')

            spinner.classList.add('d-none')
        }else{
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }
}

function onUpdateMovie(){
    if(
        !titleControl.value.trim() ||
        !directorControl.value.trim() ||
        !genreControl.value.trim()
    ){
        Swal.fire({
            title: 'All Fields Are Required',
            text: 'Please fill all the fields before updating.',
            icon: 'warning',
            confirmButtonText: 'OK'
        })
        return
    }

    let UPDATE_OBJ = {
        title: titleControl.value,
        director: directorControl.value,
        genre: genreControl.value
    }

    spinner.classList.remove('d-none')

    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PATCH', UPDATE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify(UPDATE_OBJ))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let card = document.getElementById(updateId)

            card.querySelector('h3').innerHTML = UPDATE_OBJ.title
            card.querySelector('.movie-director').innerHTML = `Director : ${UPDATE_OBJ.director}`
            card.querySelector('.movie-genre').innerHTML = `Genre : ${UPDATE_OBJ.genre}`

            movieForm.reset()

            addMovieBtn.classList.remove('d-none')
            updateMovieBtn.classList.add('d-none')

            spinner.classList.add('d-none')

            snackbar(`Movie with id ${updateId} updated successfully !!!`, 'success')

            updateId = null
        }else{
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }
}

function onRemove(ele){
    let REMOVE_ID = ele.closest('.col-md-3').id

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this movie?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'Cancel'
    }).then(result => {
        if(result.isConfirmed){
            spinner.classList.remove('d-none')

            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE', REMOVE_URL)
            xhr.send(null)

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299){
                    document.getElementById(REMOVE_ID).remove()

                    spinner.classList.add('d-none')
                    snackbar(`Movie with id ${REMOVE_ID} removed successfully !!!`, 'success')
                }else{
                    spinner.classList.add('d-none')
                    snackbar('Something went wrong', 'error')
                }
            }
        }
    })
}

movieForm.addEventListener('submit', onMovieSubmit)
updateMovieBtn.addEventListener('click', onUpdateMovie)