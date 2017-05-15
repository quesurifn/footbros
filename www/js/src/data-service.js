productService = (function () {

    var baseURL = "http://footbros.com";

    // The public API
    return {
        findById: function(id) {
            //return $.ajax(baseURL + "/products/" + id);
             return $.ajax("/products/" + id);
        },
        findAll: function(values) {
            return $.ajax({url: "/products", data: values});
        }
    };

}());