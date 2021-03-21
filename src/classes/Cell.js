class Cell {
    constructor(name, socialBias, sofocationBias, reproductionBias, foodBias, predatorBias, temperatureBias, type, state) {

        this.name = name;
        this.sofocationBias = sofocationBias;
        this.socialBias = socialBias;
        this.reproductionBias = reproductionBias;
        this.foodBias = foodBias;
        this.predatorBias = predatorBias;
        this.temperatureBias = temperatureBias;
        this.type = type;
        this.state = state
        
    }

  }

  module.exports = Cell