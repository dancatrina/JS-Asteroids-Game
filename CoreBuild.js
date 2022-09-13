/*                                                       Asteroids GAME

Game INFO:
    Start:
        -> Pentru inceperea jocului este obigatoriu introducerea numelui

    Movement:
        -> X = trage cu rachete
        -> Z = rotirea navetei spatiale catre stanga
        -> C = rotirea navetei spatiale catre dreapta
        -> ArrowUp = miscarea pe verticala in sus a navetei spatiale
        -> ArrowDown = miscarea pe verticala in jos a navetei spatiale
        -> LeftArrowKey = miscarea pe orizontala spre stanga a navetei spatiale
        -> RightArrowKey = miscarea pe orizontala catre dreapta a navetei spatiale

    SCORE:
        -> Scorul este acordat pe baza distrugerii asteroizilor (pentru fiecare asteroid se acorda un punctaj unic)
        -> Daca depaseste un anumit prag se acorda o viata
        -> Scorul de stocheaza automat in "tabela de scoruri" doar cand juctorul ramane fara vieti(pierde jocul)
        -> La resetarea paginii scorul acumulat nu se salveaza

-------------------------------------------------------------------------------------------------------------------------

    github: https://github.com/Danutt45/MM-Asteroids-Project
 */





//Clasa Game -> clasa unde este asamblat intreg jocul.
class Game{
    constructor(){}

    onInit(){
        this.gameSystem = new System();

        this.gameSystem.onInit();
     }
    onUpdate(){

        context.fillStyle = "black";
        context.fillRect(0,0,canvas.height,canvas.width);

        this.gameSystem.onRender();
        this.gameSystem.onUpdate();

    }
}
//Clasa de baza SCOBJECT;
class SCObject {

    constructor(pos_x,pos_y,size,radius,degree){

        this.pos_x = pos_x; // Pozitia X curenta in canvas
        this.pos_y = pos_y; // Pozitia Y curenta in canvas
        this.size  = size; // Marime
        this.radius = radius; // Raza
        this.degree = degree; // Angle / unghi

        this.canTick = false; // Variabila care permite updatarea obiectelor
        this.canRender = false; // Variabila care permite randarea obiectelor

        //Formal (Utilizat doar pentru testing)
        this.DebugLineColor = "green"; // Variabila pentru desenera liniilor de debug ale obiectelor
        this.BoundDebug = false;  // Variabila pentru statusul debugului pentru obiecte (ON = TRUE/OFF = FALSE)
    }
    //GET
    get getX() { return this.pos_x; }
    get getY() { return this.pos_y; }
    get getSize() { return this.size;}
    get getRadius() { return this.radius; }
    get getDegree() { return this.degree; }

    get getCanTick () { return this.canTick; }
    get getCanRender() { return this.canRender; }

    get getBoundDebug () { return this.BoundDebug;}
    get getDebugLineColor() { return this.DebugLineColor; }


    //SET
    set setX(_x) { this.pos_x = _x; }
    set setY(_y) { this.pos_y = _y; }
    set setSize(_size) { this.size = _size; }
    set setRadius(_radius) { this.radius = _radius; }
    set setDegree(_degree) { this.degree = _degree; }

    set setCanTick (_value) { this.canTick = _value; }
    set setCanRender (_value) { this.canRender = _value;}
    
    set setBoundDebug (_value) { this.BoundDebug = _value;}
    set setDebugLineColor(_value) { this.DebugLineColor = _value;}

}
class Ship extends SCObject{
    
    static c = 1.5; // Variabila standard utilizata pentru normalizarea miscarilor XoY (calculata matematic pe frame);


    constructor(pos_x,pos_y,size,radius,degree,rotation,turn_speed,speed_movement, friction,life){
        
        super(pos_x,pos_y,size,radius,degree);


        this.rotation = rotation; // rotatia
        this.turn_speed = turn_speed; // viteza de rotatie
        this.speed_movement = speed_movement; //viteza standard

        //Variabile boolene pentru miscare
        this.is_movingN = false; 
        this.is_movingS = false;
        this.is_movingE = false;
        this.is_movingV = false;

       //Vitezele de deplasare pe axele XoY
        this.x_velocityMov = 0;
        this.y_velocityMov = 0;

        this.friction = friction; // Coeficientul de fecare


        //Default life:
        this.lifes = life;

        //Explosion
        this.isExploding = false;

        //Invincible
        this.isInvincible = true;

    }
    //GET

    get getRotation() { return this.rotation; }
    get getTurnSpeed() { return this.turn_speed; }
    get getSpeedMovement() { return this.speed_movement; }
    get getFriction() { return this.friction; }

    get getLife() { return this.lifes;}

    get getisExploding() { return this.isExploding;}

    get getIsInvincible() { return this.isInvincible; }


    //SET
    set setRotation(_value) { this.rotation = _value; }
    set setTurnSpeed(_value) { this.turn_speed = _value; }
    set setSpeedMovement(_value) { this.speed_movement = _value; }
    set setFriction(_value) { this.friction = _value; }
    set setLife(_value) { this.lifes = _value;}
    set setisExploding(_value) { this.isExploding = _value;}
    set setIsInvincible(_value) { this.isInvincible = _value; }

