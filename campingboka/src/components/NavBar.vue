<template>
    <nav class="navbar">
        <router-link to="/" class="nav-link" active-class="active"><button>Dashboard</button></router-link>
        <router-link to="/book" class="nav-link" active-class="active"><button>Book</button></router-link>
        <router-link to="/map" class="nav-link" active-class="active"><button>Kart</button></router-link>
        <router-link to="/control" class="nav-link" active-class="active"><button>Kontroll</button></router-link>
        <router-link to="/boatRental" class="nav-link" active-class="active"><button>Båtutleie</button></router-link>
        <router-link to="/weather" class="nav-link" active-class="active"><button>Været</button></router-link>
    </nav>
  </template>


<script>
export default{
    name: 'NavBar'}
</script>


<style>
    .navbar{
        display: flex;
        justify-content: space-around;
        height: 50px;
        background-color: #394856;
    }

    .navbar button{
        background-color: #394856;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        height: 100%;
        outline: none; 
        border-color: #394856;
        border-radius: 7px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .nav-link {
        text-decoration: none;
        width: 100%;
    }

    .nav-link.router-link-active button,
    .nav-link.router-link-exact-active button,
    .nav-link.router-link-active button:hover,
    .nav-link.router-link-exact-active button:hover {
        background-color: white !important;
        color: #333 !important;
        border-color: #394856;
        border-radius: 7px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

    }

    .navbar button:not(.nav-link.router-link-active button):hover,
    .navbar button:not(.nav-link.router-link-exact-active button):hover {
        background-color: #252f38;
    }

    .navbar button a {
        text-decoration: none;
        color: black;
    }

    .navbar button a:hover {
        color: black;
    }
</style>