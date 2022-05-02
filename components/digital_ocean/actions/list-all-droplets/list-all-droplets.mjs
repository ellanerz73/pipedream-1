import digitalOceanApp from "../../digital_ocean.app.mjs";
import digitalOceanOptions from "../../common/options.mjs";
import doWrapperModule from "do-wrapper";

export default {
  key: "digital_ocean-list-all-droplets",
  name: "List all Droplets",
  description: "List all Droplets",
  version: "0.0.8",
  type: "action",
  props: {
    digitalOceanApp: digitalOceanApp,
    includeAll: {
      label: "Include all",
      type: "boolean",
      description: "Select either fetch all items or paginated results.",
      default: true,
      reloadProps: true,
    },
    tagName: {
      label: "Tag name",
      type: "string",
      description: "Optionally used to filter Droplets by a specific tag.\n\n**Example:** `production`",
      optional: true,
    },
  },
  async additionalProps() {
    let dynamicProps = {};
    if (!this.includeAll) {
      dynamicProps = {
        ...dynamicProps,
        currentPage: {
          label: "Current page",
          type: "integer",
          description: "Which 'page' of paginated results to return.",
          default: digitalOceanOptions.defaultCurrentPage,
        },
        pageSize: {
          label: "Page size",
          type: "integer",
          description: "Number of items per page.",
          default: digitalOceanOptions.defaultPageSize,
        },
      };
    }
    return dynamicProps;
  },
  async run({ $ }) {
    const DigitalOcean = doWrapperModule.default;
    const api = new DigitalOcean(this.digitalOceanApp.$auth.oauth_access_token, this.page_size);
    try {
      const includeAll = this.includeAll;
      const tagName = this.tagName || undefined;
      if (includeAll) {
        return await api.droplets.getAll(tagName, includeAll);
      } else {
        const currentPage = this.currentPage || digitalOceanOptions.defaultCurrentPage;
        const pageSize = this.pageSize || digitalOceanOptions.defaultCurrentPage;
        return await api.droplets.getAll(tagName, includeAll, currentPage, pageSize);
      }
    } catch (error) {
      $.export("Error", error);
      throw error;
    }
  },
};