    //Functie standard pentru randarea navetei spatiale
    onRender(){
        if(this.canRender){
            if(!this.isExploding){
                if(this.isInvincible == true){
        context.strokeStyle = "white";
        context.lineWidth = this.getSize/20;
        context.beginPath();
        context.moveTo(
            this.getX + 4 / 3 * this.getRadius * Math.cos(this.getDegree),
            this.getY - 4 / 3 * this.getRadius * Math.sin(this.getDegree)
        );
        context.lineTo(
            this.getX - this.getRadius * ( 2 / 3 * Math.cos(this.getDegree) + Math.sin(this.getDegree)),
            this.getY + this.getRadius * ( 2 / 3 * Math.sin(this.getDegree) - Math.cos(this.getDegree))
        );
        context.lineTo( 
            this.getX - this.getRadius * ( 2 / 3 * Math.cos(this.getDegree) - Math.sin(this.getDegree)),
            this.getY + this.getRadius * ( 2 / 3 * Math.sin(this.getDegree) + Math.cos(this.getDegree))
        );

        context.closePath();
        context.stroke();
                }
        } else {
        
        context.fillStyle = "darkred";
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius * 1.7, 0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius * 1.4, 0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = "orange";
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius * 1.1, 0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius * 0.8, 0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = "white";
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius * 0.5, 0, Math.PI * 2, false);
        context.fill();
        
        }
        if(this.getBoundDebug){
            context.strokeStyle = this.DebugLineColor;
            context.beginPath();
            context.arc(this.pos_x,this.pos_y,this.radius,0,Math.PI* 2,false);
            context.stroke();

        }

    }}

    //Functie standard pentru initializarea navetei spatiale.
    onInit(){

        this.canTick = true; // Variabila care permite randarea obiectului curent
        this.canRender = true; // Variabila care permite updatarea obiectului curent

        //EventListener pentru butoanele specificate in
        document.addEventListener("keydown", key=>{
            switch(key.keyCode){
                case 37: this.is_movingV = true; break;
                case 38: this.is_movingN = true; break;
                case 39: this.is_movingE = true; break;
                case 40: this.is_movingS = true; break;
                case 67: this.rotation = -this.turn_speed / 180 * Math.PI / FPS_LIMIT; break;
                case 90: this.rotation = this.turn_speed / 180 * Math.PI / FPS_LIMIT; break; }});

        document.addEventListener("keyup", key =>{
            switch(key.keyCode){
                case 37: this.is_movingV = false; break;
                case 38: this.is_movingN = false; break;
                case 39: this.is_movingE = false; break;
                case 40: this.is_movingS = false; break;
                case 67: this.rotation = 0; break;
                case 90: this.rotation = 0; break;}});
            }
    
    //Functie standard pentru updatarea navetei spatiale.
    onUpdate(){


        if(this.canTick){
            if(!this.isExploding){
        this.degree += this.rotation;

        if(this.is_movingE)
        this.Move_POS(this.speed_movement * Math.sin(90) / FPS_LIMIT,0);
        if(this.is_movingV)
        this.Move_POS(-this.speed_movement * Math.sin(90) / FPS_LIMIT,0);
        if(this.is_movingN)
        this.Move_POS(0,this.speed_movement * Math.cos(90) / FPS_LIMIT);
        if(this.is_movingS)
        this.Move_POS(0,-this.speed_movement * Math.cos(90) / FPS_LIMIT);

        this.x_velocityMov -= this.friction * this.x_velocityMov / FPS_LIMIT;
        this.y_velocityMov -= this.friction * this.y_velocityMov / FPS_LIMIT;



         this.pos_x +=  this.x_velocityMov;
         this.pos_y +=  this.y_velocityMov;

         this._TranslationMap(this.pos_x,this.pos_y);
            }else{
                this.x_velocityMov = 0;
                this.y_velocityMov = 0;
            }
        }
        
    }

    //Functie standard pentru animatii (Neimplementata)
    onAnimate(){}

    //Functie standard pentru sunet (Neimplementata)
    onSoundPlay(){}

    // Functie care calculeaza viteza de deplasare pe axele XoY (normalizata!)
    Move_POS(val_x,val_y){
        
        let magnitude = Math.sqrt(val_x * val_x + val_y * val_y); // variabila care ajuta la normalizarea vitezei.
        this.x_velocityMov += val_x / magnitude / (FPS_LIMIT / Ship.c); // Viteza pe axa X
        this.y_velocityMov += val_y / magnitude / (FPS_LIMIT / Ship.c);  // Viteza pe axa Y

    }

    //Functie care translateaza nava spatiala daca a ajuns la captul hartii.
    _TranslationMap(x,y) {
        if(x < 0 - this.radius){
            this.pos_x = canvas.width + this.radius;
        }else if (x > canvas.width + this.radius){
            this.pos_x = 0 - this.radius;}

        if(y < 0 - this.radius){
           this.pos_y = canvas.width + this.radius;
       }else if (y > canvas.width + this.radius){
           this.pos_y = 0 - this.radius;
       }
    }



}

class Rocket extends SCObject {

    static rocket_maximumDistance = 0.6; // Distanta maxima pe care o poate urma o racheta
    //Construcotrul clasei Rocket;
    constructor(_x,_y,_size,_xVelocityMov,_yVelocityMov) {
        super(_x,_y,_size,-1,-1);

        this.velX = _xVelocityMov; // viteza de deplasare pe axa X
        this.velY = _yVelocityMov; // viteza de deplasare pe axa Y
        this.colorRocket = "white" // culoarea racheti

        this.distantaParcursa = 0; // Variabila care determina distanta parcursa la momentul t0
    }

    //Getteri

    get getVelX() {return this.velX;}
    get getVelY() {return this.velY;}
    get getcolorRocket(){ return this.colorRocket;}
    get getdistantaParcursa() { return this.distantaParcursa;}

    //Set
    set setVelX(_value) { this.velX = _value;}
    set setVelY(_value) { this.velY = _value;}
    set setcolorRocket(_value){ this.colorRocket = _value;}
    set setdistantaParcursa(_value) { this.distantaParcursa = _value;}


    //Functia standard de initiere
    onInit(){
        //Intializam randarea si updatarea clasei
        this.canRender = true;
        this.canTick = true;
    }

