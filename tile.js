export class Tile{
    constructor(gridElement){
        this.tileElement = document.createElement("div");
        this.tileElement.classList.add("tile");
        this.setValue(Math.random() > 0.4 ? 2 : 4);
        gridElement.append(this.tileElement);
    }

    setXY(x, y){
        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty("--y", y);
        this.tileElement.style.setProperty("--x", x);
    }

    setValue(value){
        this.value = value;
        this.tileElement.textContent = this.value;
        const bglightness = 100 - Math.log2(value) * 9;
        this.tileElement.style.setProperty("--bg-lightness", `${bglightness}%`);
        this.tileElement.style.setProperty("--text-lightness", `${bglightness < 50 ? 90 : 10}%`);
    }
    
}