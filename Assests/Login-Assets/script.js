
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-target]").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".form-container").forEach(form => form.classList.remove("active"));
            document.getElementById(link.getAttribute("data-target")).classList.add("active");
        });
    });

    document.getElementById("passout").addEventListener("change", function() {
        document.getElementById("passout-fields").classList.remove("hidden");
        document.getElementById("ongoing-fields").classList.add("hidden");
    });
    
    document.getElementById("ongoing").addEventListener("change", function() {
        document.getElementById("ongoing-fields").classList.remove("hidden");
        document.getElementById("passout-fields").classList.add("hidden");
    });
});