    //Functia standard de reandare
    onRender(){
        if(this.canRender){
            context.fillStyle = this.colorRocket;
            context.beginPath();
            context.arc(this.pos_x,this.pos_y, this.size,0,Math.PI * 2, false);
            context.fill();
        }

    }

    //Functia standard de update;
    onUpdate(){
        //Updatam vitezele corespunzatoare ale rachetelor
        this.pos_x += this.velX;
        this.pos_y += this.velY; 

        //Apelam functia pentru a verifica daca am iesit din ecran ( in caz afirmativ ne va trimite glonul pe cealalta parte a ecranului);
        this._boundingScene();

        //Calculam distanta parcursa
        this.distantaParcursa += Math.sqrt(Math.pow(this.velX,2) + Math.pow(this.velY,2)); // Calcularea distantei glontului in momentul t0
    }

    //Functii ajutatoare
        //Functie de translatare a glontului daca acesta a iesit din scena
    _boundingScene(){
        if(this.pos_x < 0){
            this.pos_x = canvas.width;
        }else if( this.pos_x > canvas.width){
            this.pos_x = 0;
        }
        if(this.pos_y < 0){
            this.pos_y = canvas.height;
        }else if( this.pos_y > canvas.height){
            this.pos_y = 0;
        }

    }

}
//Clasa asteroid derivata din clasa de baza SCObject.
class Asteroid extends SCObject {

    constructor(pos_x, pos_y, size, radius, degree, speed, verts, jaggenes, color,life){
        super(pos_x,pos_y,size,radius,degree);

        this.speed = speed; // viteza standard
        this.xVelocityMov = Math.random() * speed / FPS_LIMIT * (Math.random() < 0.5  ? 1 : -1 ); // viteza de deplasare pa axa X
        this.yVelocityMov = Math.random() * speed / FPS_LIMIT * (Math.random() < 0.5  ? 1 : -1 ); // viteza de deplasare pe axa Y
        
        this.vertex = Math.floor(Math.random() * (verts + 1) + verts / 2); // Vertex

        this.life = life; // Viata

        this.jaggenes = jaggenes; // Jaggs variable (variabile de ascutire)
        this.vertexOffsetJags = []; // Vector cu offseturile calculate pe baza coeficientului jaggnes

        this.color = color; // Culoarea

        this.mass = (Math.floor(Math.random() * 4) + 1)/10; // Masa asteroidului determinata aleator din intervalul [1,4]


        this._computeVertexOffsetJagg(this.vertex); // Functie care compueaza vectorul vetexOffsex pe baza vertexurilor si a coef jagg.
        
        

    }

    //GET
    get getSpeed() { return this.speed;}
    get getVertex() { return this.vertex;}
    get getLife() { return this.life;}
    get getJaggenes() { return this.jaggenes;}
    get getColor() { return this.color;}
    get getVertexOffsetJaggs(){ return this.vertexOffsetJags;}

    get getXvelocityMov() { return this.xVelocityMov;}
    get getYvelocityMov() { return this.yVelocityMov;}

    get getMass() { return this.mass;}

    //SET
    set setSpeed(_value) { this.speed =_value; this._SpeedComputetion(_value);}
    set setVertex(_value) { this.vertex = _value; this._computeVertexOffsetJagg(_value);}
    set setLife(_value) { this.life = _value;}
    set setColor(_value) { this.color = _value;}

    set setXvelocityMov(_value) {  this.xVelocityMov = _value;}
    set setYvelocityMov(_value) {  this.yVelocityMov = _value;}

    set setMass(_value) { this.mass = _value;}

    //Functie de initializare a componetelor din calsa de baza SCObject.
    onInit() {
        this.canRender = true;
        this.canTick = true;
        this.BoundDebug = false;
    }

    //Functia de randare (functie apelata pentru fiecare fram pentru a randa asteroidul.)
    onRender() {
        if(this.canRender){
        context.strokeStyle = this.color;
        context.lineWidth = this.size/2;
        context.beginPath();
        context.moveTo(
            this.pos_x + this.radius * this.vertexOffsetJags[0] * Math.cos(this.degree),
            this.pos_y + this.radius * this.vertexOffsetJags[0] * Math.sin(this.degree)
        );

        for (let index = 1 ; index < this.vertex ; index++){
            context.lineTo(
                this.pos_x + this.radius * this.vertexOffsetJags[index] * Math.cos(this.degree + index * Math.PI * 2 / this.vertex),
                this.pos_y + this.radius * this.vertexOffsetJags[index] * Math.sin(this.degree + index * Math.PI * 2 / this.vertex)
            );
        }
            context.closePath();
            context.stroke();

            context.font = '16px Arial';
            context.textAlign = 'Center';
            context.fillStyle = "white";
            context.fillText(this.life.toString(), this.pos_x - 5, this.pos_y + 5);

            //Debuging (Nu intra in evaluare - folosita pentru a determina coleziunea)
            if(this.getBoundDebug){
                context.strokeStyle = this.DebugLineColor;
                context.beginPath();
                context.arc(this.pos_x,this.pos_y,this.radius,0,Math.PI* 2,false);
                context.stroke();
    
            }

    }
    }

    //Functia standard pentru updatarea asteroidului
    onUpdate() {

        if(this.canTick){

            this.pos_x += this.xVelocityMov;
            this.pos_y += this.yVelocityMov;

            //Functie care verifica daca asteroidul a iesit din harta
            this._TranslationMap(this.pos_x,this.pos_y);
       }
    }

    //Functie pentru animarea unor elemente (Neimplemntata)
    onAnimate(){}

    //Functie standard pentru snete (Neimplementata)
    onSoundPlay(){}

    //Functions

