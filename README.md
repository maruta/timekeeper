# Time Keeper
HTML5 and JavaScript based timer with notification chime for academic conference.

### How to Use?
Access
https://maruta.github.io/timekeeper/  
or you can use local copy of this repository.

**:bangbang: Be careful to turn off screen savers and automatic screen cut :bangbang:**

### How to Save the Settings?
All current settings are included in URL.
Just use bookmark to preserve your settings.

When you are using Chrome and running local copy of Time Keeper,
Chrome does not permit to update the URL due to a security reason.
Time Keeper logo on left-top is the link to the URL with the current setting, and can be used to get the URL.

### Need a countdown timer?

[Set negative initial and bell times.](http://maruta.github.io/timekeeper/#t0=-15:00&t1=-10:00&t2=-5:00&t3=0:00&m=Click%20to%20edit%20this%20message.
)

### How to Customize Appearance?

 * Edit timekeeper/theme/default.css
 * By using class added to the body tag, the appearance can be changed according to the phase and state of the timer.
 * Theme can be specified via URL as  
   http://maruta.github.io/timekeeper/#th=example  
   In this case, timekeeper/theme/example.css will be loaded in place of default.css.

### Use with OBS Studio via browser source

 * When Time Keeper is imported into OBS Studio via a browser source, it is possible to link scene switching with timer operation.
 * When you switch to a scene that contains the magic keywords `:standby`, `:start`, and `:pause` in the scene name, the corresponding button will be pressed.

https://user-images.githubusercontent.com/486675/118618497-a43d7780-b7fe-11eb-8662-587abeeae9ab.mp4

### License
Timekeeper is open-sourced software licensed under The MIT License.

This repository contains codes from

 * [jQuery](https://jquery.org/license/) licensed under MIT License
 * [jQuery Timer plugin](http://www.mattptr.net/) licensed under BSD License
 * [Bootstrap](https://github.com/twbs/bootstrap/blob/master/LICENSE) licensed under MIT License
 * [DOMPurify](https://github.com/cure53/DOMPurify) licensed under Apache-2.0 License

and

 * A modified version of [Roboto](https://fonts.google.com/specimen/Roboto/about) font
    * In this version, the "colon" is replaced with a "fancy colon" to be displayed in the proper position in the time display. Roboto is licensed under the Apache-2.0 License. Our modifications don't in any way alter the existing license of the font. 
