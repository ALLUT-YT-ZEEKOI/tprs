require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter("jsonify", (data) => JSON.stringify(data));
  eleventyConfig.addFilter("findBySlug", (arr, slug) => (arr || []).find((item) => item.slug === slug));
  eleventyConfig.addFilter("webp", (imgPath) => (imgPath || "").replace(/\.(jpe?g|png|gif)$/i, ".webp"));

  eleventyConfig.on("eleventy.after", () => {
    require("./scripts/bundle-css.js");
    require("./scripts/bundle-js.js");
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