    //Functie care face tranzitia hartii asupra asteroidului.
    _TranslationMap(x,y) {

        if(x < 0 - this.radius){
            this.pos_x = canvas.width + this.radius;
        }else if (x > canvas.width + this.radius){
            this.pos_x = 0 - this.radius;}

        if(y < 0 - this.radius){
           this.pos_y = canvas.width + this.radius;
       }else if (y > canvas.width + this.radius){
           this.pos_y = 0 - this.radius;
       }
    }

    //Functie care proceseaza forma asteroidului
    _computeVertexOffsetJagg(_vertex) {
        if(this.vertexOffsetJags.length !=0){
            this.vertexOffsetJags = []
        }

        for (let i = 0 ; i< _vertex ; i++){
            this.vertexOffsetJags.push(Math.random() * this.jaggenes * 2 + 1 - this.jaggenes);
        }
    }
    
    //Functie care calculeaza viteza pe axe pe baza unui parametru de intrare
    _SpeedComputetion(_value){
        this.xVelocityMov = Math.random() * _value / FPS_LIMIT * (Math.random() < 0.5  ? 1 : -1 );
        this.yVelocityMov = Math.random() * _value / FPS_LIMIT * (Math.random() < 0.5  ? 1 : -1 );
    }

}
//Clasa "System" -> clasa care se ocupa cu gestionarea intregului joc.

class System{
    constructor(){

        //Asteroids
        this.SCobjAsteroids = []; // Vector care tine obiectele asteroids
        this.asteroidsCount = 0; // numarul initial de asteroizi
        this.maxAsteroids = 3; // Numarul maxim de asteroizi aflat in momentul t0 in scena

        this.colorAsteroids = ["Maroon","Grey","LimeGreen","Tomato"]; // Vectorul cu culoriile posibile ale asteroidului

        //
        // Culoarea asteroidului este determinata pe baza numarului de vieti pe care il prezinta
        // mai jos este un tabel in functie de vietile acestuia
        
        //////////TABEL/////////////
        //  Grey - 1 viata       //
        //  Limegray - 2 vieti  //
        //  Tomato - 3 vieti   //
        //  Maroon - 4 vieti  //
        ///////////////////////


        this.explotionTimeShip = 0; // Durata exploziei navei
        
        //Invincible
        this.inv_dur_ship = 0; // durata invicibilitatii navei
        this.blink_dur_ship = 0; // durata blinkului navei

        this.blink_num = 0; // numarul de blinkuri ale navei
        this.blink_time = 0; // timpul blinkului

        this.blinkOn = 0;





        //Rockets
        this.maxLimitRockets = 3; // Numarul maxim de rachete
        this.rocketList = []; // Lista de rachete
        this.rocketSpeed = 150; // Viteza rachetelor
        this.canShoot = true; // Variabila care verifica daca poate sa apese pe buton

        //score
        this.score = 0; // Scorul initial

        this.LifeBase = 500; // Scorul la care trebuie sa ajunga sa poata obtine o viata in plus.

        //level
        this.level = 1; // Nivelul actual

        //GameOver
        this.gameover = false;

        //public updateOnce;
        this.updateScoreOnce = true;


    }


    onInit(){

        //Se creaza nava spatiala
        this.ship = new Ship(
            canvas.width/2, // pozitia X
            canvas.height/2, // Pozitia Y
            30, // marimea 
            15, // raza
            90/180 * Math.PI, // Unghiul (Angle)
            0, //Rotatia initiala
            360, // Viteza de rotatie
            5, //Viteza navetei spatiale
            0.6, // Coeficientul de frecare
            3); // Numarul de vieti
        
        //Initializam nava spatiala (canTick/canRender = TRUE);
        this.ship.onInit();

        //Initializam si adaugam asterozii in scena
        this.SpawnAteroids();
            
        for(let index in this.SCobjAsteroids){
            this.SCobjAsteroids[index].onInit();
            }

        //EventListener pentru butonul "X"
        document.addEventListener("keydown", key=>{
            switch(key.keyCode){
                case 88: this.shootRocket(); break;
             }});


    }

