<template>
    <nav class="navbar">
        <router-link to="/" class="nav-link" active-class="active"><button>Home</button></router-link>
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
    }

    .navbar button{
        background-color: #a6a6a6;
        color: black;
        border: none;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        height: 100%;
        outline: none; 
        border-top: 1px solid #808080;
        border-left: 1px solid #808080;
        border-right: 1px solid #808080;
        border-radius: 2px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out; /* Denne var kul!!!! Gi et pip om du ikke likte den eller vil justere den*/

    }

    .nav-link {
        text-decoration: none;
        width: 100%;
    }

    .nav-link.router-link-active button,
    .nav-link.router-link-exact-active button,
    .nav-link.router-link-active button:hover,
    .nav-link.router-link-exact-active button:hover {
        background-color: #E9E9E9 !important;
        color: #333 !important;
    }

    .navbar button:not(.nav-link.router-link-active button):hover,
    .navbar button:not(.nav-link.router-link-exact-active button):hover {
        background-color: #8e8e8e;
    }

    .navbar button a {
        text-decoration: none;
        color: black;
    }

    .navbar button a:hover {
        color: black;
    }
</style>