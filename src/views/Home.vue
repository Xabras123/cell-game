<template>
  <div class="home">

    <div id="title">


    </div>

    <div id="board">


    </div>

    <div id="controls">


    </div>


    <div id="footer">
      

    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>

<style>

/*
  .home{

      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(9, 1fr);
      grid-template-areas: 
      "title     title     title     title     title     title"
      "title     title     title     title     title     title"
      "board     board     board     board     controls  controls"
      "board     board     board     board     controls  controls"
      "board     board     board     board     controls  controls"
      "board     board     board     board     controls  controls"
      "board     board     board     board     controls  controls"
      "board     board     board     board     controls  controls"
      "footer    footer    footer    footer    footer    footer"
      ;
  }

  #title {

    grid-area: title;
    background-color: #EDAE00;
  }

  #board{
    grid-area: board;
    background-color: #DC8B70;
  }

  #controls{
    grid-area: controls;
    background-color: #106591;
  }

    #footer{
    grid-area: footer;
    background-color: #68FFFA;
  }

*/

</style>