    onRender(){
        //Randam rachetele fiecare frame
        if(this.rocketList.length != 0){
            for(let i = 0 ; i < this.rocketList.length; i++){
                this.rocketList[i].onRender();
            }
        }

        //Randam nava fiecare frame
        this.ship.onRender();
        
        //Randam asteroizii pentru fiecare frame
        if(this.SCobjAsteroids.length !=0){
        for(let index in this.SCobjAsteroids){
        this.SCobjAsteroids[index].onRender();
        }
    }

    //UI - User Interface - responsabil pentru textul pe ecran
        //Life
    context.font = "20px serif";
    context.fillText(`Lifes: ${this.ship.getLife}`, 0, 20);
        
        //Scor
    context.font = "20px serif";
    context.fillText(`Score: ${this.score}`, canvas.width - 100, 20);

        //Level
    context.font = "20px serif";
    context.fillText(`Level: ${this.level}`, 0, canvas.height-10);

    if(this.gameover == true){
        context.font = "40px serif";
        context.fillText("Game Over", canvas.width/3, canvas.height/2);

        context.font = "20px serif";
        context.fillText("F5 pentru a incepe din nou", canvas.width/3.2, canvas.height/2 * 1.1);
    }

    }

    
    onUpdate(){
        if(this.ship.getLife != 0){
        //Verificam daca mai exista asteroizi in scenea.
        if(this.SCobjAsteroids.length != 0){

        //Updatam nava la fiecare frame
        this.ship.onUpdate();
        
        //Verificam: Daca exista rachete in vector , in cazul afirmativ updatam rachetele si vedem daca au parcurs distanta maxima definita mai sus
        // in caz afirmativ le distrugem.(Stergem din vector)
        if(this.rocketList.length != 0){
            for(let i = this.rocketList.length - 1; i>=0 ; i--){
                 //Verificam daca distanta parcursa este mai mare decat distanta maxima parcursa
                if(this.rocketList[i].getdistantaParcursa >= Rocket.rocket_maximumDistance * canvas.width)
                {
                    this.rocketList.splice(i,1);
                    continue;
                }
                this.rocketList[i].onUpdate();
            }
        }

        //Verificam coleziunea gloantelor cu asteroizii si updatam statusul lor;
        if(this.SCobjAsteroids.length !=0){
        this._colisionRocket(this.SCobjAsteroids,this.rocketList);
        }
        
        //Updatam statusul rachetelor ( in cazul in care array-ul nostru de rachete este gol , permitem utilizatorului sa traga)
        if(this.rocketList.length == 0){
            this.canShoot = true;
        }

        //Adaugam viata navetei spatiale bazate pe scor
        if(this.score >= this.LifeBase){
            this.ship.setLife = this.ship.getLife +1;
            this.LifeBase += 500;
        }

        //Se updateaza asteroizii pentru fiecare FRAME.
        for(let i in this.SCobjAsteroids){
        this.SCobjAsteroids[i].onUpdate();
        }

        //Verificam:
        // ->Daca numarul de blinkuri este 0 = Nava nu mai este in invincibilitate
        // ->Daca nava a explodat deja = TRUE -> Da , FALSE = Nu
        // ->Daca conditile de mai sus sunt intalnite , verificam daca intre nava si un asteroid este coleziune -> in caz afirmativ explodam nava
        if(this.blink_num == 0 && !this.ship.isExploding && this._colisionCheckShip(this.ship,this.SCobjAsteroids)){
            this._onExplodeShip(0.4); // Functie care declanseaza explozia navei (comentata mai jos)
        }
        else
            {
            
            this.explotionTimeShip = this.explotionTimeShip < 0 ? 0 : this.explotionTimeShip - 1; // Calculeaza timpul exploziei

            if(this.explotionTimeShip < 0 && this.ship.isExploding == true){
                let newLife = this.ship.getLife -1; // Determina noua viata a navei
                //Se creaza o noua nava cu viata determinata anterior
                this.ship = new Ship(
                    canvas.width/2, 
                    canvas.height/2,
                    30,
                    15,
                    90/180 * Math.PI,
                    0,
                    360,
                    5,
                    0.6,
                    newLife);
                
                //Se initializeaza nava (canTick/canRander = TRUE)
                this.ship.onInit();
                //Initializeaza invincibilitatea navei 
                this._onInvInit(3,0.1); 
            }     
        }
            //Verifica daca Blinkul are valoarea "TRUE" -> face nava invizibila/vizibla (palpaie pe ecran)
            if(this.blinkOn = this.blink_num % 2 == 0){
                this.ship.isInvincible = true;
            }
            else
            {
                this.ship.isInvincible = false; 
            }

            if(this.blink_num > 0){
                this.blink_time --; // Decrementeaza timpul

                if(this.blink_time < 0) {
                    this.blink_time = Math.ceil(this.blink_dur_ship * FPS_LIMIT); // Updateaza timpul blinkului
                    this.blink_num --; // Decrementeaza numarul de blinkuri.
                }
            }
            
            //Functie care verica coleziunea asteroizilor.
            this._colisionAsteroids();
            
        }
        else{

            //Updatam numarul de asteroizi pentru fiecare nivel;
            if(this.maxAsteroids < 10){
                this.maxAsteroids += 1;
                this.level += 1;
                this.asteroidsCount = 0;
                this.SpawnAteroids();

                //Initializam asteroizii
                for(let i in this.SCobjAsteroids){
                    this.SCobjAsteroids[i].onInit();
                }
                //Daca a ajuns la numarul maxim de asteroizi atunci nu il mai crestem.
            }else if(this.maxAsteroids == 10){
                this.level += 1;
                this.asteroidsCount = 0;
                this.SpawnAteroids();
                for(let i in this.SCobjAsteroids){
                    this.SCobjAsteroids[i].onInit();
                }
            }
        }
    } else if(this.ship.getLife == 0){
        this.gameover = true;
        this.ship.setCanRender = false;

        if(this.updateScoreOnce == true){
            this.saveScore();
            this.updateScoreOnce = false;
        }

    }
}


    SpawnAteroids(){

        while(this.asteroidsCount < this.maxAsteroids){
            
            let asteroidPos_x; // Variabila auxiliara pentru a determina pozitia pe axa X;
            let asteroidPos_y; // Variabila auxiliara pentru a determina pozitia pe axa Y
            let local_radius =  10; // Raza

            do{

               asteroidPos_x =  Math.floor(Math.random() * canvas.width); // Calculam pozitia X aleator pe baza canvasului
               asteroidPos_y =  Math.floor(Math.random() * canvas.height); // Calculam pozitia Y aleator pe baza canvasului

               //Generam coordonatele (X,Y) atata timp cat nu se valideaza conditia prezentata in functia de mai jos
               while(this.distanceBetweenAllAsteroids(asteroidPos_x,asteroidPos_y,local_radius) == false){
                asteroidPos_x =  Math.floor(Math.random() * canvas.width);
                asteroidPos_y =  Math.floor(Math.random() * canvas.height);
               }

               //Verificam daca distanta dintre nava si asteroidul creat este mai mica decat 100 + raza navei (100 este o constanta)
            } while(this.distBetweenPoints(this.ship.getX,this.ship.getY,asteroidPos_x,asteroidPos_y) < 100 + this.ship.getRadius);
            
                //Creem asteriodul pe baza valorilor generate aleator
                let lifes = Math.floor(Math.random()* 4) + 1; // Generam numarul de vieti din intervalul [1,4]
                this.SCobjAsteroids.push(new Asteroid(
                asteroidPos_x, // X
                asteroidPos_y, // Y
                2, // marime
                local_radius * lifes, // raza
                Math.random() * Math.PI * 2, // Unghiul
                Math.floor(Math.random() * 30) + 12, // Viteza
                Math.floor(Math.random() * 12) + 10, // Vertex
                0, // Jaggs
                this.colorAsteroids[lifes%4], // Culoare
                lifes // Viata
                
                ));

                this.asteroidsCount++;
            }
    
    }

