# A Modded Vortex MPC Utility

### What is this?
* A copy of [official vortex MPC](http://www.vortexgear.tw/mpc/index.html), and modified to fix some issue and support more functionality.
* A web tool.
* Some dumb javascripts.

### Why?
* Apparently the official tool let you overwrite the Fn/Fn1/Pn key position and only apply them on the currently selected profile, yet the UI treat this feature as applying globally.
* And I don't like it, so I fixed it.
* While doing that, I found some cool things as well.

### Any notes before I use it?
* Currently, the Func.key changes will apply to __ALL__ profiles, __including the default profile__.
* Maybe try not to modify the default profile as it is currently not officially supported.
* For Vortex Core:
	* The official manual told you Fn+M,<,>,Shift is can not be changed, but you can totally do that without any problem.
	* __Pn layer is better than Fn layer.__ _Alert: this is an opinion._
* For other keyboards:
	* The MPC support these keyboards, but I have no idea if they have MPC firmwares yet.
* For Pok3r:
	* Too bad it is definitely not supported currently. Maybe you should keep your attention on the [QMK custom firmware.](https://github.com/pok3r-custom/)
* __Only Vortex Core__ has been tested. Take cautions while applying to other keyboards. Feel free to leave any feedbacks on other keyboards.

### How to.
* You can use the [github pages version](https://tsfreddie.github.io/vortex_mpc_mod/)
* You can also download the source code, and open index.html yourself (Cookies do not work for local files)

### Difference from the official one
* Func.key changes now will be applied to all profiles.
* You can make changes to the default profile now.

### Are you...
* No, I will not provide any support regarding this modded tool.
* No, I'm not liable for any damage __you__ made to you keyboard via this tool. __You__ decided to use it __yourself__.

### Can you...
* Sure, provide any feedback you came up as an issue.
* Yes, I will check pull requests.

### Do you need help?
* Yes. Please send help.
* Also, they put 12M of elements straight into index.html. If you want to dig throught that and make it data-driven that would be great. (They are using vue.js btw)
