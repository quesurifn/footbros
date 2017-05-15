productService = (function () {

    var baseURL = "http://footbros.com";

    // The public API
    return {
        findById: function(id) {
            return $.ajax(baseURL + "/products/" + id);
        },
        findAll: function(values) {
            return $.ajax({url: baseURL + "/products", data: values});
        }
    };

}());