    //Functie de calculare a distantei dintre 2 puncte , varianta SMART
    distBetweenPoints(_x1, _y1, _x2, _y2){ return Math.sqrt(Math.pow(_x2 - _x1,2) + Math.pow(_y2 - _y1,2)); } 

    //Functie de calculare a distantei dintre 2 puncte , varianta LOW
    distanceBetweenAsteroids(_x1,_y1,_x2,_y2){return Math.sqrt((_x1 - _x2)* (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));}

    //Functie care determina distanta asteroizilor dat ca parametrii.
    distanceBetweenAllAsteroids(_x,_y,_radius){
        
        //Se verifica daca vectorul este "empty", se parcurge fiecare asteroid si sa verifica daca distanta asteroidului i este mai mica decat 
        // (raza + raza_asteroidului) + 1 , in caz afirmativ se trimite semnalul "TRUE".
        if(this.SCobjAsteroids.length != 0){
            for(let i = 0 ; i < this.SCobjAsteroids.length; i++){
                if(this.distBetweenPoints(_x,_y,this.SCobjAsteroids[i].getX,this.SCobjAsteroids[i].getY) < 1 +_radius + this.SCobjAsteroids[i].getRadius)
                return false;
            }
            return true;
        }
    }


    


    //Functie care determina coleziunea navetei spatiale cu cei N asteroizi.
    _colisionCheckShip(_ship,_asteroid) {
        //Parcurgem fiecare asteroid si verificam daca exista coleziune
        for(let index = 0 ; index < this.SCobjAsteroids.length ; index++){
            if(this.distBetweenPoints(_ship.getX, _ship.getY, this.SCobjAsteroids[index].getX, this.SCobjAsteroids[index].getY ) < this.ship.getRadius + this.SCobjAsteroids[index].getRadius)
               {    //Daca numarul de vieti al asteroidului (index) este mai mare decat 0 ii updatam statusul(inseamna ca nava a intrat in asteroid)
                    if(this.SCobjAsteroids[index].getLife > 0){
                        this.SCobjAsteroids[index].setLife = this.SCobjAsteroids[index].getLife -1; // Scadem viata curenta a navei
                        this.SCobjAsteroids[index].setColor = this.colorAsteroids[this.SCobjAsteroids[index].getLife]; // Updatam culoarea
                        this.SCobjAsteroids[index].setRadius = this.SCobjAsteroids[index].getRadius - 10; // Updatam raza
                    }
                    //Verificam daca numarul de vieti este  0 si crestem scorul jucatorului
                    if(this.SCobjAsteroids[index].getLife == 0){
                        this.score += 50 + this.SCobjAsteroids[index].getRadius%10; // Scorul este determinat aleator pe baza razei asteroidului
                        this.SCobjAsteroids.splice(index,1); // Eliminam asteroidul din vector
                        
                    }
                    //trimitem semnalul true pentru a reseta nava.
                    return true;
               }
        } 
        return false;
        
    }

    //Coleziune racheta cu asteroizi
    _colisionRocket(){
        //parcurgem asterozii
        for(let i = this.SCobjAsteroids.length - 1; i>= 0 ; i--){
            //parcurgem rachetele
            for(let j = this.rocketList.length - 1; j>= 0 ; j--){
                //Verificam daca distanta dintre cele 2 obiecte este mai mica decat raza asteroidului;
                if(this.distBetweenPoints(this.SCobjAsteroids[i].getX,this.SCobjAsteroids[i].getY,this.rocketList[j].getX,this.rocketList[j].getY)< this.SCobjAsteroids[i].getRadius)
                {
                    //Eliminam din rachete(stim ca au lovit asteroidul)
                    this.rocketList.splice(j,1);
                    if(this.SCobjAsteroids[i].getLife > 0){
                        this.SCobjAsteroids[i].setLife = this.SCobjAsteroids[i].getLife - 1;
                        this.SCobjAsteroids[i].setColor = this.colorAsteroids[this.SCobjAsteroids[i].getLife];
                        this.SCobjAsteroids[i].setRadius = this.SCobjAsteroids[i].getRadius - 10;
                    }
                    //Verificam daca asteroidul nu mai are viata ( in cazul in care nu are il stergem)
                    if(this.SCobjAsteroids[i].getLife == 0){
                        this.score += 50 + this.SCobjAsteroids[i].getRadius / 10 + Math.floor(Math.random() * 1) + 12;
                        this.SCobjAsteroids.splice(i,1);
                        
                    }

                    break;
                }

            }
        }
    }

