import me from "./assets/image.png";

function About()
{
    return (
        <div class="container">
            <div class="item item-1">
                <img alt="Tyler Le" src={me}></img>
            </div>

            <dl class="item info item-2">
                <dt class="item item-1">Phone</dt>
                <dd class="item item-5"><b>408-784-9893</b></dd>

                <dt class="item item-2">Email</dt>
                <dd class="item item-6"><b>tylerle122002@gmail.com</b></dd>

                <dt class="item item-3">GitHub</dt>
                <dd class="item item-7"><b><a href="https://github.com/TheLuckyPerson">TheLuckyPerson</a></b></dd>

                <dt class="item item-4">Itch</dt>
                <dd class="item item-8"><b><a href="https://thelucky.itch.io/">thelucky</a></b></dd>
            </dl>

            <div class="item item-3">
                <h2>What is Instadice?</h2>
                <hr/>
                <p>Instadice is a website which enables you to create custom die and roll them. 
                    You can also roll dice using the premade ones from the roll menu. 
                </p>
            </div>

            <div class="item item-4">
                <h2>About Me</h2>
                <hr/>
                <p>Computer Science 4th Year Calpoly San Luis Obispo. 
                    I like programming, video games, and manga/anime. 
                    Am down to play Tetris vs at any time!</p>
            </div>
        </div>
    )
}

export default About;