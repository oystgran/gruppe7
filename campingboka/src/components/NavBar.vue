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
        height: 40px;
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
    }
    .navbar button:hover{
        background-color: #E9E9E9;
        color: #333;
    }
    .navbar button a{
        text-decoration: none;
        color: black;
    }
    .navbar button a:hover{
        color: black;
    }
</style>