    /*
    ->Functie care determina coleziunea dintre n asteroizi.
    ->Bazata pe ecuatiile din fizica (Conservarea impulsului , Ciocnirea elastica);
    */
    _colisionAsteroids(){
        //Parcurgem asteroizii , verificam distanta dintre asteroizii (i,j) -> daca este mai mica decat (raza i + raza j) + 1 atunci stim ca cei doi asteroizi
        //se afla in coleziune si aplicam formulele studiate la fizica.
        for(let i = 0; i < this.SCobjAsteroids.length ; i++){
            for(let j = i+1 ; j< this.SCobjAsteroids.length; j++){
                if(this.distanceBetweenAsteroids(this.SCobjAsteroids[i].getX,this.SCobjAsteroids[i].getY,this.SCobjAsteroids[j].getX,this.SCobjAsteroids[j].getY)<this.SCobjAsteroids[i].getRadius + this.SCobjAsteroids[j].getRadius + 1)
                {
                    //Calculam distantele coordonatelor punctelor X,Y dintre cei 2 asteroizi
                    let xDistance = this.SCobjAsteroids[i].getX - this.SCobjAsteroids[j].getX;
                    let yDistance = this.SCobjAsteroids[i].getY - this.SCobjAsteroids[j].getY;

                    //Calculam unghiul coleziunii vectorului rezultat din scaderea distantelor de mai sus
                    let collisionAngle = Math.atan2(yDistance,xDistance);

                    //Calculam magnitudinea celor 2 asteroizi
                    let magAsteroid1 = Math.sqrt(this.SCobjAsteroids[i].xVelocityMov *this.SCobjAsteroids[i].xVelocityMov + this.SCobjAsteroids[i].yVelocityMov * this.SCobjAsteroids[i].yVelocityMov );
                    let magAsteroid2 = Math.sqrt(this.SCobjAsteroids[j].xVelocityMov *this.SCobjAsteroids[j].xVelocityMov + this.SCobjAsteroids[j].yVelocityMov * this.SCobjAsteroids[j].yVelocityMov );

                    //Calculam noul unghi pe care se va deplasa asteroizii in urma coleziunii
                    let angleAsteroid1 = Math.atan2(this.SCobjAsteroids[i].yVelocityMov,this.SCobjAsteroids[i].xVelocityMov);
                    let angleAsteroid2 = Math.atan2(this.SCobjAsteroids[j].yVelocityMov,this.SCobjAsteroids[j].xVelocityMov);

                    //Calculam viteza asteroidului I
                    let xSpeedAsteroid1 = magAsteroid1 * Math.cos(angleAsteroid1 - collisionAngle);
                    let ySpeedAsteroid1 = magAsteroid1 * Math.sin(angleAsteroid1 - collisionAngle);

                    //Calculam viteza asteroidului J
                    let xSpeedAsteroid2 = magAsteroid2 * Math.cos(angleAsteroid2 - collisionAngle);
                    let ySpeedAsteroid2 = magAsteroid2 * Math.sin(angleAsteroid2 - collisionAngle);

                    //Aplicam formula ciocnirii elastice pentru determinarea vitezei;
                    let finalxSpeedAsteroid1 = ((this.SCobjAsteroids[i].mass - this.SCobjAsteroids[j].mass)* xSpeedAsteroid1 + (this.SCobjAsteroids[j].mass+this.SCobjAsteroids[j].mass)* xSpeedAsteroid2)/(this.SCobjAsteroids[i].mass + this.SCobjAsteroids[j].mass);
                    let finalxSpeedAsteroid2 = ((this.SCobjAsteroids[i].mass + this.SCobjAsteroids[i].mass)* xSpeedAsteroid1 + (this.SCobjAsteroids[j].mass - this.SCobjAsteroids[i].mass)* xSpeedAsteroid2)/(this.SCobjAsteroids[i].mass + this.SCobjAsteroids[j].mass);
                    

                    let finalySpeedAsteroid1 = ySpeedAsteroid1;
                    let finalySpeedAsteroid2 = ySpeedAsteroid2;

                   //Aplicam miscarea(directia (X,Y)) rezultata mai sus asteroizilor
                    this.SCobjAsteroids[i].xVelocityMov = Math.cos(collisionAngle) * finalxSpeedAsteroid1 + Math.cos(collisionAngle + Math.PI/2) * finalySpeedAsteroid1;
                    this.SCobjAsteroids[i].yVelocityMov = Math.sin(collisionAngle) * finalxSpeedAsteroid1 + Math.sin(collisionAngle + Math.PI/2) * finalySpeedAsteroid1;

                    this.SCobjAsteroids[j].xVelocityMov = Math.cos(collisionAngle) * finalxSpeedAsteroid2 + Math.cos(collisionAngle + Math.PI/2) * finalySpeedAsteroid2;
                    this.SCobjAsteroids[j].yVelocityMov = Math.sin(collisionAngle) * finalxSpeedAsteroid2 + Math.sin(collisionAngle + Math.PI/2) * finalySpeedAsteroid2;

                }
            }
        }
                    
}
    //DEBUGS: 
    //Functie folosita de DEV pentru a determina daca lucrurile functioneaza exact cum trebuie
    //Nu intra in evaluarea proiectului.
    _debug_ship(){}
    _debug_asteroids() {}

    //Functie declanseaza distrugerea navei (Primeste ca paramentru durata exploziei)
    _onExplodeShip(_explosionDuration){
        this.explotionTimeShip = Math.ceil(_explosionDuration * FPS_LIMIT); //Calculam timpul exploziei(cat timp este distrusa nava)
        this.ship.isExploding = true; // Trimitel catre system semnalul ("Nava este distrusa").
    }

    //Functie care confera navetei spatiale invincibilitate
    //Primeste ca parametrii (_invisibleDuration = cat este invizibila nava (este imuna) , _blink_duration = cat timp nava palpaie pe ecran
    // intr-o alta ordine de cuvinte este un semnal care ii spune utilizatorlui cat timp este nava invincibila)
    _onInvInit(_invisibleDuration , _blink_duration){
        this.inv_dur_ship = _invisibleDuration; //Asignam durata invizibilitatii variabilei declarate in clasa
        this.blink_dur_ship = _blink_duration; // Asignam durata blinkului variabilei declarate in clasa

        this.blink_num = Math.ceil(_invisibleDuration /_blink_duration); // Calculam numarul de blinkuri (de cate ori palpaie nava pana sa isi revina)
        this.blink_time = Math.ceil(_blink_duration * FPS_LIMIT); // Calculam timpul de cate ori "palpaie" nava pana isi revine la normal

        this.blinkOn = this.blink_num % 2 == 0; // Variabila care determina cand "palpaie" nava si cand nu (Daca este divizib cu 2 atunci palpaie)
    }


