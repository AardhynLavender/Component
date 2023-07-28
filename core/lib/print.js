mergeInto(LibraryManager.library, {
  /**
   * Print a message to the DOM element with id "component:stdout"
   * @param {string} message message to print
   */
  js_client_print: (message) => {
    document.getElementById("component:stdout").innerHTML +=
      "<code>" + UTF8ToString(message) + "</code>";
  },
  /**
   * Clear the DOM element with id "component:stdout"
   */
  js_client_clear: () => {
    document.getElementById("component:stdout").innerHTML = "";
  },
});
