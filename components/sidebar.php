<section id="sidebar">
  <div class="sidebar__headers">
    <div class="sidebar__tabs" role="tablist">
      <button
        class="sidebar__tab sidebar__tab--active text-body-medium"
        data-tab="basic"
        aria-selected="true"
      >
        Basic Fields
      </button>
      <button
        class="sidebar__tab text-body-medium"
        data-tab="advanced"
        aria-selected="false"
      >
        Advanced
      </button>
    </div>

    <div class="sidebar__search">
      <input
        type="search"
        class="search-input sidebar__search-input"
        placeholder="Search fields..."
      />
    </div>
  </div>
  
  <div class="sidebar__content">
    <div class="sidebar__section sidebar__section--active" id="basic">
      <div class="sidebar__items">
        <h3 class="sidebar__section-title text-body-medium">Text Inputs</h3>
        <div class="sidebar__item" draggable="true" data-type="text-field">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Text Field</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="text-area">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Text Area</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="number-field">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Number Field</span>
        </div>
      </div>

      <div class="sidebar__items">
        <h3 class="sidebar__section-title text-body-medium">Choice Inputs</h3>
        <div class="sidebar__item" draggable="true" data-type="dropdown">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Dropdown</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="radio-button">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Radio Button</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="toggle-switch">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Toggle Switch</span>
        </div>
      </div>

      <div class="sidebar__items">
        <h3 class="sidebar__section-title text-body-medium">Date & Time</h3>
        <div class="sidebar__item" draggable="true" data-type="date-picker">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Date Picker</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="time-picker">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Time Picker</span>
        </div>
      </div>
    </div>

    <div class="sidebar__section" id="advanced">
      <div class="sidebar__items">
        <h3 class="sidebar__section-title text-body-medium">File Uploads</h3>
        <div class="sidebar__item" draggable="true" data-type="file-upload">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">File Upload</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="image-upload">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Image Upload</span>
        </div>
      </div>

      <div class="sidebar__items">
        <h3 class="sidebar__section-title text-body-medium">Special Fields</h3>
        <div class="sidebar__item" draggable="true" data-type="signature-field">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Signature Field</span>
        </div>
        <div class="sidebar__item" draggable="true" data-type="rating-scale">
          <span class="sidebar__item-icon"></span>
          <span class="sidebar__item-label">Rating Scale</span>
        </div>
      </div>
    </div>
  </div>
</section>
