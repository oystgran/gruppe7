<template>
    <nav class="navbar">
      
        <button><a href="#">Campingboka</a></button>
        <button><a href="#">Kart</a></button>
        <button><a href="#">Kontroll</a></button>
        <button><a href="#">Båtutleie</a></button>
    
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
        background-color: #333;
        color: white;
        height: 40px;
        padding: none;
    }
    .navbar button{
        background-color: #333;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        height: 100%;
    }
    .navbar button:hover{
        background-color: #555;
    }
    .navbar button a{
        text-decoration: none;
        color: white;
    }
    .navbar button a:hover{
        color: #f1f1f1;
    }
</style>