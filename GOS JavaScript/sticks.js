let numsticks = 20;

let playernum = 1;

window.alert("Welcome to the game of sticks");

while(true)
{
    window.alert(`There are ${numsticks} left!`);

    if(numsticks == 0)
    {
        window.alert(`Player ${playernum} lost!`);
        break;
    }

    let stickstoremove = window.prompt(`Player ${playernum} pick a number of sticks`);

    if(stickstoremove <= 0 || stickstoremove > 3 || stickstoremove > numsticks)
    {
        continue;
    }

    numsticks -= stickstoremove;

    playernum == 1? playernum = 2: playernum = 1 
}