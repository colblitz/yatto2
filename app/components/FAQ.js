import React from 'react';

class Reddit extends React.Component {
  render() {
    var link = "http://www.reddit.com/user/" + this.props.username;
    return (
      <a href={link}>/u/{this.props.username}</a>
    );
  }
}

class FAQ extends React.Component {
  render() {
    return (
      <div className="main-page faq-page">
        <div className="panels">
          <div className="panel panel-col">
            <h1>This is the FAQ</h1>

            <h3>What is YATTWO?</h3>
            <p>YATTWO is the successor to YATTO, and is an optimizer for Tap Titans 2. It's a tool built to help you with optimizing artifact leveling and various other TT2-related calculations.</p>

            <h3>Ok, how do I use this?</h3>
            <p>There are three major sections on the main page - the top left area is for management of your information and settings for getting steps, the bottom left area is for inputting your stats, and the right area is where you'll see the recommended steps.</p>
            <p>If you're able to access the files on your phone, you'll be looking for a file called ISavableGlobal.adat. The step options describe how many relics or steps you want to use as a limit for the calculations, and the other options are just information describing your game state.</p>
            <p>The game inputs should be pretty obvious, but more descriptions will be coming.</p>

            <h3>It's not working, what do I do?</h3>
            <p>PM me on reddit (<Reddit username="colblitz"/>) - it would help if you include your account name and/or screenshots of what's going on. There might also be some information in the browser console (right click -> inspect element, and then in what pops up you should see a tab menu with "Elements", "Network", "Sources", "timeline," etc. - click on "Console", then try doing whatever it is that's not working)</p>

            <h3>Do I need to input all of my information? Can I skip x, y, or z?</h3>
            <p>It's recommended that you input everything (even more recommended to load your information for your save file)</p>

            <p>For your hero levels, you want to enter in the hero levels that you would have near your MS. These don't have to be exact values - the important thing is that YATTWO needs to know what hero skills you have, which can have a significant effect.</p>

            <h3>Where do I find my save file?</h3>
            <ul>
              <li>For Android, this save file would be somewhere like /sdcard/Android/data/com.gavehivecorp.taptitans2/files/ISavableGlobal.adat</li>
              <li>For iOS I assume it's something like Apps->Tap Titans 2->Documents->ISavableGlobal.adat (going off of what it was for TT1)</li>
            </ul>

            <h3>How does this actually work?</h3>
            <p>Given a set of artifact levels, pet stats, etc., you can calculate certain values (for example, DPS would be a value, or total AD would be a value, or some sort of overall gold multiplier would be a value). What happens in the optimizations is that you calculate your value of choice for a given starting gamestate, then re-calculate the value again for the gamestate with each artifact leveled up once. Find the option that gives you the greatest gain in value divided by relic cost, and then level that artifact to get you your next starting gamestate. Repeat until you run out of relics.</p>

            <h3>How do you know when to buy a new artifact?</h3>
            <p>The question of when to buy a new artifact has been a long-standing matter of debate and various opinions ever since the start of TT1. In my opinion, the two major questions that need to be answered by a strategy are 1., How do you determine/evaluate the efficiency of buying a new artifact, and 2., How do you deal with the fact that you don't know what artifact you're going to get?</p>

            <p>YATTWO deals with the first question in the following way - one of the best things about buying a new artifact is that after you buy one, it's very likely to be relatively very cheap to level, and so it makes sense to include this sort of "run of cheap levels" with the overall benefit of buying a new artifact. How you would do this, then, is you first see which artifact would give you the best benefit from leveling it normally, and get a base leveling efficiency from that. Then, you consider buying an artifact, and you level your new artifact until the efficiency of leveling this new artifact is worse than that base leveling efficiency. You look at what level you got up to, and then you calculate the overall efficiency of how much value gain you got divided by the total cost of buying and leveling. If this overall efficiency is better than the base leveling efficiency, it means that you should buy an artifact.</p>

            <p>YATTWO deals with the second question by just taking an average value across all the artifacts that you could potentially get, since (theoretically) you should have an equal chance of getting any artifact.</p>

            <h3>What are all the different methods?</h3>
            <ul>
              <li><b>AD</b> - optimize for most AD</li>
              <li><b>Gold</b> - optimize for greatest gold gains</li>
              <li><b>Pet Dmg</b> - optimize for most pet damage</li>
              <li><b>Tap Dmg</b> - optimize for most tap damage</li>
              <li><b>Hero Dmg</b> - optimize for most hero damage</li>
              <li><b>DmgE</b> - uses a formula (described in <a href="https://redd.it/5oeks2">this thread</a>) to convert gold multipliers increases to an equivalent damage increase in order to optimize for both at the same time</li>
              <li><b>RelicE</b> - uses a formula (I'll write a post about it soon) to convert damage increases to an equivalent relics gain increase in order to include Book of Shadows in the optimizations</li>
            </ul>

            <h3>You should do ____!</h3>
            <p>This is my <a href="https://github.com/colblitz/yatto2/blob/master/todo.txt">current todo list</a>. If your idea isn't on there, feel free to contact me</p>

            <h3>Can I look at the source?</h3>
            <p>Repo link in footer</p>

            <h1>Special Thanks</h1>
            <ul>
              <li><Reddit username="Titansmasher_"/> for helping to find the constants files</li>
              <li>Discord user n1nja for helping with decrypting the save file</li>
              <li>Marzx13 and <Reddit username="ElGuien"/> for hashing out the <a href="https://redd.it/5oeks2">gold to damage conversion</a></li>
              <li><Reddit username="mokrinsky"/> for fixing my nginx setup</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;