    //Rockets:
        //Functie care se ocupa cu:
        // -> initializarea rachetelor
        // -> precosearea lor
        // -> face legatura dintre event KeyBinding si system.
    shootRocket(){

        //Verificam daca butonul "X" este apasat si daca nava exista in scena 
        //In caz afirmativ populam vectorul cu cele 3 rachete
        if(this.canShoot && this.ship != null){
            this.rocketList.push(new Rocket(
                this.ship.getX + 4 / 3 * this.ship.getRadius * Math.cos(this.ship.getDegree), // Pozitia X
                this.ship.getY - 4 / 3 * this.ship.getRadius * Math.sin(this.ship.getDegree), // Pozitia Y
                this.ship.getSize / 15 , // marimea rachetei
                this.rocketSpeed * Math.cos(this.ship.getDegree) / FPS_LIMIT, //Viteza pe axa X
                -this.rocketSpeed * Math.sin(this.ship.getDegree) / FPS_LIMIT //Viteza pe axa y
            ),
            new Rocket(
                this.ship.getX - this.ship.getRadius * ( 2 / 3 * Math.cos(this.ship.getDegree) + Math.sin(this.ship.getDegree)), // Pozitia X
                this.ship.getY + this.ship.getRadius * ( 2 / 3 * Math.sin(this.ship.getDegree) - Math.cos(this.ship.getDegree)), // Pozitia Y
                this.ship.getSize / 15 , // marimea rachetei
                this.rocketSpeed * Math.cos(this.ship.getDegree) / FPS_LIMIT, //Viteza pe axa X
                -this.rocketSpeed * Math.sin(this.ship.getDegree) / FPS_LIMIT //Viteza pe axa y
            ),
            new Rocket(
                this.ship.getX - this.ship.getRadius * ( 2 / 3 * Math.cos(this.ship.getDegree) - Math.sin(this.ship.getDegree)), // Pozitia X
                this.ship.getY + this.ship.getRadius * ( 2 / 3 * Math.sin(this.ship.getDegree) + Math.cos(this.ship.getDegree)), // Pozitia Y
                this.ship.getSize / 15 , // marimea rachetei
                this.rocketSpeed * Math.cos(this.ship.getDegree) / FPS_LIMIT, //Viteza pe axa X
                -this.rocketSpeed * Math.sin(this.ship.getDegree) / FPS_LIMIT //Viteza pe axa y
            

            ));


            //Vom apela functia de initializare a rachetelor (definita in clasa Rocket) -> pentru a putea randa si updata.
            for(let i = 0 ; i< this.rocketList.length ; i++){
                this.rocketList[i].onInit();
            }
        }
        //Vom restrictiona apasarea butonului
        this.canShoot = false;
    }

    //saveScore
    saveScore(){
        //scorul jucatorului
        let finalScore = { nume: numeJucator , score: this.score };
        //Citim itemul
        let ladderBoardScore = JSON.parse(localStorage.getItem("ScoreBoard"));

        if(ladderBoardScore == null){
            let newScore = [];
            newScore.push(finalScore);
            localStorage.setItem("ScoreBoard",JSON.stringify(newScore));
            return true;
        
        }else{
        if(ladderBoardScore.length < 5){
            ladderBoardScore.push(finalScore);
            ladderBoardScore.sort(function(a,b) { return b.score - a.score});
            localStorage.setItem("ScoreBoard",JSON.stringify(ladderBoardScore));
        }else if(ladderBoardScore.length == 5){
        for(let i = 0 ; i < ladderBoardScore.length; i++){
            if(ladderBoardScore[i].score < finalScore.score){
                ladderBoardScore[i] = finalScore;
                break;
            }
        }
        localStorage.setItem("ScoreBoard",JSON.stringify(ladderBoardScore));
        return true;
    }}
    return false;
    }
}




//Initialization
const FPS_LIMIT = 60; // Numarul de frameuri 
const DeltaTime = 1000; // Timpul global
let numeJucator = null;
let canvas = document.getElementById("gCanvas"); // Canvasul
let context = canvas.getContext("2d"); // Contextul

let scene = new Game(); // Creem scena
scene.onInit(); // Initializam

//Declaram functia principala, unde se petrece intreg loop-ul jocului
function main(){
    if(numeJucator != null){
    scene.onUpdate();
    }
}

setInterval(main,DeltaTime/FPS_LIMIT); // Pe baza variabilelor de mai intilizam functia principala si "timestap-ul" unui update.




//Functie care updateaza scorul
function onPlay(){
    
    let nume_aux = document.getElementById("njucator").value;
    if(nume_aux.length != 0){
        numeJucator = nume_aux;
        document.getElementById("pdiv").remove(); 

        let score_elem = document.getElementById("sc");
        let buttonScore = document.createElement("button");
        buttonScore.innerHTML = "Afiseaza scorul";
        buttonScore.onclick = onButtonScore;
        score_elem.append(buttonScore);

    }else{
        let remove_lastSpan = document.getElementById("pdiv").lastChild;
        console.log(remove_lastSpan)
        if(remove_lastSpan.length != 0){
            remove_lastSpan.remove();
        }

        let span = document.createElement("span"); 
        let text = document.createTextNode("!!!Numele trebuie completat!!!");
        span.appendChild(text);
        span.style.color = "red";
        document.getElementById("pdiv").append(span);
    }

    
}
//Functie care afiseaza scorul
function onButtonScore(){
    const scoreBoard = JSON.parse(localStorage.getItem("ScoreBoard"));
    if(scoreBoard != null){
    let text = "";
    for(let i = 0 ; i < scoreBoard.length; i++){
        text += "Nume: " + scoreBoard[i].nume + " scor: " + scoreBoard[i].score + "\n";
    }

    alert(text);
}else{
    alert("Nu exista date");
}
}