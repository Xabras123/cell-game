<template>

  <div class="divs">

    <div class="home">



      <div id="title">

        <div>
          <h1>Cell-Game</h1>
          <hr >

        </div>


      </div>

      <div id="board">

        <div id="cells-board">

        </div>

      </div>

      <div id="controls">

        <div class="element-placement-buttons">

          <button>Cell</button>
          <button>Food</button>
          <button>Predator</button>
        
        </div>


        <div class="sliders">



            <div class="slidecontainer">
              <input type="range" orient="vertical" min="1" max="100" value="50" class="slider" id="myRange">
              <p>Days</p>
            </div>

            <div class="slidecontainer">
              <input type="range" orient="vertical" min="1" max="100" value="50" class="slider" id="myRange">
              <p>Board size</p>
            </div>

        </div>

        <div class="run-button-div">
          <button >Run Simulation</button>
        </div>
        


      </div>


      <div id="footer">

        <h2>Alejandro Mayorga - 2021</h2>

      </div>


    </div>


    <div class="black-div">

    </div>
    <div class="yellow-div">

    </div>

    <div class="pink-div">

    </div>


  </div>

  <!--div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div-->
</template>

<style>

  *{
      padding: 0;
      margin: 0;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

  .divs{
    overflow: hidden;
    height: 100vh;
  }

  .black-div{
    	background-color: black;
	    transform: skewY(-60deg);
      position: relative;
      height: 100vh;
      z-index: -300;
      bottom: 2300px;
  }

  .yellow-div{
    	background-color: #EDAE00;
	    transform: skewY(-80deg);
      position: relative;
      height: 500vh;
      z-index: -200;
      bottom: 2300px;
  }

  .pink-div{
    	background-color: #DC8B70;
	    transform: skewY(20deg);
      position: relative;
      height: 100vh;
      z-index: -100;
      bottom: 30px;
  }

  .home{

      height: 100vh;
      font-family: 'Lato', sans-serif;


      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(10, 1fr);
   
      grid-template-areas: 
      "title     title     title     title     title     title title"
      "title     title     title     title     title     title title"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "board     board     board     board  controls  controls controls"
      "footer    footer    footer    footer    footer    footer footer"
      ;
  }

  #title {

    grid-area: title;
    /*background-color: #EDAE00;*/
    display: flex;
    justify-content: center;
    align-items:flex-end;
    padding-bottom: 0.7em;
  }

  #title h1{
    font-weight: 500;
    margin: 0 0 0.2em 0;
    color: #106591;
    margin: 0;
  }

  #title hr{

    width: 100%;
    color: #106591;
    display: inline-block;
    margin-bottom: 1em;

  }

  #board{
    grid-area: board;
    /*background-color: #DC8B70;*/
    display: flex;
    flex-direction: row-reverse;

    

  }

  #cells-board{
    background-color: #DFC894;
    border: 3px solid #DC8B70;

    border-radius: 7px;
    height: 100%;
    width: 70%;

  }

  #controls{
    grid-area: controls;
    /*background-color: #106591;*/

    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-template-areas: 
      "element-placement-buttons"
      "element-placement-buttons"
      "sliders"
      "sliders"
      "sliders"
      "run-simulation"
      ;
  }

  

  .element-placement-buttons {

    grid-area: element-placement-buttons;
    

    

  }

  .element-placement-buttons button{
    margin: 0 0 1em 2em;
    padding: 0.6em 0 0.6em 0;
    width: 22%;
    display: block;
    border: 2px solid #106591;
    color: #106591;
    background-color: #68FFFA;
    border-radius: 5px;
    font-weight: 500;
    
   
  }


  .sliders{
    grid-area: sliders;
    display: flex;
    padding-top: 1em;
  }

  .sliders .slidecontainer{
    margin: 0 0 1em 3.1em ;

  }

  .run-button-div{

    grid-area: run-simulation;
    display: flex;
    align-items:flex-end;

  }

  .run-button-div button{
    margin: 0 0 0 2em ;
    padding: 0.8em 0 0.8em 0;
    width: 22%;
    border: 2px solid #EDAE00;
    background-color: #EDAE00;
    color: azure;
    font-weight: 600;
    border-radius: 5px;

  }

  #footer{
    grid-area: footer;
    /*background-color: #68FFFA;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }

    #footer h2{
    color: white;
    font-weight: 300;
  }






#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
