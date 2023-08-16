mergeInto(LibraryManager.library, {
  /**
   * Print a message to the DOM element with id "component:console"
   * @param {string} message message to print
   */
  js_client_print: (message) => {
    document.getElementById("component:console").innerHTML +=
      "<code>" + UTF8ToString(message) + "</code>";
  },
  /**
   * Clear the DOM element with id "component:console"
   */
  js_client_clear: () => {
    document.getElementById("component:console").innerHTML = "";
  },
});
