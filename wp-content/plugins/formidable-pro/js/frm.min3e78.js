var frmFrontForm;
function frmFrontFormJS() {
  var action = "";
  var jsErrors = [];
  function maybeAddPolyfills() {
    var i;
    if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.msMatchesSelector;
    if (!Element.prototype.closest)
      Element.prototype.closest = function (s) {
        var el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    if (window.NodeList && !NodeList.prototype.forEach)
      NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (i = 0; i < this.length; i++)
          callback.call(thisArg, this[i], i, this);
      };
  }
  function triggerCustomEvent(el, eventName, data) {
    var event;
    if (typeof window.CustomEvent === "function")
      event = new CustomEvent(eventName);
    else if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, false, true);
    } else return;
    event.frmData = data;
    el.dispatchEvent(event);
  }
  function getFieldId(field, fullID) {
    var nameParts,
      fieldId,
      isRepeating = false,
      fieldName = "";
    if (field instanceof jQuery) fieldName = field.attr("name");
    else fieldName = field.name;
    if (typeof fieldName === "undefined") fieldName = "";
    if (fieldName === "") {
      if (field instanceof jQuery) fieldName = field.data("name");
      else fieldName = field.getAttribute("data-name");
      if (typeof fieldName === "undefined") fieldName = "";
      if (fieldName !== "" && fieldName) return fieldName;
      return 0;
    }
    nameParts = fieldName
      .replace("item_meta[", "")
      .replace("[]", "")
      .split("]");
    if (nameParts.length < 1) return 0;
    nameParts = nameParts.filter(function (n) {
      return n !== "";
    });
    fieldId = nameParts[0];
    if (nameParts.length === 1) return fieldId;
    if (nameParts[1] === "[form" || nameParts[1] === "[row_ids") return 0;
    if (jQuery('input[name="item_meta[' + fieldId + '][form]"]').length) {
      fieldId = nameParts[2].replace("[", "");
      isRepeating = true;
    }
    if ("other" === fieldId)
      if (isRepeating) fieldId = nameParts[3].replace("[", "");
      else fieldId = nameParts[1].replace("[", "");
    if (fullID === true)
      if (fieldId === nameParts[0])
        fieldId = fieldId + "-" + nameParts[1].replace("[", "");
      else
        fieldId =
          fieldId + "-" + nameParts[0] + "-" + nameParts[1].replace("[", "");
    return fieldId;
  }
  function disableSubmitButton($form) {
    $form
      .find('input[type="submit"], input[type="button"], button[type="submit"]')
      .attr("disabled", "disabled");
  }
  function enableSubmitButton($form) {
    $form
      .find('input[type="submit"], input[type="button"], button[type="submit"]')
      .prop("disabled", false);
  }
  function disableSaveDraft($form) {
    $form.find("a.frm_save_draft").css("pointer-events", "none");
  }
  function enableSaveDraft($form) {
    $form.find("a.frm_save_draft").css("pointer-events", "");
  }
  function validateForm(object) {
    var errors, r, rl, n, nl, fields, field, requiredFields;
    errors = [];
    requiredFields = jQuery(object)
      .find(
        ".frm_required_field:visible input, .frm_required_field:visible select, .frm_required_field:visible textarea"
      )
      .filter(":not(.frm_optional)");
    if (requiredFields.length)
      for (r = 0, rl = requiredFields.length; r < rl; r++) {
        if (hasClass(requiredFields[r], "ed_button")) continue;
        errors = checkRequiredField(requiredFields[r], errors);
      }
    fields = jQuery(object).find("input,select,textarea");
    if (fields.length)
      for (n = 0, nl = fields.length; n < nl; n++) {
        field = fields[n];
        if ("" === field.value) {
          if ("number" === field.type) checkValidity(field, errors);
          continue;
        }
        validateFieldValue(field, errors);
        checkValidity(field, errors);
      }
    errors = validateRecaptcha(object, errors);
    return errors;
  }
  function checkValidity(field, errors) {
    var fieldID;
    if ("object" !== typeof field.validity || false !== field.validity.valid)
      return;
    fieldID = getFieldId(field, true);
    if ("undefined" === typeof errors[fieldID])
      errors[fieldID] = getFieldValidationMessage(field, "data-invmsg");
    if ("function" === typeof field.reportValidity) field.reportValidity();
  }
  function hasClass(element, targetClass) {
    var className = " " + element.className + " ";
    return -1 !== className.indexOf(" " + targetClass + " ");
  }
  function maybeValidateChange(field) {
    if (field.type === "url") maybeAddHttpToUrl(field);
    if (jQuery(field).closest("form").hasClass("frm_js_validate"))
      validateField(field);
  }
  function maybeAddHttpToUrl(field) {
    var url = field.value;
    var matches = url.match(/^(https?|ftps?|mailto|news|feed|telnet):/);
    if (field.value !== "" && matches === null) field.value = "http://" + url;
  }
  function validateField(field) {
    var key,
      errors = [],
      $fieldCont = jQuery(field).closest(".frm_form_field");
    if (
      $fieldCont.hasClass("frm_required_field") &&
      !jQuery(field).hasClass("frm_optional")
    )
      errors = checkRequiredField(field, errors);
    if (errors.length < 1) validateFieldValue(field, errors);
    removeFieldError($fieldCont);
    if (Object.keys(errors).length > 0)
      for (key in errors) addFieldError($fieldCont, key, errors);
  }
  function validateFieldValue(field, errors) {
    if (field.type === "hidden");
    else if (field.type === "number") checkNumberField(field, errors);
    else if (field.type === "email") checkEmailField(field, errors);
    else if (field.type === "password") checkPasswordField(field, errors);
    else if (field.type === "url") checkUrlField(field, errors);
    else if (field.pattern !== null) checkPatternField(field, errors);
    triggerCustomEvent(document, "frm_validate_field_value", {
      field: field,
      errors: errors,
    });
  }
  function checkRequiredField(field, errors) {
    var checkGroup,
      tempVal,
      i,
      placeholder,
      val = "",
      fieldID = "",
      fileID = field.getAttribute("data-frmfile");
    if (
      field.type === "hidden" &&
      fileID === null &&
      !isAppointmentField(field) &&
      !isInlineDatepickerField(field)
    )
      return errors;
    if (field.type === "checkbox" || field.type === "radio") {
      checkGroup = jQuery('input[name="' + field.name + '"]')
        .closest(".frm_required_field")
        .find("input:checked");
      jQuery(checkGroup).each(function () {
        val = this.value;
      });
    } else if (field.type === "file" || fileID) {
      if (typeof fileID === "undefined") {
        fileID = getFieldId(field, true);
        fileID = fileID.replace("file", "");
      }
      if (typeof errors[fileID] === "undefined") val = getFileVals(fileID);
      fieldID = fileID;
    } else {
      if (hasClass(field, "frm_pos_none")) return errors;
      val = jQuery(field).val();
      if (val === null) val = "";
      else if (typeof val !== "string") {
        tempVal = val;
        val = "";
        for (i = 0; i < tempVal.length; i++)
          if (tempVal[i] !== "") val = tempVal[i];
      }
      if (hasClass(field, "frm_other_input")) {
        fieldID = getFieldId(field, false);
        if (val === "")
          field = document.getElementById(field.id.replace("-otext", ""));
      } else fieldID = getFieldId(field, true);
      if (hasClass(field, "frm_time_select"))
        fieldID = fieldID.replace("-H", "").replace("-m", "");
      else if (isSignatureField(field)) {
        if (val === "")
          val = jQuery(field)
            .closest(".frm_form_field")
            .find(
              '[name="' +
                field.getAttribute("name").replace("[typed]", "[output]") +
                '"]'
            )
            .val();
        fieldID = fieldID.replace("-typed", "");
      }
      placeholder = field.getAttribute("data-frmplaceholder");
      if (placeholder !== null && val === placeholder) val = "";
    }
    if (val === "") {
      if (fieldID === "") fieldID = getFieldId(field, true);
      if (!(fieldID in errors))
        errors[fieldID] = getFieldValidationMessage(field, "data-reqmsg");
    }
    return errors;
  }
  function isSignatureField(field) {
    var name = field.getAttribute("name");
    return "string" === typeof name && "[typed]" === name.substr(-7);
  }
  function isAppointmentField(field) {
    return hasClass(field, "ssa_appointment_form_field_appointment_id");
  }
  function isInlineDatepickerField(field) {
    return (
      "hidden" === field.type &&
      "_alt" === field.id.substr(-4) &&
      hasClass(field.nextElementSibling, "frm_date_inline")
    );
  }
  function getFileVals(fileID) {
    var val = "",
      fileFields = jQuery(
        'input[name="file' +
          fileID +
          '"], input[name="file' +
          fileID +
          '[]"], input[name^="item_meta[' +
          fileID +
          ']"]'
      );
    fileFields.each(function () {
      if (val === "") val = this.value;
    });
    return val;
  }
  function checkUrlField(field, errors) {
    var fieldID,
      url = field.value;
    if (
      url !== "" &&
      !/^http(s)?:\/\/(?:localhost|(?:[\da-z\.-]+\.[\da-z\.-]+))/i.test(url)
    ) {
      fieldID = getFieldId(field, true);
      if (!(fieldID in errors))
        errors[fieldID] = getFieldValidationMessage(field, "data-invmsg");
    }
  }
  function checkEmailField(field, errors) {
    var fieldID = getFieldId(field, true),
      pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    if ("" !== field.value && pattern.test(field.value) === false)
      errors[fieldID] = getFieldValidationMessage(field, "data-invmsg");
    confirmField(field, errors);
  }
  function checkPasswordField(field, errors) {
    confirmField(field, errors);
  }
  function confirmField(field, errors) {
    var value,
      confirmValue,
      firstField,
      fieldID = getFieldId(field, true),
      strippedId = field.id.replace("conf_", ""),
      strippedFieldID = fieldID.replace("conf_", ""),
      confirmField = document.getElementById(
        strippedId.replace("field_", "field_conf_")
      );
    if (
      confirmField === null ||
      typeof errors["conf_" + strippedFieldID] !== "undefined"
    )
      return;
    if (fieldID !== strippedFieldID) {
      firstField = document.getElementById(strippedId);
      value = firstField.value;
      confirmValue = confirmField.value;
      if ("" !== value && "" !== confirmValue && value !== confirmValue)
        errors["conf_" + strippedFieldID] = getFieldValidationMessage(
          confirmField,
          "data-confmsg"
        );
    } else validateField(confirmField);
  }
  function checkNumberField(field, errors) {
    var fieldID,
      number = field.value;
    if (number !== "" && isNaN(number / 1) !== false) {
      fieldID = getFieldId(field, true);
      if (!(fieldID in errors))
        errors[fieldID] = getFieldValidationMessage(field, "data-invmsg");
    }
  }
  function checkPatternField(field, errors) {
    var fieldID,
      text = field.value,
      format = getFieldValidationMessage(field, "pattern");
    if (format !== "" && text !== "") {
      fieldID = getFieldId(field, true);
      if (!(fieldID in errors)) {
        format = new RegExp("^" + format + "$", "i");
        if (format.test(text) === false)
          errors[fieldID] = getFieldValidationMessage(field, "data-invmsg");
      }
    }
  }
  function setSelectPlaceholderColor() {
    var selects = document.querySelectorAll(".form-field select"),
      styleElement = document.querySelector(".with_frm_style"),
      textColorDisabled = styleElement
        ? getComputedStyle(styleElement)
            .getPropertyValue("--text-color-disabled")
            .trim()
        : "",
      changeSelectColor;
    if (!selects.length || !textColorDisabled) return;
    changeSelectColor = function (select) {
      if (
        select.options[select.selectedIndex] &&
        hasClass(select.options[select.selectedIndex], "frm-select-placeholder")
      )
        select.style.setProperty("color", textColorDisabled, "important");
      else select.style.color = "";
    };
    Array.prototype.forEach.call(selects, function (select) {
      changeSelectColor(select);
      select.addEventListener("change", function () {
        changeSelectColor(select);
      });
    });
  }
  function hasInvisibleRecaptcha(object) {
    var recaptcha, recaptchaID, alreadyChecked;
    if (isGoingToPrevPage(object)) return false;
    recaptcha = jQuery(object).find(
      '.frm-g-recaptcha[data-size="invisible"], .g-recaptcha[data-size="invisible"]'
    );
    if (recaptcha.length) {
      recaptchaID = recaptcha.data("rid");
      alreadyChecked = grecaptcha.getResponse(recaptchaID);
      if (alreadyChecked.length === 0) return recaptcha;
      else return false;
    } else return false;
  }
  function executeInvisibleRecaptcha(invisibleRecaptcha) {
    var recaptchaID = invisibleRecaptcha.data("rid");
    grecaptcha.reset(recaptchaID);
    grecaptcha.execute(recaptchaID);
  }
  function validateRecaptcha(form, errors) {
    var recaptchaID,
      response,
      fieldContainer,
      fieldID,
      $recaptcha = jQuery(form).find(".frm-g-recaptcha");
    if ($recaptcha.length) {
      recaptchaID = $recaptcha.data("rid");
      try {
        response = grecaptcha.getResponse(recaptchaID);
      } catch (e) {
        if (jQuery(form).find('input[name="recaptcha_checked"]').length)
          return errors;
        else response = "";
      }
      if (response.length === 0) {
        fieldContainer = $recaptcha.closest(".frm_form_field");
        fieldID = fieldContainer
          .attr("id")
          .replace("frm_field_", "")
          .replace("_container", "");
        errors[fieldID] = "";
      }
    }
    return errors;
  }
  function getFieldValidationMessage(field, messageType) {
    var msg, errorHtml;
    msg = field.getAttribute(messageType);
    if (null === msg) msg = "";
    if ("" !== msg && shouldWrapErrorHtmlAroundMessageType(messageType)) {
      errorHtml = field.getAttribute("data-error-html");
      if (null !== errorHtml) {
        errorHtml = errorHtml.replace(/\+/g, "%20");
        msg = decodeURIComponent(errorHtml).replace("[error]", msg);
        msg = msg.replace("[key]", getFieldId(field, false));
      }
    }
    return msg;
  }
  function shouldWrapErrorHtmlAroundMessageType(type) {
    return "pattern" !== type;
  }
  function shouldJSValidate(object) {
    var validate = jQuery(object).hasClass("frm_js_validate");
    if (
      validate &&
      typeof frmProForm !== "undefined" &&
      (frmProForm.savingDraft(object) || frmProForm.goingToPreviousPage(object))
    )
      validate = false;
    return validate;
  }
  function getFormErrors(object, action) {
    var fieldset, data, success, error, shouldTriggerEvent;
    if (typeof action === "undefined")
      jQuery(object).find('input[name="frm_action"]').val();
    fieldset = jQuery(object).find(".frm_form_field");
    fieldset.addClass("frm_doing_ajax");
    data =
      jQuery(object).serialize() +
      "&action=frm_entries_" +
      action +
      "&nonce=" +
      frm_js.nonce;
    shouldTriggerEvent = object.classList.contains(
      "frm_trigger_event_on_submit"
    );
    success = function (response) {
      var defaultResponse,
        formID,
        replaceContent,
        pageOrder,
        formReturned,
        contSubmit,
        delay,
        $fieldCont,
        key,
        inCollapsedSection,
        frmTrigger,
        newTab;
      defaultResponse = { content: "", errors: {}, pass: false };
      if (response === null) response = defaultResponse;
      response = response.replace(/^\s+|\s+$/g, "");
      if (response.indexOf("{") === 0) response = JSON.parse(response);
      else response = defaultResponse;
      if (typeof response.redirect !== "undefined") {
        if (shouldTriggerEvent) {
          triggerCustomEvent(object, "frmSubmitEvent");
          return;
        }
        jQuery(document).trigger("frmBeforeFormRedirect", [object, response]);
        if (!response.openInNewTab) {
          window.location = response.redirect;
          return;
        }
        newTab = window.open(response.redirect, "_blank");
        if (!newTab && response.fallbackMsg && response.content)
          response.content = response.content
            .trim()
            .replace(
              /(<\/div><\/div>)$/,
              " " + response.fallbackMsg + "</div></div>"
            );
      }
      if (response.content !== "") {
        if (shouldTriggerEvent) {
          triggerCustomEvent(object, "frmSubmitEvent");
          return;
        }
        removeSubmitLoading(jQuery(object));
        if (frm_js.offset != -1) frmFrontForm.scrollMsg(jQuery(object), false);
        formID = jQuery(object).find('input[name="form_id"]').val();
        response.content = response.content.replace(
          / frm_pro_form /g,
          " frm_pro_form frm_no_hide "
        );
        replaceContent = jQuery(object).closest(".frm_forms");
        removeAddedScripts(replaceContent, formID);
        delay = maybeSlideOut(replaceContent, response.content);
        setTimeout(function () {
          var container, input, previousInput;
          replaceContent.replaceWith(response.content);
          addUrlParam(response);
          if (typeof frmThemeOverride_frmAfterSubmit === "function") {
            pageOrder = jQuery(
              'input[name="frm_page_order_' + formID + '"]'
            ).val();
            formReturned = jQuery(response.content)
              .find('input[name="form_id"]')
              .val();
            frmThemeOverride_frmAfterSubmit(
              formReturned,
              pageOrder,
              response.content,
              object
            );
          }
          if (typeof response.recaptcha !== "undefined") {
            container = jQuery("#frm_form_" + formID + "_container").find(
              ".frm_fields_container"
            );
            input =
              '<input type="hidden" name="recaptcha_checked" value="' +
              response.recaptcha +
              '">';
            previousInput = container.find('input[name="recaptcha_checked"]');
            if (previousInput.length) previousInput.replaceWith(input);
            else container.append(input);
          }
          afterFormSubmitted(object, response);
        }, delay);
      } else if (Object.keys(response.errors).length) {
        removeSubmitLoading(jQuery(object), "enable");
        contSubmit = true;
        removeAllErrors();
        $fieldCont = null;
        for (key in response.errors) {
          $fieldCont = jQuery(object).find("#frm_field_" + key + "_container");
          if ($fieldCont.length) {
            if (!$fieldCont.is(":visible")) {
              inCollapsedSection = $fieldCont.closest(".frm_toggle_container");
              if (inCollapsedSection.length) {
                frmTrigger = inCollapsedSection.prev();
                if (!frmTrigger.hasClass("frm_trigger"))
                  frmTrigger = frmTrigger.prev(".frm_trigger");
                frmTrigger.trigger("click");
              }
            }
            if ($fieldCont.is(":visible")) {
              addFieldError($fieldCont, key, response.errors);
              contSubmit = false;
            }
          }
        }
        jQuery(object)
          .find(".frm-g-recaptcha, .g-recaptcha, .h-captcha")
          .each(function () {
            var $recaptcha = jQuery(this),
              recaptchaID = $recaptcha.data("rid");
            if (typeof grecaptcha !== "undefined" && grecaptcha)
              if (recaptchaID) grecaptcha.reset(recaptchaID);
              else grecaptcha.reset();
            if (typeof hcaptcha !== "undefined" && hcaptcha) hcaptcha.reset();
          });
        jQuery(document).trigger("frmFormErrors", [object, response]);
        fieldset.removeClass("frm_doing_ajax");
        scrollToFirstField(object);
        if (contSubmit) object.submit();
        else {
          jQuery(object).prepend(response.error_message);
          checkForErrorsAndMaybeSetFocus();
        }
      } else {
        showFileLoading(object);
        object.submit();
      }
    };
    error = function () {
      jQuery(object)
        .find('input[type="submit"], input[type="button"]')
        .prop("disabled", false);
      object.submit();
    };
    postToAjaxUrl(object, data, success, error);
  }
  function postToAjaxUrl(form, data, success, error) {
    var ajaxUrl, action, ajaxParams;
    ajaxUrl = frm_js.ajax_url;
    action = form.getAttribute("action");
    if (
      "string" === typeof action &&
      -1 !== action.indexOf("?action=frm_forms_preview")
    )
      ajaxUrl = action.split("?action=frm_forms_preview")[0];
    ajaxParams = { type: "POST", url: ajaxUrl, data: data, success: success };
    if ("function" === typeof error) ajaxParams.error = error;
    jQuery.ajax(ajaxParams);
  }
  function afterFormSubmitted(object, response) {
    var formCompleted = jQuery(response.content).find(".frm_message");
    if (formCompleted.length)
      jQuery(document).trigger("frmFormComplete", [object, response]);
    else jQuery(document).trigger("frmPageChanged", [object, response]);
  }
  function removeAddedScripts(formContainer, formID) {
    var endReplace = jQuery(".frm_end_ajax_" + formID);
    if (endReplace.length) {
      formContainer.nextUntil(".frm_end_ajax_" + formID).remove();
      endReplace.remove();
    }
  }
  function maybeSlideOut(oldContent, newContent) {
    var c,
      newClass = "frm_slideout";
    if (newContent.indexOf(" frm_slide") !== -1) {
      c = oldContent.children();
      if (newContent.indexOf(" frm_going_back") !== -1)
        newClass += " frm_going_back";
      c.removeClass("frm_going_back");
      c.addClass(newClass);
      return 300;
    }
    return 0;
  }
  function addUrlParam(response) {
    var url;
    if (history.pushState && typeof response.page !== "undefined") {
      url = addQueryVar("frm_page", response.page);
      window.history.pushState({ html: response.php }, "", "?" + url);
    }
  }
  function addQueryVar(key, value) {
    var kvp, i, x;
    key = encodeURI(key);
    value = encodeURI(value);
    kvp = document.location.search.substr(1).split("&");
    i = kvp.length;
    while (i--) {
      x = kvp[i].split("=");
      if (x[0] == key) {
        x[1] = value;
        kvp[i] = x.join("=");
        break;
      }
    }
    if (i < 0) kvp[kvp.length] = [key, value].join("=");
    return kvp.join("&");
  }
  function addFieldError($fieldCont, key, jsErrors) {
    var input, id, describedBy, roleString;
    if ($fieldCont.length && $fieldCont.is(":visible")) {
      $fieldCont.addClass("frm_blank_field");
      input = $fieldCont.find("input, select, textarea");
      id = "frm_error_field_" + key;
      describedBy = input.attr("aria-describedby");
      if (typeof frmThemeOverride_frmPlaceError === "function")
        frmThemeOverride_frmPlaceError(key, jsErrors);
      else {
        if (-1 !== jsErrors[key].indexOf("<div"))
          $fieldCont.append(jsErrors[key]);
        else {
          roleString = frm_js.include_alert_role ? 'role="alert"' : "";
          $fieldCont.append(
            '<div class="frm_error" ' +
              roleString +
              ' id="' +
              id +
              '">' +
              jsErrors[key] +
              "</div>"
          );
        }
        if (typeof describedBy === "undefined") describedBy = id;
        else if (
          describedBy.indexOf(id) === -1 &&
          describedBy.indexOf("frm_error_field_") === -1
        )
          if (input.data("error-first") === 0)
            describedBy = describedBy + " " + id;
          else describedBy = id + " " + describedBy;
        input.attr("aria-describedby", describedBy);
      }
      input.attr("aria-invalid", true);
      jQuery(document).trigger("frmAddFieldError", [$fieldCont, key, jsErrors]);
    }
  }
  function removeFieldError($fieldCont) {
    var errorMessage = $fieldCont.find(".frm_error"),
      errorId = errorMessage.attr("id"),
      input = $fieldCont.find("input, select, textarea"),
      describedBy = input.attr("aria-describedby");
    $fieldCont.removeClass("frm_blank_field has-error");
    errorMessage.remove();
    input.attr("aria-invalid", false);
    input.removeAttr("aria-describedby");
    if (typeof describedBy !== "undefined") {
      describedBy = describedBy.replace(errorId, "");
      input.attr("aria-describedby", describedBy);
    }
  }
  function removeAllErrors() {
    jQuery(".form-field").removeClass("frm_blank_field has-error");
    jQuery(".form-field .frm_error").replaceWith("");
    jQuery(".frm_error_style").remove();
  }
  function scrollToFirstField(object) {
    var field = jQuery(object).find(".frm_blank_field").first();
    if (field.length) frmFrontForm.scrollMsg(field, object, true);
  }
  function showSubmitLoading($object) {
    showLoadingIndicator($object);
    disableSubmitButton($object);
    disableSaveDraft($object);
  }
  function showLoadingIndicator($object) {
    if (
      !$object.hasClass("frm_loading_form") &&
      !$object.hasClass("frm_loading_prev")
    ) {
      addLoadingClass($object);
      $object.trigger("frmStartFormLoading");
    }
  }
  function addLoadingClass($object) {
    var loadingClass = isGoingToPrevPage($object)
      ? "frm_loading_prev"
      : "frm_loading_form";
    $object.addClass(loadingClass);
  }
  function isGoingToPrevPage($object) {
    return (
      typeof frmProForm !== "undefined" &&
      frmProForm.goingToPreviousPage($object)
    );
  }
  function removeSubmitLoading($object, enable, processesRunning) {
    var loadingForm;
    if (processesRunning > 0) return;
    loadingForm = jQuery(".frm_loading_form");
    loadingForm.removeClass("frm_loading_form");
    loadingForm.removeClass("frm_loading_prev");
    loadingForm.trigger("frmEndFormLoading");
    if (enable === "enable") {
      enableSubmitButton(loadingForm);
      enableSaveDraft(loadingForm);
    }
  }
  function showFileLoading(object) {
    var fileval,
      loading = document.getElementById("frm_loading");
    if (loading !== null) {
      fileval = jQuery(object).find("input[type=file]").val();
      if (typeof fileval !== "undefined" && fileval !== "")
        setTimeout(function () {
          jQuery(loading).fadeIn("slow");
        }, 2e3);
    }
  }
  function clearDefault() {
    toggleDefault(jQuery(this), "clear");
  }
  function replaceDefault() {
    toggleDefault(jQuery(this), "replace");
  }
  function toggleDefault($thisField, e) {
    var thisVal,
      v = $thisField.data("frmval").replace(/(\n|\r\n)/g, "\r");
    if (v === "" || typeof v === "undefined") return false;
    thisVal = $thisField.val().replace(/(\n|\r\n)/g, "\r");
    if ("replace" === e) {
      if (thisVal === "") $thisField.addClass("frm_default").val(v);
    } else if (thisVal == v) $thisField.removeClass("frm_default").val("");
  }
  function resendEmail() {
    var $link = jQuery(this),
      entryId = this.getAttribute("data-eid"),
      formId = this.getAttribute("data-fid"),
      label = $link.find(".frm_link_label");
    if (label.length < 1) label = $link;
    label.append('<span class="frm-wait"></span>');
    jQuery.ajax({
      type: "POST",
      url: frm_js.ajax_url,
      data: {
        action: "frm_entries_send_email",
        entry_id: entryId,
        form_id: formId,
        nonce: frm_js.nonce,
      },
      success: function (msg) {
        var admin = document.getElementById("wpbody");
        if (admin === null) label.php(msg);
        else {
          label.php("");
          $link.after(msg);
        }
      },
    });
    return false;
  }
  function confirmClick() {
    var message = jQuery(this).data("frmconfirm");
    return confirm(message);
  }
  function toggleDiv() {
    var div = jQuery(this).data("frmtoggle");
    if (jQuery(div).is(":visible")) jQuery(div).slideUp("fast");
    else jQuery(div).slideDown("fast");
    return false;
  }
  function addTrimFallbackForIE() {
    if (typeof String.prototype.trim !== "function")
      String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
      };
  }
  function addFilterFallbackForIE() {
    var t, len, res, thisp, i, val;
    if (!Array.prototype.filter)
      Array.prototype.filter = function (fun) {
        if (this === void 0 || this === null) throw new TypeError();
        t = Object(this);
        len = t.length >>> 0;
        if (typeof fun !== "function") throw new TypeError();
        res = [];
        thisp = arguments[1];
        for (i = 0; i < len; i++)
          if (i in t) {
            val = t[i];
            if (fun.call(thisp, val, i, t)) res.push(val);
          }
        return res;
      };
  }
  function onHoneypotFieldChange() {
    var css = jQuery(this).css("box-shadow");
    if (css.match(/inset/)) this.parentNode.removeChild(this);
  }
  function maybeMakeHoneypotFieldsUntabbable() {
    document.addEventListener("keydown", handleKeyUp);
    function handleKeyUp(event) {
      var code;
      if ("undefined" !== typeof event.key) code = event.key;
      else if ("undefined" !== typeof event.keyCode && 9 === event.keyCode)
        code = "Tab";
      if ("Tab" === code) {
        makeHoneypotFieldsUntabbable();
        document.removeEventListener("keydown", handleKeyUp);
      }
    }
    function makeHoneypotFieldsUntabbable() {
      document.querySelectorAll(".frm_verify").forEach(function (input) {
        if (input.id && 0 === input.id.indexOf("frm_email_"))
          input.setAttribute("tabindex", -1);
      });
    }
  }
  function changeFocusWhenClickComboFieldLabel() {
    var label;
    var comboInputsContainer = document.querySelectorAll(
      ".frm_combo_inputs_container"
    );
    comboInputsContainer.forEach(function (inputsContainer) {
      if (!inputsContainer.closest(".frm_form_field")) return;
      label = inputsContainer
        .closest(".frm_form_field")
        .querySelector(".frm_primary_label");
      if (!label) return;
      label.addEventListener("click", function (e) {
        inputsContainer
          .querySelector(
            ".frm_form_field:first-child input, .frm_form_field:first-child select, .frm_form_field:first-child textarea"
          )
          .focus();
      });
    });
  }
  function checkForErrorsAndMaybeSetFocus() {
    var errors, element, timeoutCallback;
    if (!frm_js.focus_first_error) return;
    errors = document.querySelectorAll(".frm_form_field .frm_error");
    if (!errors.length) return;
    element = errors[0];
    do {
      element = element.previousSibling;
      if (
        -1 !==
        ["input", "select", "textarea"].indexOf(element.nodeName.toLowerCase())
      ) {
        element.focus();
        break;
      }
      if ("undefined" !== typeof element.classList) {
        if (element.classList.contains("html-active"))
          timeoutCallback = function () {
            var textarea = element.querySelector("textarea");
            if (null !== textarea) textarea.focus();
          };
        else if (element.classList.contains("tmce-active"))
          timeoutCallback = function () {
            tinyMCE.activeEditor.focus();
          };
        if ("function" === typeof timeoutCallback) {
          setTimeout(timeoutCallback, 0);
          break;
        }
      }
    } while (element.previousSibling);
  }
  function isIE() {
    return (
      navigator.userAgent.indexOf("MSIE") > -1 ||
      navigator.userAgent.indexOf("Trident") > -1
    );
  }
  function documentOn(event, selector, handler, options) {
    if ("undefined" === typeof options) options = false;
    document.addEventListener(
      event,
      function (e) {
        var target;
        for (
          target = e.target;
          target && target != this;
          target = target.parentNode
        )
          if (target && target.matches && target.matches(selector)) {
            handler.call(target, e);
            break;
          }
      },
      options
    );
  }
  function initFloatingLabels() {
    var checkFloatLabel,
      checkDropdownLabel,
      checkPlaceholderIE,
      runOnLoad,
      selector,
      floatClass;
    selector =
      ".frm-show-form .frm_inside_container input, .frm-show-form .frm_inside_container select, .frm-show-form .frm_inside_container textarea";
    floatClass = "frm_label_float_top";
    checkFloatLabel = function (input) {
      var container, shouldFloatTop, firstOpt;
      container = input.closest(".frm_inside_container");
      if (!container) return;
      shouldFloatTop = input.value || document.activeElement === input;
      container.classList.toggle(floatClass, shouldFloatTop);
      if ("SELECT" === input.tagName) {
        firstOpt = input.querySelector("option:first-child");
        if (shouldFloatTop) {
          if (firstOpt.hasAttribute("data-label")) {
            firstOpt.textContent = firstOpt.getAttribute("data-label");
            firstOpt.removeAttribute("data-label");
          }
        } else if (firstOpt.textContent) {
          firstOpt.setAttribute("data-label", firstOpt.textContent);
          firstOpt.textContent = "";
        }
      } else if (isIE()) checkPlaceholderIE(input);
    };
    checkDropdownLabel = function () {
      document
        .querySelectorAll(
          ".frm-show-form .frm_inside_container:not(." + floatClass + ") select"
        )
        .forEach(function (input) {
          var firstOpt = input.querySelector("option:first-child");
          if (firstOpt.textContent) {
            firstOpt.setAttribute("data-label", firstOpt.textContent);
            firstOpt.textContent = "";
          }
        });
    };
    checkPlaceholderIE = function (input) {
      if (input.value) return;
      if (document.activeElement === input) {
        if (input.hasAttribute("data-placeholder")) {
          input.placeholder = input.getAttribute("data-placeholder");
          input.removeAttribute("data-placeholder");
        }
      } else if (input.placeholder) {
        input.setAttribute("data-placeholder", input.placeholder);
        input.placeholder = "";
      }
    };
    ["focus", "blur", "change"].forEach(function (eventName) {
      documentOn(
        eventName,
        selector,
        function (event) {
          checkFloatLabel(event.target);
        },
        true
      );
    });
    jQuery(document).on("change", selector, function (event) {
      checkFloatLabel(event.target);
    });
    runOnLoad = function (firstLoad) {
      if (
        firstLoad &&
        document.activeElement &&
        -1 !==
          ["INPUT", "SELECT", "TEXTAREA"].indexOf(
            document.activeElement.tagName
          )
      )
        checkFloatLabel(document.activeElement);
      else if (firstLoad)
        document
          .querySelectorAll(".frm_inside_container")
          .forEach(function (container) {
            var input = container.querySelector("input, select, textarea");
            if (input && "" !== input.value) checkFloatLabel(input);
          });
      checkDropdownLabel();
      if (isIE())
        document.querySelectorAll(selector).forEach(function (input) {
          checkPlaceholderIE(input);
        });
    };
    runOnLoad(true);
    jQuery(document).on("frmPageChanged", function (event) {
      runOnLoad();
    });
    document.addEventListener("frm_after_start_over", function (event) {
      runOnLoad();
    });
  }
  function shouldUpdateValidityMessage(target) {
    if ("INPUT" !== target.nodeName) return false;
    if (!target.dataset.invmsg) return false;
    if ("text" !== target.getAttribute("type")) return false;
    if (target.classList.contains("frm_verify")) return false;
    return true;
  }
  function maybeClearCustomValidityMessage(event, field) {
    var key,
      isInvalid = false;
    if (!shouldUpdateValidityMessage(field)) return;
    for (key in field.validity) {
      if ("customError" === key) continue;
      if ("valid" !== key && field.validity[key] === true) {
        isInvalid = true;
        break;
      }
    }
    if (!isInvalid) field.setCustomValidity("");
  }
  function maybeShowNewTabFallbackMessage() {
    var messageEl;
    if (!window.frmShowNewTabFallback) return;
    messageEl = document.querySelector(
      "#frm_form_" + frmShowNewTabFallback.formId + "_container .frm_message"
    );
    if (!messageEl) return;
    messageEl.insertAdjacentHTML(
      "beforeend",
      " " + frmShowNewTabFallback.message
    );
  }
  function setCustomValidityMessage() {
    var forms, length, index;
    forms = document.getElementsByClassName("frm-show-form");
    length = forms.length;
    for (index = 0; index < length; ++index)
      forms[index].addEventListener(
        "invalid",
        function (event) {
          var target = event.target;
          if (shouldUpdateValidityMessage(target))
            target.setCustomValidity(target.dataset.invmsg);
        },
        true
      );
  }
  function enableSubmitButtonOnBackButtonPress() {
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        document.querySelectorAll(".frm_loading_form").forEach(function (form) {
          enableSubmitButton(jQuery(form));
        });
        removeSubmitLoading();
      }
    });
  }
  return {
    init: function () {
      maybeAddPolyfills();
      jQuery(document).off("submit.formidable", ".frm-show-form");
      jQuery(document).on(
        "submit.formidable",
        ".frm-show-form",
        frmFrontForm.submitForm
      );
      jQuery(
        ".frm-show-form input[onblur], .frm-show-form textarea[onblur]"
      ).each(function () {
        if (jQuery(this).val() === "") jQuery(this).trigger("blur");
      });
      jQuery(document).on("focus", ".frm_toggle_default", clearDefault);
      jQuery(document).on("blur", ".frm_toggle_default", replaceDefault);
      jQuery(".frm_toggle_default").trigger("blur");
      jQuery(document.getElementById("frm_resend_email")).on(
        "click",
        resendEmail
      );
      jQuery(document).on(
        "change",
        '.frm-show-form input[name^="item_meta"], .frm-show-form select[name^="item_meta"], .frm-show-form textarea[name^="item_meta"]',
        frmFrontForm.fieldValueChanged
      );
      jQuery(document).on("change", "[id^=frm_email_]", onHoneypotFieldChange);
      maybeMakeHoneypotFieldsUntabbable();
      jQuery(document).on("click", "a[data-frmconfirm]", confirmClick);
      jQuery("a[data-frmtoggle]").on("click", toggleDiv);
      checkForErrorsAndMaybeSetFocus();
      changeFocusWhenClickComboFieldLabel();
      addTrimFallbackForIE();
      addFilterFallbackForIE();
      initFloatingLabels();
      maybeShowNewTabFallbackMessage();
      jQuery(document).on("frmAfterAddRow", setCustomValidityMessage);
      setCustomValidityMessage();
      jQuery(document).on("frmFieldChanged", maybeClearCustomValidityMessage);
      setSelectPlaceholderColor();
      jQuery(document).on("elementor/popup/show", frmRecaptcha);
      enableSubmitButtonOnBackButtonPress();
    },
    getFieldId: function (field, fullID) {
      return getFieldId(field, fullID);
    },
    renderRecaptcha: function (captcha) {
      var formID,
        recaptchaID,
        size = captcha.getAttribute("data-size"),
        rendered = captcha.getAttribute("data-rid") !== null,
        params = {
          sitekey: captcha.getAttribute("data-sitekey"),
          size: size,
          theme: captcha.getAttribute("data-theme"),
        };
      if (rendered) return;
      if (size === "invisible") {
        formID = jQuery(captcha)
          .closest("form")
          .find('input[name="form_id"]')
          .val();
        jQuery(captcha).closest(".frm_form_field .frm_primary_label").hide();
        params.callback = function (token) {
          frmFrontForm.afterRecaptcha(token, formID);
        };
      }
      recaptchaID = grecaptcha.render(captcha.id, params);
      captcha.setAttribute("data-rid", recaptchaID);
    },
    afterSingleRecaptcha: function () {
      var object = jQuery(".frm-show-form .g-recaptcha").closest("form")[0];
      frmFrontForm.submitFormNow(object);
    },
    afterRecaptcha: function (token, formID) {
      var object = jQuery("#frm_form_" + formID + "_container form")[0];
      frmFrontForm.submitFormNow(object);
    },
    submitForm: function (e) {
      frmFrontForm.submitFormManual(e, this);
    },
    submitFormManual: function (e, object) {
      var isPro,
        errors,
        invisibleRecaptcha = hasInvisibleRecaptcha(object),
        classList = object.className.trim().split(/\s+/gi);
      if (classList && invisibleRecaptcha.length < 1) {
        isPro = classList.indexOf("frm_pro_form") > -1;
        if (!isPro) return;
      }
      if (
        jQuery("body").hasClass("wp-admin") &&
        jQuery(object).closest(".frmapi-form").length < 1
      )
        return;
      e.preventDefault();
      if (
        typeof frmProForm !== "undefined" &&
        typeof frmProForm.submitAllowed === "function"
      )
        if (!frmProForm.submitAllowed(object)) return;
      if (invisibleRecaptcha.length) {
        showLoadingIndicator(jQuery(object));
        executeInvisibleRecaptcha(invisibleRecaptcha);
      } else {
        errors = frmFrontForm.validateFormSubmit(object);
        if (Object.keys(errors).length === 0) {
          showSubmitLoading(jQuery(object));
          frmFrontForm.submitFormNow(object, classList);
        }
      }
    },
    submitFormNow: function (object) {
      var hasFileFields,
        antispamInput,
        classList = object.className.trim().split(/\s+/gi);
      if (
        object.hasAttribute("data-token") &&
        null === object.querySelector('[name="antispam_token"]')
      ) {
        antispamInput = document.createElement("input");
        antispamInput.type = "hidden";
        antispamInput.name = "antispam_token";
        antispamInput.value = object.getAttribute("data-token");
        object.appendChild(antispamInput);
      }
      if (classList.indexOf("frm_ajax_submit") > -1) {
        hasFileFields = jQuery(object)
          .find('input[type="file"]')
          .filter(function () {
            return !!this.value;
          }).length;
        if (hasFileFields < 1) {
          action = jQuery(object).find('input[name="frm_action"]').val();
          frmFrontForm.checkFormErrors(object, action);
        } else object.submit();
      } else object.submit();
    },
    validateFormSubmit: function (object) {
      if (
        typeof tinyMCE !== "undefined" &&
        jQuery(object).find(".wp-editor-wrap").length
      )
        tinyMCE.triggerSave();
      jsErrors = [];
      if (shouldJSValidate(object)) {
        frmFrontForm.getAjaxFormErrors(object);
        if (Object.keys(jsErrors).length)
          frmFrontForm.addAjaxFormErrors(object);
      }
      return jsErrors;
    },
    getAjaxFormErrors: function (object) {
      var customErrors, key;
      jsErrors = validateForm(object);
      if (typeof frmThemeOverride_jsErrors === "function") {
        action = jQuery(object).find('input[name="frm_action"]').val();
        customErrors = frmThemeOverride_jsErrors(action, object);
        if (Object.keys(customErrors).length)
          for (key in customErrors) jsErrors[key] = customErrors[key];
      }
      return jsErrors;
    },
    addAjaxFormErrors: function (object) {
      var key, $fieldCont;
      removeAllErrors();
      for (key in jsErrors) {
        $fieldCont = jQuery(object).find("#frm_field_" + key + "_container");
        if ($fieldCont.length) addFieldError($fieldCont, key, jsErrors);
        else delete jsErrors[key];
      }
      scrollToFirstField(object);
      checkForErrorsAndMaybeSetFocus();
    },
    checkFormErrors: function (object, action) {
      getFormErrors(object, action);
    },
    checkRequiredField: function (field, errors) {
      return checkRequiredField(field, errors);
    },
    showSubmitLoading: function ($object) {
      showSubmitLoading($object);
    },
    removeSubmitLoading: function ($object, enable, processesRunning) {
      removeSubmitLoading($object, enable, processesRunning);
    },
    scrollToID: function (id) {
      var object = jQuery(document.getElementById(id));
      frmFrontForm.scrollMsg(object, false);
    },
    scrollMsg: function (id, object, animate) {
      var newPos,
        m,
        b,
        screenTop,
        screenBottom,
        scrollObj = "";
      if (typeof object === "undefined") {
        scrollObj = jQuery(
          document.getElementById("frm_form_" + id + "_container")
        );
        if (scrollObj.length < 1) return;
      } else if (typeof id === "string")
        scrollObj = jQuery(object).find("#frm_field_" + id + "_container");
      else scrollObj = id;
      jQuery(scrollObj).trigger("focus");
      newPos = scrollObj.offset().top;
      if (!newPos || frm_js.offset === "-1") return;
      newPos = newPos - frm_js.offset;
      m = jQuery("html").css("margin-top");
      b = jQuery("body").css("margin-top");
      if (m || b) newPos = newPos - parseInt(m) - parseInt(b);
      if (newPos && window.innerHeight) {
        screenTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        screenBottom = screenTop + window.innerHeight;
        if (newPos > screenBottom || newPos < screenTop) {
          if (typeof animate === "undefined") jQuery(window).scrollTop(newPos);
          else jQuery("html,body").animate({ scrollTop: newPos }, 500);
          return false;
        }
      }
    },
    fieldValueChanged: function (e) {
      var fieldId = frmFrontForm.getFieldId(this, false);
      if (!fieldId || typeof fieldId === "undefined") return;
      if (e.frmTriggered && e.frmTriggered == fieldId) return;
      jQuery(document).trigger("frmFieldChanged", [this, fieldId, e]);
      if (e.selfTriggered !== true) maybeValidateChange(this);
    },
    savingDraft: function (object) {
      console.warn(
        "DEPRECATED: function frmFrontForm.savingDraft in v3.0 use frmProForm.savingDraft"
      );
      if (typeof frmProForm !== "undefined")
        return frmProForm.savingDraft(object);
    },
    goingToPreviousPage: function (object) {
      console.warn(
        "DEPRECATED: function frmFrontForm.goingToPreviousPage in v3.0 use frmProForm.goingToPreviousPage"
      );
      if (typeof frmProForm !== "undefined")
        return frmProForm.goingToPreviousPage(object);
    },
    hideOrShowFields: function () {
      console.warn(
        "DEPRECATED: function frmFrontForm.hideOrShowFields in v3.0 use frmProForm.hideOrShowFields"
      );
      if (typeof frmProForm !== "undefined") frmProForm.hideOrShowFields();
    },
    hidePreviouslyHiddenFields: function () {
      console.warn(
        "DEPRECATED: function frmFrontForm.hidePreviouslyHiddenFields in v3.0 use frmProForm.hidePreviouslyHiddenFields"
      );
      if (typeof frmProForm !== "undefined")
        frmProForm.hidePreviouslyHiddenFields();
    },
    checkDependentDynamicFields: function (ids) {
      console.warn(
        "DEPRECATED: function frmFrontForm.checkDependentDynamicFields in v3.0 use frmProForm.checkDependentDynamicFields"
      );
      if (typeof frmProForm !== "undefined")
        frmProForm.checkDependentDynamicFields(ids);
    },
    checkDependentLookupFields: function (ids) {
      console.warn(
        "DEPRECATED: function frmFrontForm.checkDependentLookupFields in v3.0 use frmProForm.checkDependentLookupFields"
      );
      if (typeof frmProForm !== "undefined")
        frmProForm.checkDependentLookupFields(ids);
    },
    loadGoogle: function () {
      console.warn(
        "DEPRECATED: function frmFrontForm.loadGoogle in v3.0 use frmProForm.loadGoogle"
      );
      frmProForm.loadGoogle();
    },
    escapeHtml: function (text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    invisible: function (classes) {
      jQuery(classes).css("visibility", "hidden");
    },
    visible: function (classes) {
      jQuery(classes).css("visibility", "visible");
    },
    triggerCustomEvent: triggerCustomEvent,
  };
}
frmFrontForm = frmFrontFormJS();
jQuery(document).ready(function () {
  frmFrontForm.init();
});
function frmRecaptcha() {
  var c,
    cl,
    captchas = jQuery(".frm-g-recaptcha");
  for (c = 0, cl = captchas.length; c < cl; c++)
    frmFrontForm.renderRecaptcha(captchas[c]);
}
function frmAfterRecaptcha(token) {
  frmFrontForm.afterSingleRecaptcha(token);
}
function frmUpdateField(entryId, fieldId, value, message, num) {
  jQuery(
    document.getElementById(
      "frm_update_field_" + entryId + "_" + fieldId + "_" + num
    )
  ).php('<span class="frm-loading-img"></span>');
  jQuery.ajax({
    type: "POST",
    url: frm_js.ajax_url,
    data: {
      action: "frm_entries_update_field_ajax",
      entry_id: entryId,
      field_id: fieldId,
      value: value,
      nonce: frm_js.nonce,
    },
    success: function () {
      if (message.replace(/^\s+|\s+$/g, "") === "")
        jQuery(
          document.getElementById(
            "frm_update_field_" + entryId + "_" + fieldId + "_" + num
          )
        ).fadeOut("slow");
      else
        jQuery(
          document.getElementById(
            "frm_update_field_" + entryId + "_" + fieldId + "_" + num
          )
        ).replaceWith(message);
    },
  });
}
function frmDeleteEntry(entryId, prefix) {
  console.warn(
    "DEPRECATED: function frmDeleteEntry in v2.0.13 use frmFrontForm.deleteEntry"
  );
  jQuery(document.getElementById("frm_delete_" + entryId)).replaceWith(
    '<span class="frm-loading-img" id="frm_delete_' + entryId + '"></span>'
  );
  jQuery.ajax({
    type: "POST",
    url: frm_js.ajax_url,
    data: {
      action: "frm_entries_destroy",
      entry: entryId,
      nonce: frm_js.nonce,
    },
    success: function (html) {
      if (html.replace(/^\s+|\s+$/g, "") === "success")
        jQuery(document.getElementById(prefix + entryId)).fadeOut("slow");
      else
        jQuery(document.getElementById("frm_delete_" + entryId)).replaceWith(
          html
        );
    },
  });
}
function frmOnSubmit(e) {
  console.warn(
    "DEPRECATED: function frmOnSubmit in v2.0 use frmFrontForm.submitForm"
  );
  frmFrontForm.submitForm(e, this);
}
function frm_resend_email(entryId, formId) {
  var $link = jQuery(document.getElementById("frm_resend_email"));
  console.warn("DEPRECATED: function frm_resend_email in v2.0");
  $link.append('<span class="spinner" style="display:inline"></span>');
  jQuery.ajax({
    type: "POST",
    url: frm_js.ajax_url,
    data: {
      action: "frm_entries_send_email",
      entry_id: entryId,
      form_id: formId,
      nonce: frm_js.nonce,
    },
    success: function (msg) {
      $link.replaceWith(msg);
    },
  });
}

function frmProFormJS() {
  var currentlyAddingRow = false;
  var action = "";
  var processesRunning = 0;
  var lookupQueues = {};
  var hiddenSubmitButtons = [];
  var pendingDynamicFieldAjax = [];
  var listWrappersOriginal = {};
  function setNextPage(e) {
    var closestButton;
    if (this.className.indexOf("frm_rootline_title") !== -1) {
      closestButton = this.previousElementSibling;
      closestButton.click();
      return;
    }
    if (this.className.indexOf("frm_rootline_single") !== -1) {
      this.querySelector("input").click();
      return;
    }
    var $thisObj = jQuery(this);
    var thisType = $thisObj.attr("type");
    if (thisType !== "submit") e.preventDefault();
    var f = $thisObj.parents("form").first(),
      v = "",
      d = "",
      thisName = this.name;
    if (
      thisName === "frm_prev_page" ||
      this.className.indexOf("frm_prev_page") !== -1
    )
      v = jQuery(f)
        .find(".frm_next_page")
        .attr("id")
        .replace("frm_next_p_", "");
    else if (
      thisName === "frm_save_draft" ||
      this.className.indexOf("frm_save_draft") !== -1
    )
      d = 1;
    else if (this.className.indexOf("frm_page_skip") !== -1) {
      var goingTo = $thisObj.data("page");
      var formId = jQuery(f).find('input[name="form_id"]').val();
      var orderField = jQuery(f).find(
        'input[name="frm_page_order_' + formId + '"]'
      );
      jQuery(f).append(
        '<input name="frm_last_page" type="hidden" value="' +
          orderField.val() +
          '" />'
      );
      if (goingTo === "") orderField.remove();
      else orderField.val(goingTo);
    } else if (this.className.indexOf("frm_page_back") !== -1)
      v = $thisObj.data("page");
    if (1 === d) resetTinyMceOnDraftSave();
    else resetTinyMceOnPageTurn();
    jQuery(".frm_next_page").val(v);
    jQuery(".frm_saving_draft").val(d);
    if (thisType !== "submit") f.trigger("submit");
  }
  function resetTinyMceOnDraftSave() {
    jQuery(document).one("frmFormComplete", function () {
      jQuery(".wp-editor-area").each(function () {
        reInitializeRichText(this.id);
      });
    });
  }
  function resetTinyMceOnPageTurn() {
    var removeIds = [];
    jQuery(".frm_form_field .wp-editor-area").each(function () {
      removeIds.push(this.id);
    });
    jQuery(document).one("frmPageChanged", function () {
      var removeIndex, removeId;
      for (removeIndex = 0; removeIndex < removeIds.length; ++removeIndex) {
        removeId = removeIds[removeIndex];
        removeRichText(removeId);
      }
      checkConditionalLogic();
    });
  }
  function toggleSection(e) {
    var $toggleContainer, togglingOn;
    if (e.key !== undefined) {
      if (e.key !== " ") return;
    } else if (e.keyCode !== undefined && e.keyCode !== 32) return;
    e.preventDefault();
    $toggleContainer = jQuery(this).parent().children(".frm_toggle_container");
    togglingOn = "none" === $toggleContainer.get(0).style.display;
    if (togglingOn) $toggleContainer.show();
    triggerEvent(document, "frmBeforeToggleSection", { toggleButton: this });
    if (togglingOn) $toggleContainer.hide();
    $toggleContainer.slideToggle("fast");
    if (togglingOn) {
      this.className += " active";
      this.setAttribute("aria-expanded", "true");
    } else {
      this.className = this.className.replace(" active", "");
      this.setAttribute("aria-expanded", "false");
    }
  }
  function loadDateFields() {
    jQuery(document).on("focusin", ".frm_date", triggerDateField);
    loadUniqueTimeFields();
  }
  function triggerDateField() {
    if (
      this.className.indexOf("frm_custom_date") !== -1 ||
      typeof __frmDatepicker === "undefined"
    )
      return;
    var dateFields = __frmDatepicker,
      id = this.id,
      idParts = id.split("-"),
      altID = "";
    if (isRepeatingFieldByName(this.name))
      altID = 'input[id^="' + idParts[0] + '"]';
    else altID = 'input[id^="' + idParts.join("-") + '"]';
    jQuery.datepicker.setDefaults(jQuery.datepicker.regional[""]);
    var optKey = 0;
    for (var i = 0; i < dateFields.length; i++)
      if (
        dateFields[i].triggerID === "#" + id ||
        dateFields[i].triggerID == altID
      ) {
        optKey = i;
        break;
      }
    if (dateFields[optKey].options.defaultDate !== "")
      dateFields[optKey].options.defaultDate = new Date(
        dateFields[optKey].options.defaultDate
      );
    dateFields[optKey].options.beforeShow =
      frmProForm.addFormidableClassToDatepicker;
    dateFields[optKey].options.onClose =
      frmProForm.removeFormidableClassFromDatepicker;
    jQuery(this).datepicker(
      jQuery.extend(
        {},
        jQuery.datepicker.regional[dateFields[optKey].locale],
        dateFields[optKey].options
      )
    );
  }
  function loadDropzones(repeatRow) {
    if (typeof __frmDropzone === "undefined") return;
    var uploadFields = __frmDropzone;
    for (var i = 0; i < uploadFields.length; i++) loadDropzone(i, repeatRow);
  }
  function loadDropzone(i, repeatRow) {
    var field,
      max,
      uploadedCount,
      form,
      uploadFields = __frmDropzone,
      uploadField = uploadFields[i],
      selector = "#" + uploadField.phpID + "_dropzone",
      fieldName = uploadField.fieldName;
    if (
      typeof repeatRow !== "undefined" &&
      selector.indexOf("-0_dropzone") !== -1
    ) {
      selector = selector.replace("-0_dropzone", "-" + repeatRow + "_dropzone");
      fieldName = fieldName.replace("[0]", "[" + repeatRow + "]");
      delete uploadField.mockFiles;
    }
    field = jQuery(selector);
    if (
      field.length < 1 ||
      field.hasClass("dz-clickable") ||
      field.hasClass("dz-started")
    )
      return;
    max = uploadField.maxFiles;
    if (typeof uploadField.mockFiles !== "undefined") {
      uploadedCount = uploadField.mockFiles.length;
      if (max > 0) max = max - uploadedCount;
    }
    form = field.closest("form");
    uploadField = uploadFields[i];
    field.dropzone({
      url: getAjaxUrl(form.get(0)),
      headers: { "Frm-Dropzone": 1 },
      addRemoveLinks: false,
      paramName: field.attr("id").replace("_dropzone", ""),
      maxFilesize: uploadField.maxFilesize,
      minFilesize: uploadField.minFilesize,
      maxFiles: max,
      uploadMultiple: uploadField.uploadMultiple,
      hiddenInputContainer: field.parent()[0],
      dictDefaultMessage: uploadField.defaultMessage,
      dictFallbackMessage: uploadField.fallbackMessage,
      dictFallbackText: uploadField.fallbackText,
      dictFileTooBig: uploadField.fileTooBig,
      dictFileTooSmall: uploadField.fileTooSmall,
      dictInvalidFileType: uploadField.invalidFileType,
      dictResponseError: uploadField.responseError,
      dictCancelUpload: uploadField.cancel,
      dictCancelUploadConfirmation: uploadField.cancelConfirm,
      dictRemoveFile: uploadField.remove,
      dictMaxFilesExceeded: uploadField.maxFilesExceeded,
      resizeMethod: "contain",
      resizeWidth: uploadField.resizeWidth,
      resizeHeight: uploadField.resizeHeight,
      thumbnailWidth: 60,
      thumbnailHeight: 60,
      timeout: uploadField.timeout,
      previewTemplate: filePreviewHTML(uploadField),
      acceptedFiles: uploadField.acceptedFiles,
      fallback: function () {
        jQuery(this.element).closest("form").removeClass("frm_ajax_submit");
      },
      init: function () {
        var hidden, mockFileIndex, mockFileData, mockFile;
        hidden = field.parent().find(".dz-hidden-input");
        if (typeof hidden.attr("id") === "undefined")
          hidden.attr("id", uploadFields[i].label);
        this.on("thumbnail", function (file) {
          if (file.size < 1024 * 1024 * this.options.minFilesize)
            file.rejectSize();
        });
        this.on("sending", function (file, xhr, formData) {
          if (isSpam(uploadFields[i].parentFormID, uploadField.checkHoneypot)) {
            this.removeFile(file);
            alert(frm_js.file_spam);
            return false;
          } else {
            formData.append("action", "frm_submit_dropzone");
            formData.append("field_id", uploadFields[i].fieldID);
            formData.append("form_id", uploadFields[i].formID);
            formData.append("nonce", frm_js.nonce);
            if (form.get(0).hasAttribute("data-token"))
              formData.append(
                "antispam_token",
                form.get(0).getAttribute("data-token")
              );
          }
        });
        this.on("processing", function () {
          if (!this.options.uploadMultiple) this.removeEventListeners();
        });
        this.on("success", function (file, response) {
          var mediaIDs, m, mediaID;
          mediaIDs = JSON.parse(response);
          for (m = 0; m < mediaIDs.length; m++)
            if (uploadFields[i].uploadMultiple !== true) {
              mediaID = mediaIDs[m];
              jQuery('input[name="' + fieldName + '"]').val(mediaID);
            }
          if (this.options.uploadMultiple === false) this.disable();
          clearErrorsOnUpload(file.previewElement);
        });
        this.on("successmultiple", function (files, response) {
          var mediaIDs = JSON.parse(response);
          for (var m = 0; m < files.length; m++)
            jQuery(files[m].previewElement).append(
              getHiddenUploadHTML(uploadFields[i], mediaIDs[m], fieldName)
            );
        });
        this.on("complete", function (file) {
          var fileName, node, img, thumbnail;
          processesRunning--;
          removeSubmitLoading(form, uploadFields[i].formID, processesRunning);
          if (typeof file.mediaID === "undefined") return;
          if (uploadFields[i].uploadMultiple)
            jQuery(file.previewElement).append(
              getHiddenUploadHTML(uploadFields[i], file.mediaID, fieldName)
            );
          fileName = file.previewElement.querySelectorAll("[data-dz-name]");
          for (var _i = 0, _len = fileName.length; _i < _len; _i++) {
            node = fileName[_i];
            if (file.accessible)
              node.innerHTML =
                '<a href="' +
                file.url +
                '" target="_blank" rel="noopener">' +
                file.name +
                "</a>";
            else node.innerHTML = file.name;
            if (file.ext) {
              img = file.previewElement.querySelector(".dz-image img");
              if (null !== img) {
                thumbnail = maybeGetExtensionThumbnail(file.ext);
                if (false !== thumbnail) img.setAttribute("src", thumbnail);
              }
            }
          }
        });
        this.on("addedfile", function (file) {
          var ext, thumbnail;
          ext = file.name.split(".").pop();
          thumbnail = maybeGetExtensionThumbnail(ext);
          processesRunning++;
          frmFrontForm.showSubmitLoading(form);
          if (false !== thumbnail)
            jQuery(file.previewElement)
              .find(".dz-image img")
              .attr("src", thumbnail);
        });
        function clearErrorsOnUpload(fileElement) {
          var container = fileElement.closest(".frm_form_field");
          if (!container) return;
          container.classList.remove("frm_blank_field", "has-error");
          container
            .querySelectorAll(".form-field .frm_error, .frm_error_style")
            .forEach(function (error) {
              if (error.parentNode) error.parentNode.removeChild(error);
            });
        }
        this.on("removedfile", function (file) {
          var fileCount = this.files.length;
          if (this.options.uploadMultiple === false && fileCount < 1)
            this.enable();
          if (
            file.accepted !== false &&
            uploadFields[i].uploadMultiple !== true
          )
            jQuery('input[name="' + fieldName + '"]').val("");
          if (file.accepted !== false && typeof file.mediaID !== "undefined") {
            jQuery(file.previewElement).remove();
            fileCount = this.files.length;
            this.options.maxFiles = uploadFields[i].maxFiles - fileCount;
          }
        });
        if (typeof uploadFields[i].mockFiles !== "undefined")
          for (
            mockFileIndex = 0;
            mockFileIndex < uploadFields[i].mockFiles.length;
            mockFileIndex++
          ) {
            mockFileData = uploadFields[i].mockFiles[mockFileIndex];
            mockFile = {
              name: mockFileData.name,
              size: mockFileData.size,
              url: mockFileData.file_url,
              mediaID: mockFileData.id,
              accessible: mockFileData.accessible,
              ext: mockFileData.ext,
              type: mockFileData.type,
            };
            this.emit("addedfile", mockFile);
            if (
              mockFile.accessible &&
              "string" === typeof mockFile.type &&
              0 === mockFile.type.indexOf("image/")
            )
              this.emit("thumbnail", mockFile, mockFileData.url);
            this.emit("complete", mockFile);
            this.files.push(mockFile);
          }
      },
      accept: function (file, done) {
        var message = this.options.dictFileTooSmall.replace(
          "{{minFilesize}}",
          this.options.minFilesize
        );
        file.rejectSize = function () {
          done(message);
        };
        return done();
      },
    });
  }
  function removeSubmitLoading(form, formId, processesRunning) {
    var enable = submitButtonIsConditionallyDisabled(formId) ? "" : "enable";
    if ("" === enable)
      jQuery(".frm_loading_form")
        .find("a.frm_save_draft")
        .css("pointer-events", "");
    frmFrontForm.removeSubmitLoading(jQuery(form), enable, processesRunning);
  }
  function submitButtonIsConditionallyDisabled(formId) {
    return (
      submitButtonIsConditionallyNotAvailable(formId) &&
      "disable" === __FRMRULES["submit_" + formId].hideDisable
    );
  }
  function submitButtonIsConditionallyNotAvailable(formId) {
    var hideFields = document.getElementById("frm_hide_fields_" + formId);
    return (
      hideFields &&
      -1 !==
        hideFields.value.indexOf(
          '"frm_form_' + formId + '_container .frm_final_submit"'
        )
    );
  }
  function maybeGetExtensionThumbnail(ext) {
    if (-1 !== ["jpg", "jpeg", "png"].indexOf(ext)) return false;
    if ("pdf" === ext) return getProPluginUrl() + "/images/pdf.svg";
    if (-1 !== ext.indexOf("xls")) return getProPluginUrl() + "/images/xls.svg";
    return getProPluginUrl() + "/images/doc.svg";
  }
  function getProPluginUrl() {
    var freePluginUrlSplitBySlashes = frm_js.images_url.split("/");
    freePluginUrlSplitBySlashes.pop();
    freePluginUrlSplitBySlashes.pop();
    freePluginUrlSplitBySlashes.push("formidable-pro");
    return freePluginUrlSplitBySlashes.join("/");
  }
  function filePreviewHTML(field) {
    return (
      '<div class="dz-preview dz-file-preview frm_clearfix">\n' +
      '<div class="dz-image"><img data-dz-thumbnail /></div>\n' +
      '<div class="dz-column">\n' +
      '<div class="dz-details">\n' +
      '<div class="dz-filename"><span data-dz-name></span></div>\n' +
      " " +
      '<div class="dz-size"><span data-dz-size></span></div>\n' +
      '<a class="dz-remove frm_remove_link" href="javascript:undefined;" data-dz-remove title="' +
      field.remove +
      '">' +
      '<svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm3.6-13L10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15l3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L15 6.4z"/></svg>' +
      "</a>" +
      "</div>\n" +
      '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n' +
      '<div class="dz-error-message"><span data-dz-errormessage></span></div>\n' +
      "</div>\n" +
      "</div>"
    );
  }
  function getHiddenUploadHTML(field, mediaID, fieldName) {
    return (
      '<input name="' +
      fieldName +
      '[]" type="hidden" value="' +
      mediaID +
      '" data-frmfile="' +
      field.fieldID +
      '" />'
    );
  }
  function removeFile() {
    var fieldName = jQuery(this).data("frm-remove");
    fadeOut(jQuery(this).closest(".dz-preview"));
    var singleField = jQuery('input[name="' + fieldName + '"]');
    if (singleField.length) singleField.val("");
  }
  function postToAjaxUrl(form, data, success, error, extraParams) {
    var ajaxParams = "object" === typeof extraParams ? extraParams : {};
    ajaxParams.type = "POST";
    ajaxParams.url = getAjaxUrl(form);
    ajaxParams.data = data;
    ajaxParams.success = success;
    if ("function" === typeof error) ajaxParams.error = error;
    jQuery.ajax(ajaxParams);
  }
  function getAjaxUrl(form) {
    var ajaxUrl, action;
    ajaxUrl = frm_js.ajax_url;
    action = form.getAttribute("action");
    if (
      "string" === typeof action &&
      -1 !== action.indexOf("?action=frm_forms_preview")
    )
      ajaxUrl = action.split("?action=frm_forms_preview")[0];
    return ajaxUrl;
  }
  function isSpam(formID, checkHoneypot) {
    if (isHeadless()) return true;
    return checkHoneypot && isHoneypotSpam(formID);
  }
  function isHoneypotSpam(formID) {
    var honeypotField = document.getElementById("frm_email_" + formID);
    if (honeypotField === null)
      honeypotField = document.getElementById("frm_verify_" + formID);
    return honeypotField !== null && honeypotField.value !== "";
  }
  function isHeadless() {
    return (
      window._phantom ||
      window.callPhantom ||
      window.__phantomas ||
      window.Buffer ||
      window.emit ||
      window.spawn
    );
  }
  function showOtherText() {
    var type = this.type,
      other = false,
      select = false;
    if (type === "select-one") {
      select = true;
      var curOpt = this.options[this.selectedIndex];
      if (
        typeof curOpt !== "undefined" &&
        curOpt.className === "frm_other_trigger"
      )
        other = true;
    } else if (type === "select-multiple") {
      select = true;
      var allOpts = this.options;
      other = false;
      for (var i = 0; i < allOpts.length; i++)
        if (allOpts[i].className === "frm_other_trigger")
          if (allOpts[i].selected) {
            other = true;
            break;
          }
    }
    if (select) {
      var otherField = jQuery(this).parent().children(".frm_other_input");
      if (otherField.length)
        if (other)
          otherField[0].className = otherField[0].className.replace(
            "frm_pos_none",
            ""
          );
        else {
          if (otherField[0].className.indexOf("frm_pos_none") < 1)
            otherField[0].className = otherField[0].className + " frm_pos_none";
          otherField[0].value = "";
        }
    } else if (type === "radio") {
      if (jQuery(this).is(":checked")) {
        jQuery(this)
          .closest(".frm_radio")
          .children(".frm_other_input")
          .removeClass("frm_pos_none");
        jQuery(this)
          .closest(".frm_radio")
          .siblings()
          .children(".frm_other_input")
          .addClass("frm_pos_none")
          .val("");
      }
    } else if (type === "checkbox")
      if (this.checked)
        jQuery(this)
          .closest(".frm_checkbox")
          .children(".frm_other_input")
          .removeClass("frm_pos_none");
      else
        jQuery(this)
          .closest(".frm_checkbox")
          .children(".frm_other_input")
          .addClass("frm_pos_none")
          .val("");
  }
  function setToggleAriaChecked() {
    this.nextElementSibling.setAttribute(
      "aria-checked",
      this.checked ? "true" : "false"
    );
  }
  function maybeCheckDependent(_, field, fieldId, e) {
    var $field, originalEvent;
    $field = jQuery(field);
    checkFieldsWithConditionalLogicDependentOnThis(fieldId, $field);
    originalEvent = getOriginalEvent(e);
    checkFieldsWatchingLookup(fieldId, $field, originalEvent);
    doCalculation(fieldId, $field);
  }
  function getOriginalEvent(e) {
    var originalEvent;
    if (
      typeof e.originalEvent !== "undefined" ||
      e.currentTarget.className.indexOf("frm_chzn") > -1
    )
      originalEvent = "value changed";
    else originalEvent = "other";
    return originalEvent;
  }
  function checkFieldsWithConditionalLogicDependentOnThis(
    fieldId,
    changedInput
  ) {
    if (
      typeof __FRMRULES === "undefined" ||
      typeof __FRMRULES[fieldId] === "undefined" ||
      __FRMRULES[fieldId].dependents.length < 1 ||
      changedInput === null ||
      typeof changedInput === "undefined"
    )
      return;
    var triggerFieldArgs = __FRMRULES[fieldId];
    var repeatArgs = getRepeatArgsFromFieldName(changedInput[0].name);
    pendingDynamicFieldAjax = [];
    for (var i = 0, l = triggerFieldArgs.dependents.length; i < l; i++)
      hideOrShowFieldById(triggerFieldArgs.dependents[i], repeatArgs);
    processPendingAjax();
  }
  function processPendingAjax() {
    var fieldsToProcess, postData, data, formId, form;
    if (!pendingDynamicFieldAjax.length) return;
    fieldsToProcess = pendingDynamicFieldAjax.slice();
    postData = [];
    for (data in fieldsToProcess) postData.push(fieldsToProcess[data].data);
    formId = fieldsToProcess[0].args.depFieldArgs.formId;
    function processDynamicField(html, depFieldArgs, onCurrentPage) {
      var $fieldDiv, $optContainer, $listInputs, listVal;
      if (onCurrentPage) {
        $fieldDiv = jQuery("#" + depFieldArgs.containerId);
        addLoadingIcon($fieldDiv);
        $optContainer = $fieldDiv.find(
          ".frm_opt_container, .frm_data_container"
        );
        $optContainer.php(html);
        $listInputs = $optContainer.children("input");
        listVal = $listInputs.val();
        removeLoadingIcon($optContainer);
        if ("" === html || "" === listVal) hideDynamicField(depFieldArgs);
        else showDynamicField(depFieldArgs, $fieldDiv, $listInputs, true);
      } else updateHiddenDynamicListField(depFieldArgs, html);
    }
    function ajaxHandler(response) {
      var i;
      for (i = 0; i < fieldsToProcess.length; i++)
        processDynamicField(
          "undefined" === typeof response[i] ? "" : response[i],
          fieldsToProcess[i].args.depFieldArgs,
          fieldsToProcess[i].args.onCurrentPage
        );
    }
    form = getFormById(formId);
    if (form)
      postToAjaxUrl(
        form,
        { action: "frm_fields_ajax_get_data_arr", postData: postData },
        ajaxHandler,
        function (response) {
          console.error(response);
        },
        { dataType: "json" }
      );
  }
  function hideOrShowFieldById(fieldId, triggerFieldRepeatArgs) {
    var depFieldArgs = getRulesForSingleField(fieldId);
    if (depFieldArgs === false || depFieldArgs.conditions.length < 1) return;
    var childFieldDivIds = getAllFieldDivIds(
      depFieldArgs,
      triggerFieldRepeatArgs
    );
    var childFieldNum = childFieldDivIds.length;
    for (var i = 0; i < childFieldNum; i++) {
      depFieldArgs.containerId = childFieldDivIds[i];
      addRepeatRow(depFieldArgs, childFieldDivIds[i]);
      hideOrShowSingleField(depFieldArgs);
    }
  }
  function getAllFieldDivIds(depFieldArgs, triggerFieldArgs) {
    var childFieldDivs = [];
    if (depFieldArgs.isRepeating)
      if (triggerFieldArgs.repeatingSection !== "") {
        var container = "frm_field_" + depFieldArgs.fieldId + "-";
        container +=
          triggerFieldArgs.repeatingSection +
          "-" +
          triggerFieldArgs.repeatRow +
          "_container";
        childFieldDivs.push(container);
      } else childFieldDivs = getAllRepeatingFieldDivIds(depFieldArgs);
    else if (depFieldArgs.fieldType === "submit")
      childFieldDivs.push(getSubmitButtonContainerID(depFieldArgs));
    else
      childFieldDivs.push("frm_field_" + depFieldArgs.fieldId + "_container");
    return childFieldDivs;
  }
  function getSubmitButtonContainerID(depFieldArgs) {
    return "frm_form_" + depFieldArgs.formId + "_container .frm_final_submit";
  }
  function getAllRepeatingFieldDivIds(depFieldArgs) {
    var childFieldDivs = [],
      containerFieldId = getContainerFieldId(depFieldArgs);
    if (isFieldDivOnPage("frm_field_" + containerFieldId + "_container"))
      childFieldDivs = getRepeatingFieldDivIdsOnCurrentPage(
        depFieldArgs.fieldId
      );
    else childFieldDivs = getRepeatingFieldDivIdsAcrossPage(depFieldArgs);
    return childFieldDivs;
  }
  function getRepeatingFieldDivIdsOnCurrentPage(fieldId) {
    var childFieldDivs = [],
      childFields = document.querySelectorAll(
        ".frm_field_" + fieldId + "_container"
      );
    for (var i = 0, l = childFields.length; i < l; i++)
      childFieldDivs.push(childFields[i].id);
    return childFieldDivs;
  }
  function getRepeatingFieldDivIdsAcrossPage(depFieldArgs) {
    var childFieldDivs = [],
      containerFieldId = getContainerFieldId(depFieldArgs),
      fieldDiv =
        "frm_field_" + depFieldArgs.fieldId + "-" + containerFieldId + "-",
      allRows = document.querySelectorAll(
        '[name="item_meta[' + containerFieldId + '][row_ids][]"]'
      );
    for (var i = 0, l = allRows.length; i < l; i++)
      if (allRows[i].value !== "")
        childFieldDivs.push(fieldDiv + allRows[i].value + "_container");
    if (childFieldDivs.length < 1)
      childFieldDivs.push(fieldDiv + "0_container");
    return childFieldDivs;
  }
  function getContainerFieldId(depFieldArgs) {
    var containerFieldId = "";
    if (depFieldArgs.inEmbedForm !== "0")
      containerFieldId = depFieldArgs.inEmbedForm;
    else if (depFieldArgs.inSection !== "0")
      containerFieldId = depFieldArgs.inSection;
    return containerFieldId;
  }
  function addRepeatRow(depFieldArgs, childFieldDivId) {
    if (depFieldArgs.isRepeating) {
      var divParts = childFieldDivId.replace("_container", "").split("-");
      depFieldArgs.repeatRow = divParts[2];
    } else depFieldArgs.repeatRow = "";
  }
  function hideOrShowSingleField(depFieldArgs) {
    var add,
      logicOutcomes = [],
      len = depFieldArgs.conditions.length;
    for (var i = 0; i < len; i++) {
      add = checkLogicCondition(depFieldArgs.conditions[i], depFieldArgs);
      if (add !== null) logicOutcomes.push(add);
    }
    if (logicOutcomes.length)
      routeToHideOrShowField(depFieldArgs, logicOutcomes);
  }
  function getRulesForSingleField(fieldId) {
    if (
      typeof __FRMRULES === "undefined" ||
      typeof __FRMRULES[fieldId] === "undefined"
    )
      return false;
    return __FRMRULES[fieldId];
  }
  function checkLogicCondition(logicCondition, depFieldArgs) {
    var fieldId = logicCondition.fieldId,
      logicFieldArgs = getRulesForSingleField(fieldId),
      fieldValue = getFieldValue(logicFieldArgs, depFieldArgs);
    if (fieldValue === null) return null;
    return getLogicConditionOutcome(
      logicCondition,
      fieldValue,
      depFieldArgs,
      logicFieldArgs
    );
  }
  function getFieldValue(logicFieldArgs, depFieldArgs) {
    var fieldValue = "";
    if ("name" === logicFieldArgs.fieldType)
      fieldValue = getValueFromNameField(logicFieldArgs, depFieldArgs);
    else if (
      logicFieldArgs.inputType === "radio" ||
      logicFieldArgs.inputType === "checkbox" ||
      logicFieldArgs.inputType === "toggle"
    )
      fieldValue = getValueFromRadioOrCheckbox(logicFieldArgs, depFieldArgs);
    else fieldValue = getValueFromTextOrDropdown(logicFieldArgs, depFieldArgs);
    fieldValue = cleanFinalFieldValue(fieldValue);
    return fieldValue;
  }
  function getValueFromNameField(logicFieldArgs, depFieldArgs) {
    var inputName, inputs, nameValues;
    inputName = buildLogicFieldInputName(logicFieldArgs, depFieldArgs);
    inputs = document.querySelectorAll('[name^="' + inputName + '"]');
    nameValues = [];
    inputs.forEach(function (input) {
      nameValues.push(input.value);
    });
    return nameValues.join(" ");
  }
  function getValueFromTextOrDropdown(logicFieldArgs, depFieldArgs) {
    var logicFieldValue = "";
    if (logicFieldArgs.isMultiSelect === true)
      return getValueFromMultiSelectDropdown(logicFieldArgs, depFieldArgs);
    var fieldCall = "field_" + logicFieldArgs.fieldKey;
    if (logicFieldArgs.isRepeating) fieldCall += "-" + depFieldArgs.repeatRow;
    var logicFieldInput = document.getElementById(fieldCall);
    if (logicFieldInput === null) {
      logicFieldValue = parseTimeValue(logicFieldArgs, fieldCall);
      if (logicFieldValue === "")
        logicFieldValue = getValueFromMultiSelectDropdown(
          logicFieldArgs,
          depFieldArgs
        );
    } else logicFieldValue = logicFieldInput.value;
    return logicFieldValue;
  }
  function parseTimeValue(logicFieldArgs, fieldCall) {
    var logicFieldValue = "";
    if (logicFieldArgs.fieldType === "time") {
      var hour = document.getElementById(fieldCall + "_H");
      if (hour !== null) {
        var minute = document.getElementById(fieldCall + "_m");
        logicFieldValue = hour.value + ":" + minute.value;
        var pm = document.getElementById(fieldCall + "_A");
        if (logicFieldValue == ":") logicFieldValue = "";
        else if (pm !== null) logicFieldValue += " " + pm.value;
      }
    }
    return logicFieldValue;
  }
  function getValueFromMultiSelectDropdown(logicFieldArgs, depFieldArgs) {
    var inputName = buildLogicFieldInputName(logicFieldArgs, depFieldArgs),
      logicFieldInputs = document.querySelectorAll(
        '[name^="' + inputName + '"]'
      ),
      selectedVals = [];
    if (logicFieldInputs.length == 1 && logicFieldInputs[0].type !== "hidden") {
      selectedVals = jQuery('[name^="' + inputName + '"]').val();
      if (selectedVals === null) selectedVals = "";
    } else selectedVals = getValuesFromCheckboxInputs(logicFieldInputs);
    return selectedVals;
  }
  function getValueFromRadioOrCheckbox(logicFieldArgs, depFieldArgs) {
    var logicFieldValue,
      inputName = buildLogicFieldInputName(logicFieldArgs, depFieldArgs),
      logicFieldInputs = document.querySelectorAll(
        'input[name^="' + inputName + '"]'
      );
    if (logicFieldInputs.length === 0) return null;
    if (
      logicFieldArgs.inputType === "checkbox" ||
      logicFieldArgs.inputType === "toggle"
    )
      logicFieldValue = getValuesFromCheckboxInputs(logicFieldInputs);
    else logicFieldValue = getValueFromRadioInputs(logicFieldInputs);
    return logicFieldValue;
  }
  function buildLogicFieldInputName(logicFieldArgs, depFieldArgs) {
    var inputName = "";
    if (logicFieldArgs.isRepeating) {
      var sectionId = "";
      if (depFieldArgs.inEmbedForm !== "0")
        sectionId = depFieldArgs.inEmbedForm;
      else sectionId = depFieldArgs.inSection;
      var rowId = depFieldArgs.repeatRow;
      inputName =
        "item_meta[" +
        sectionId +
        "][" +
        rowId +
        "][" +
        logicFieldArgs.fieldId +
        "]";
    } else inputName = "item_meta[" + logicFieldArgs.fieldId + "]";
    return inputName;
  }
  function getValuesFromCheckboxInputs(inputs) {
    var checkedVals = [];
    for (var i = 0, l = inputs.length; i < l; i++)
      if (inputs[i].type === "hidden" || inputs[i].checked)
        checkedVals.push(inputs[i].value);
      else if (typeof inputs[i].dataset.off !== "undefined")
        checkedVals.push(inputs[i].dataset.off);
    if (checkedVals.length === 0) checkedVals = false;
    return checkedVals;
  }
  function cleanFinalFieldValue(fieldValue) {
    if (typeof fieldValue === "undefined") fieldValue = "";
    else if (typeof fieldValue === "string") fieldValue = fieldValue.trim();
    return fieldValue;
  }
  function getLogicConditionOutcome(
    logicCondition,
    fieldValue,
    depFieldArgs,
    logicFieldArgs
  ) {
    var outcome;
    if (
      depFieldArgs.fieldType === "data" &&
      logicFieldArgs.fieldType === "data"
    )
      outcome = getDynamicFieldLogicOutcome(
        logicCondition,
        fieldValue,
        depFieldArgs
      );
    else
      outcome = operators(
        logicCondition.operator,
        logicCondition.value,
        fieldValue
      );
    return outcome;
  }
  function getDynamicFieldLogicOutcome(
    logicCondition,
    fieldValue,
    depFieldArgs
  ) {
    var outcome = false;
    if (logicCondition.value === "")
      if (fieldValue === "" || (fieldValue.length == 1 && fieldValue[0] === ""))
        outcome = false;
      else outcome = true;
    else
      outcome = operators(
        logicCondition.operator,
        logicCondition.value,
        fieldValue
      );
    depFieldArgs.dataLogic = logicCondition;
    depFieldArgs.dataLogic.actualValue = fieldValue;
    return outcome;
  }
  function operators(op, a, b) {
    var theOperators;
    a = prepareLogicValueForComparison(a);
    b = prepareEnteredValueForComparison(a, b);
    if (
      typeof a === "string" &&
      a.indexOf("&quot;") != "-1" &&
      operators(op, a.replace("&quot;", '"'), b)
    )
      return true;
    theOperators = {
      "==": function (c, d) {
        return c === d;
      },
      "!=": function (c, d) {
        return c !== d;
      },
      "<": function (c, d) {
        return c > d;
      },
      "<=": function (c, d) {
        return c >= d;
      },
      ">": function (c, d) {
        return c < d;
      },
      ">=": function (c, d) {
        return c <= d;
      },
      LIKE: function (c, d) {
        if (!d) return false;
        c = prepareLogicValueForLikeComparison(c);
        d = prepareEnteredValueForLikeComparison(c, d);
        return d.indexOf(c) != -1;
      },
      "not LIKE": function (c, d) {
        if (!d) return true;
        c = prepareLogicValueForLikeComparison(c);
        d = prepareEnteredValueForLikeComparison(c, d);
        return d.indexOf(c) == -1;
      },
      "LIKE%": function (c, d) {
        if (!d) return false;
        c = prepareLogicValueForLikeComparison(c);
        d = prepareEnteredValueForLikeComparison(c, d);
        return d.substr(0, c.length) === c;
      },
      "%LIKE": function (c, d) {
        if (!d) return false;
        c = prepareLogicValueForLikeComparison(c);
        d = prepareEnteredValueForLikeComparison(c, d);
        return d.substr(-c.length) === c;
      },
    };
    if ("function" !== typeof theOperators[op]) op = "==";
    return theOperators[op](a, b);
  }
  function prepareLogicValueForComparison(a) {
    if (shouldParseFloat(a)) a = parseFloat(a);
    else if (typeof a === "string") a = a.trim();
    return a;
  }
  function shouldParseFloat(value) {
    return (
      String(value).search(/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/) !== -1
    );
  }
  function prepareEnteredValueForComparison(a, b) {
    if (typeof b === "undefined" || b === null || b === false) b = "";
    if (Array.isArray(b) && jQuery.inArray(String(a), b) > -1) b = a;
    if (typeof a === "number" && typeof b === "string" && shouldParseFloat(b))
      b = parseFloat(b);
    if (typeof b === "string") b = b.trim();
    return b;
  }
  function prepareLogicValueForLikeComparison(val) {
    return prepareValueForLikeComparison(val);
  }
  function prepareEnteredValueForLikeComparison(logicValue, enteredValue) {
    enteredValue = prepareValueForLikeComparison(enteredValue);
    var currentValue = "";
    if (Array.isArray(enteredValue))
      for (var i = 0, l = enteredValue.length; i < l; i++) {
        currentValue = enteredValue[i].toLowerCase();
        if (currentValue.indexOf(logicValue) > -1) {
          enteredValue = logicValue;
          break;
        }
      }
    return enteredValue;
  }
  function prepareValueForLikeComparison(val) {
    if (typeof val === "string") val = val.toLowerCase();
    else if (typeof val === "number") val = val.toString();
    return val;
  }
  function routeToHideOrShowField(depFieldArgs, logicOutcomes) {
    var onCurrentPage,
      action = getHideOrShowAction(depFieldArgs, logicOutcomes);
    if (depFieldArgs.fieldType === "submit")
      onCurrentPage = isSubmitButtonOnPage(depFieldArgs.containerId);
    else onCurrentPage = isFieldDivOnPage(depFieldArgs.containerId);
    if (action == "show")
      if (
        depFieldArgs.fieldType === "data" &&
        depFieldArgs.hasOwnProperty("dataLogic")
      )
        updateDynamicField(depFieldArgs, onCurrentPage);
      else showFieldAndSetValue(depFieldArgs, onCurrentPage);
    else hideFieldAndClearValue(depFieldArgs, onCurrentPage);
  }
  function isFieldDivOnPage(containerId) {
    var fieldDiv = document.getElementById(containerId);
    return fieldDiv !== null;
  }
  function isSubmitButtonOnPage(container) {
    var submitButton = document.querySelector("#" + container);
    return submitButton != null;
  }
  function getHideOrShowAction(depFieldArgs, logicOutcomes) {
    if (depFieldArgs.anyAll === "any")
      if (logicOutcomes.indexOf(true) > -1) action = depFieldArgs.showHide;
      else action = reverseAction(depFieldArgs.showHide);
    else if (logicOutcomes.indexOf(false) > -1)
      action = reverseAction(depFieldArgs.showHide);
    else action = depFieldArgs.showHide;
    return action;
  }
  function reverseAction(action) {
    if (action === "show") action = "hide";
    else action = "show";
    return action;
  }
  function showFieldAndSetValue(depFieldArgs, onCurrentPage) {
    if (isFieldCurrentlyShown(depFieldArgs.containerId, depFieldArgs.formId))
      return;
    removeFromHideFields(depFieldArgs.containerId, depFieldArgs.formId);
    if (depFieldArgs.fieldType === "submit") {
      if (onCurrentPage) showOrEnableSubmitButton(depFieldArgs);
      return;
    }
    if (onCurrentPage) {
      setValuesInsideFieldOnPage(depFieldArgs.containerId, depFieldArgs);
      showFieldContainer(depFieldArgs.containerId);
      triggerEvent(document, "frmShowField");
      if (depFieldArgs.inputType === "rte")
        reInitializeRichText("field_" + depFieldArgs.fieldKey);
    } else setValuesInsideFieldAcrossPage(depFieldArgs);
  }
  function reInitializeRichText(fieldId) {
    var isVisible =
      "undefined" !== typeof tinyMCE.editors[fieldId] &&
      !tinyMCE.editors[fieldId].isHidden();
    if (!isVisible) return;
    removeRichText(fieldId);
    initRichText(fieldId);
  }
  function showOrEnableSubmitButton(depFieldArgs) {
    if (depFieldArgs.hideDisable && depFieldArgs.hideDisable === "disable")
      enableButton("#" + depFieldArgs.containerId);
    else showFieldContainer(depFieldArgs.containerId);
    removeSubmitButtonFromHiddenList(depFieldArgs);
  }
  function removeSubmitButtonFromHiddenList(depFieldArgs) {
    hiddenSubmitButtons = hiddenSubmitButtons.filter(function (button) {
      return button !== depFieldArgs.formKey;
    });
  }
  function enableButton(buttonSelector) {
    var button = document.querySelector(buttonSelector);
    if (button && !button.closest(".frm_loading_form")) button.disabled = false;
  }
  function setValuesInsideFieldOnPage(container, depFieldArgs) {
    var inputs = getInputsInFieldOnPage(container),
      inContainer =
        depFieldArgs.fieldType === "divider" ||
        depFieldArgs.fieldType === "form";
    setValueForInputs(inputs, inContainer, depFieldArgs.formId, "required");
  }
  function setValuesInsideFieldAcrossPage(depFieldArgs) {
    var inputs = getInputsInFieldAcrossPage(depFieldArgs),
      inContainer =
        depFieldArgs.fieldType === "divider" ||
        depFieldArgs.fieldType === "form";
    setValueForInputs(inputs, inContainer, depFieldArgs.formId);
  }
  function getInputsInFieldOnPage(containerId) {
    var container =
      "string" === typeof containerId
        ? document.getElementById(containerId)
        : containerId;
    return container.querySelectorAll(
      'select[name^="item_meta"], textarea[name^="item_meta"], input[name^="item_meta"]'
    );
  }
  function getInputsInFieldAcrossPage(depFieldArgs) {
    var inputs = [];
    if (depFieldArgs.fieldType === "divider")
      inputs = getInputsInHiddenSection(depFieldArgs);
    else if (depFieldArgs.fieldType === "form")
      inputs = getInputsInHiddenEmbeddedForm(depFieldArgs);
    else inputs = getHiddenInputs(depFieldArgs);
    return inputs;
  }
  function getHiddenInputs(depFieldArgs) {
    var name = "";
    if (depFieldArgs.isRepeating) {
      var containerFieldId = getContainerFieldId(depFieldArgs);
      name =
        "item_meta[" +
        containerFieldId +
        "][" +
        depFieldArgs.repeatRow +
        "][" +
        depFieldArgs.fieldId +
        "]";
    } else name = "item_meta[" + depFieldArgs.fieldId + "]";
    return document.querySelectorAll('[name^="' + name + '"]');
  }
  function setValueForInputs(inputs, inContainer, formId, setRequired) {
    var input, prevInput, i;
    if (!inputs.length) return;
    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      if (inContainer && isChildInputConditionallyHidden(input, formId))
        continue;
      if (setRequired === "required") maybeAddRequiredTag(input);
      if (skipSetValue(i, prevInput, inputs)) continue;
      setDefaultValue(input, inContainer);
      maybeSetWatchingFieldValue(input);
      setShownProduct(input);
      maybeDoCalcForSingleField(input);
      prevInput = input;
    }
  }
  function maybeAddRequiredTag(input) {
    var isRequired, isOptional;
    if (
      input.type === "checkbox" ||
      input.type === "radio" ||
      input.type === "file"
    )
      return;
    isRequired = input.parentElement.className.indexOf("frm_required_field");
    isOptional = input.className.indexOf("frm_optional");
    if (isRequired > -1 && isOptional === -1)
      input.setAttribute("aria-required", true);
  }
  function skipSetValue(i, prevInput, inputs) {
    var typeArray = ["checkbox", "radio"];
    if (i < 1 || typeof prevInput === "undefined") return false;
    if (null !== inputs[i].getAttribute("data-frmprice")) return false;
    var isOther = inputs[i].className.indexOf("frm_other_input") !== -1;
    return (
      isOther ||
      (prevInput.name == inputs[i].name &&
        typeArray.indexOf(prevInput.type) > -1)
    );
  }
  function isChildInputConditionallyHidden(input, formId) {
    var fieldDivPart = frmFrontForm.getFieldId(input, true),
      fieldDivId = "frm_field_" + fieldDivPart + "_container";
    return isFieldConditionallyHidden(fieldDivId, formId);
  }
  function showFieldContainer(containerId) {
    var $container = jQuery("#" + containerId).show();
    if (
      $container.hasClass("frm_inside_container") &&
      null === $container.find("select").val()
    )
      $container.find("select").val("").trigger("change");
  }
  function hideFieldAndClearValue(depFieldArgs, onCurrentPage) {
    if (
      isFieldConditionallyHidden(depFieldArgs.containerId, depFieldArgs.formId)
    )
      return;
    addToHideFields(depFieldArgs.containerId, depFieldArgs.formId);
    if (depFieldArgs.fieldType === "submit") {
      if (onCurrentPage) hideOrDisableSubmitButton(depFieldArgs);
      return;
    }
    if (onCurrentPage) {
      hideFieldContainer(depFieldArgs.containerId);
      clearInputsInFieldOnPage(depFieldArgs.containerId);
    } else clearInputsInFieldAcrossPage(depFieldArgs);
  }
  function hideOrDisableSubmitButton(depFieldArgs) {
    if (depFieldArgs.containerId == undefined)
      depFieldArgs.containerId = getSubmitButtonContainerID(depFieldArgs);
    addSubmitButtonToHiddenList(depFieldArgs);
    if (depFieldArgs.hideDisable && depFieldArgs.hideDisable === "disable")
      disableButton("#" + depFieldArgs.containerId);
    else hideFieldContainer(depFieldArgs.containerId);
  }
  function addSubmitButtonToHiddenList(depFieldArgs) {
    hiddenSubmitButtons.push(depFieldArgs.formKey);
  }
  function isOnPageSubmitButtonHidden(formKey) {
    return hiddenSubmitButtons.indexOf(formKey) !== -1;
  }
  function hidePreviouslyHiddenSubmitButton(submitContainerID) {
    var formId = submitContainerID.replace("frm_form_", "");
    formId = formId.replace("_container .frm_final_submit", "");
    var depFieldArgs = getRulesForSingleField("submit_" + formId);
    if (depFieldArgs) hideOrDisableSubmitButton(depFieldArgs);
  }
  function getFormKeyFromFormElementID(elementId) {
    return elementId.replace("form_", "");
  }
  function hideFieldContainer(containerId) {
    jQuery("#" + containerId).hide();
  }
  function disableButton(buttonSelector) {
    jQuery(buttonSelector).prop("disabled", true);
  }
  function jsonParse(str) {
    try {
      var obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return false;
    }
  }
  function clearInputsInFieldOnPage(containerId) {
    var inputs = getInputsInFieldOnPage(containerId);
    clearValueForInputs(inputs, "required");
  }
  function clearInputsInFieldAcrossPage(depFieldArgs) {
    var inputs = getInputsInFieldAcrossPage(depFieldArgs);
    clearValueForInputs(inputs);
  }
  function getInputsInHiddenSection(depFieldArgs) {
    var inputs = [];
    if (depFieldArgs.fieldType === "divider")
      inputs = document.querySelectorAll(
        '[data-sectionid="' + depFieldArgs.fieldId + '"]'
      );
    return inputs;
  }
  function getInputsInHiddenEmbeddedForm(depFieldArgs) {
    return document.querySelectorAll(
      '[id^="field_' + depFieldArgs.fieldKey + '-"]'
    );
  }
  function clearValueForInputs(inputs, required, resetToDefault) {
    var prevInput,
      blankSelect,
      valueChanged,
      l,
      i,
      input,
      defaultVal,
      reset,
      linkedRadioInput;
    if (inputs.length < 1) return;
    valueChanged = true;
    l = inputs.length;
    for (i = 0; i < l; i++) {
      input = inputs[i];
      defaultVal = input.getAttribute("data-frmval");
      reset = resetToDefault && defaultVal;
      if (
        input.className.indexOf("frm_dnc") > -1 ||
        input.name.indexOf("[row_ids]") > -1
      ) {
        prevInput = input;
        continue;
      }
      if (i > 0 && prevInput.name != input.name && valueChanged === true)
        triggerChange(jQuery(prevInput));
      valueChanged = true;
      if (input.type === "radio" || input.type === "checkbox") {
        if (!reset) input.checked = false;
        else if ("radio" === input.type)
          input.checked = defaultVal === input.value;
        else resetCheckboxInputToValue(input, defaultVal);
        maybeClearStarRatingInput(input);
      } else if (input.tagName === "SELECT")
        if (isSlimSelect(input)) setSlimValue(input, reset ? defaultVal : "");
        else {
          if (!reset) {
            blankSelect =
              input.selectedIndex === 0 && input.options[0].text.trim() === "";
            if (blankSelect || input.selectedIndex === -1) valueChanged = false;
            else input.selectedIndex = -1;
          } else valueChanged = resetSelectInputToValue(input, defaultVal);
          var chosenId = input.id.replace(/[^\w]/g, "_");
          var autocomplete = document.getElementById(chosenId + "_chosen");
          if (autocomplete !== null) jQuery(input).trigger("chosen:updated");
        }
      else if (input.type === "range")
        if (!reset) input.value = 0;
        else input.value = defaultVal;
      else if (input.getAttribute("data-frmprice") !== null)
        setHiddenProduct(input);
      else {
        if (!reset) input.value = "";
        else input.value = defaultVal;
        linkedRadioInput =
          input.id.indexOf("-otext") > -1
            ? document.getElementById(input.id.replace("-otext", ""))
            : null;
        if (linkedRadioInput && linkedRadioInput.checked === false)
          input.classList.add("frm_pos_none");
        if (null !== input.getAttribute("data-frmfile"))
          clearDropzoneFiles(input);
      }
      if (required === "required") {
        input.required = false;
        input.setAttribute("aria-required", false);
      }
      prevInput = inputs[i];
    }
    if (valueChanged === true) triggerChange(jQuery(prevInput));
  }
  function setSlimValue(input, value) {
    if (
      value.length &&
      "[" === value[0] &&
      -1 !== value.indexOf(",") &&
      "]" === value[value.length - 1] &&
      "multiple" === input.getAttribute("multiple")
    )
      value = JSON.parse(value);
    input.slim.setSelected(value);
  }
  function maybeClearStarRatingInput(input) {
    var starGroup, checkedInput;
    if (
      "radio" !== input.type ||
      !input.matches(".frm-star-group input:last-of-type")
    )
      return;
    starGroup = input.closest(".frm-star-group");
    checkedInput = starGroup.querySelector("input:checked");
    if (checkedInput) updateStars(checkedInput);
    else clearStars(starGroup, true);
  }
  function resetCheckboxInputToValue(input, val) {
    var i;
    val = jsonParse(val);
    if (!val) return;
    for (i in val)
      if (val[i] === input.value) {
        input.checked = true;
        return;
      }
    input.checked = false;
  }
  function resetSelectInputToValue(input, val) {
    if (input.multiple) return resetMultiSelectInputToValue(input, val);
    var i,
      valueChanged = false,
      options = input.querySelectorAll("option");
    for (i = 0; i < options.length; i++) {
      if (val === options[i].value && !options[i].selected) {
        options[i].selected = true;
        valueChanged = true;
        continue;
      }
      if (val !== options[i].value && options[i].selected) {
        options[i].selected = false;
        valueChanged = true;
      }
    }
    return valueChanged;
  }
  function resetMultiSelectInputToValue(input, val) {
    val = jsonParse(val);
    if (!val) return false;
    var i,
      contained,
      valueChanged = false,
      options = input.querySelectorAll("option");
    for (i = 0; i < options.length; i++) {
      contained = objectContainValue(val, options[i].value);
      if (contained && !options[i].selected) {
        options[i].selected = true;
        valueChanged = true;
        continue;
      }
      if (!contained && options[i].selected) {
        options[i].selected = false;
        valueChanged = true;
      }
    }
    return valueChanged;
  }
  function objectContainValue(obj, val) {
    var x;
    for (x in obj) if (obj[x] === val) return true;
    return false;
  }
  function clearDropzoneFiles(hiddenFileIdField) {
    var dropzoneElement = hiddenFileIdField.nextElementSibling;
    if (
      dropzoneElement &&
      -1 !== dropzoneElement.className.indexOf("frm_dropzone") &&
      "object" === typeof dropzoneElement.dropzone &&
      "function" === typeof dropzoneElement.dropzone.removeAllFiles
    )
      dropzoneElement.dropzone.removeAllFiles(true);
  }
  function isFieldCurrentlyShown(containerId, formId) {
    return isFieldConditionallyHidden(containerId, formId) === false;
  }
  function isFieldConditionallyHidden(containerId, formId) {
    var hidden = false,
      hiddenFields = getHiddenFields(formId);
    if (hiddenFields.indexOf(containerId) > -1) hidden = true;
    return hidden;
  }
  function clearHideFields() {
    var hideFieldInputs = document.querySelectorAll('[id^="frm_hide_fields_"]');
    clearValueForInputs(hideFieldInputs);
  }
  function addToHideFields(htmlFieldId, formId) {
    var hiddenFields = getHiddenFields(formId);
    if (hiddenFields.indexOf(htmlFieldId) > -1);
    else {
      hiddenFields.push(htmlFieldId);
      hiddenFields = JSON.stringify(hiddenFields);
      var frmHideFieldsInput = document.getElementById(
        "frm_hide_fields_" + formId
      );
      if (frmHideFieldsInput !== null) frmHideFieldsInput.value = hiddenFields;
    }
  }
  function getAllHiddenFields() {
    var formId,
      i,
      hiddenFields = [],
      hideFieldInputs = document.querySelectorAll('*[id^="frm_hide_fields_"]'),
      formTotal = hideFieldInputs.length;
    for (i = 0; i < formTotal; i++) {
      formId = hideFieldInputs[i].id.replace("frm_hide_fields_", "");
      hiddenFields = hiddenFields.concat(getHiddenFields(formId));
    }
    return hiddenFields;
  }
  function getHiddenFields(formId) {
    var hiddenFields = [];
    var frmHideFieldsInput = document.getElementById(
      "frm_hide_fields_" + formId
    );
    if (frmHideFieldsInput === null) return hiddenFields;
    hiddenFields = frmHideFieldsInput.value;
    if (hiddenFields) hiddenFields = JSON.parse(hiddenFields);
    else hiddenFields = [];
    return hiddenFields;
  }
  function setDefaultValue(input, inContainer) {
    var placeholder,
      isMultipleSelect,
      $input = jQuery(input),
      defaultValue = $input.data("frmval");
    if (
      typeof defaultValue === "undefined" &&
      input.classList.contains("wp-editor-area")
    ) {
      var defaultField = document.getElementById(input.id + "-frmval");
      if (defaultField !== null) {
        defaultValue = defaultField.value;
        var targetTinyMceEditor = tinymce.get(input.id);
        if (null !== targetTinyMceEditor)
          targetTinyMceEditor.setContent(defaultValue);
      }
    } else if (typeof defaultValue === "undefined" && input.type === "hidden") {
      var $select = $input.next("select[disabled]");
      if ($select.length > 0) defaultValue = $select.data("frmval");
    }
    placeholder = defaultValue;
    defaultValue = setDropdownPlaceholder(defaultValue, input);
    if (placeholder !== defaultValue) placeholder = true;
    if (typeof defaultValue !== "undefined") {
      var numericKey = new RegExp(/\[\d*\]$/i);
      if (input.type === "checkbox" || input.type === "radio")
        setCheckboxOrRadioDefaultValue(input.name, defaultValue);
      else if (input.type === "hidden" && input.name.indexOf("[]") > -1)
        setHiddenCheckboxDefaultValue(input.name, defaultValue);
      else if (
        !inContainer &&
        input.type === "hidden" &&
        input.name.indexOf("][") > -1 &&
        numericKey.test(input.name)
      )
        setHiddenCheckboxDefaultValue(
          input.name.replace(numericKey, ""),
          defaultValue
        );
      else {
        isMultipleSelect = false;
        if (
          placeholder &&
          "boolean" !== typeof placeholder &&
          input.tagName === "SELECT" &&
          -1 !== input.className.indexOf("frm_chzn")
        )
          placeholder = false;
        if (
          "SELECT" === input.tagName &&
          "multiple" === input.getAttribute("multiple")
        )
          isMultipleSelect = true;
        if (defaultValue.constructor === Object)
          if (!isMultipleSelect) {
            var addressType = input
              .getAttribute("name")
              .split("[")
              .slice(-1)[0];
            if (addressType !== null) {
              addressType = addressType.replace("]", "");
              defaultValue = defaultValue[addressType];
              if (typeof defaultValue === "undefined") defaultValue = "";
            }
          }
        if (isMultipleSelect) selectMultiselectOptions(input, defaultValue);
        else {
          if (typeof defaultValue === "object")
            defaultValue = "[" + defaultValue + "]";
          if (isSlimSelect(input)) input.slim.setSelected(defaultValue);
          else input.value = defaultValue;
        }
      }
      if (!placeholder && input.tagName === "SELECT") {
        maybeUpdateChosenOptions(input);
        if (input.value === "") setOtherSelectValue(input, defaultValue);
      }
      triggerChange($input);
    }
  }
  function isSlimSelect(input) {
    return (
      input.classList.contains("frm_slimselect") &&
      "object" === typeof input.slim
    );
  }
  function selectMultiselectOptions(select, values) {
    if (isSlimSelect(select) && "function" === typeof Object.values) {
      select.slim.setSelected(Object.values(values));
      return;
    }
    var valueKey, option;
    for (valueKey in values) {
      option = select.querySelector('option[value="' + values[valueKey] + '"]');
      if (option) option.selected = true;
    }
  }
  function setDropdownPlaceholder(defaultValue, input) {
    var placeholder;
    if (typeof defaultValue === "undefined" && input.tagName === "SELECT") {
      placeholder = input.getAttribute("data-placeholder");
      if (placeholder !== null) defaultValue = "";
    }
    return defaultValue;
  }
  function setCheckboxOrRadioDefaultValue(inputName, defaultValue) {
    var radioInputs = document.getElementsByName(inputName),
      isSet = false,
      firstInput = false;
    if (typeof defaultValue === "object")
      defaultValue = Object.keys(defaultValue).map(function (key) {
        return defaultValue[key];
      });
    for (var i = 0, l = radioInputs.length; i < l; i++) {
      if (firstInput === false) firstInput = radioInputs[i];
      if (radioInputs[i].type === "hidden") {
        if (Array.isArray(defaultValue) && defaultValue[i] !== null)
          radioInputs[i].value = defaultValue[i];
        else radioInputs[i].value = defaultValue;
        isSet = true;
      } else if (
        radioInputs[i].value == defaultValue ||
        (Array.isArray(defaultValue) &&
          defaultValue.indexOf(radioInputs[i].value) > -1)
      ) {
        radioInputs[i].checked = true;
        isSet = true;
        if (radioInputs[i].type === "radio") break;
      }
    }
    if (!isSet && firstInput !== false)
      setOtherValueLimited(firstInput, defaultValue);
  }
  function setHiddenCheckboxDefaultValue(inputName, defaultValue) {
    var hiddenInputs = jQuery('input[name^="' + inputName + '"]').get();
    if (typeof defaultValue === "object")
      defaultValue = Object.keys(defaultValue).map(function (key) {
        return defaultValue[key];
      });
    if (Array.isArray(defaultValue))
      for (var i = 0, l = defaultValue.length; i < l; i++)
        if (i in hiddenInputs) hiddenInputs[i].value = defaultValue[i];
        else;
    else if (hiddenInputs[0] !== null && typeof hiddenInputs[0] !== "undefined")
      hiddenInputs[0].value = defaultValue;
  }
  function removeFromHideFields(htmlFieldId, formId) {
    var hiddenFields = getHiddenFields(formId);
    var itemIndex = hiddenFields.indexOf(htmlFieldId);
    if (itemIndex > -1) {
      hiddenFields.splice(itemIndex, 1);
      hiddenFields = JSON.stringify(hiddenFields);
      var frmHideFieldsInput = document.getElementById(
        "frm_hide_fields_" + formId
      );
      frmHideFieldsInput.value = hiddenFields;
    }
  }
  function checkFieldsWatchingLookup(fieldId, changedInput, originalEvent) {
    if (
      typeof __FRMLOOKUP === "undefined" ||
      typeof __FRMLOOKUP[fieldId] === "undefined" ||
      __FRMLOOKUP[fieldId].dependents.length < 1 ||
      changedInput === null ||
      typeof changedInput === "undefined"
    )
      return;
    var triggerFieldArgs = __FRMLOOKUP[fieldId];
    var parentRepeatArgs = getRepeatArgsFromFieldName(changedInput[0].name);
    for (var i = 0, l = triggerFieldArgs.dependents.length; i < l; i++)
      updateWatchingFieldById(
        triggerFieldArgs.dependents[i],
        parentRepeatArgs,
        originalEvent
      );
  }
  function updateWatchingFieldById(fieldId, parentRepeatArgs, originalEvent) {
    var childFieldArgs = getLookupArgsForSingleField(fieldId);
    if (childFieldArgs === false || childFieldArgs.parents.length < 1) return;
    if (childFieldArgs.fieldType == "lookup")
      updateLookupFieldOptions(childFieldArgs, parentRepeatArgs);
    else if (originalEvent === "value changed")
      updateWatchingFieldValue(childFieldArgs, parentRepeatArgs);
  }
  function updateLookupFieldOptions(childFieldArgs, parentRepeatArgs) {
    var childFieldElements = [];
    if (parentRepeatArgs.repeatRow !== "")
      childFieldElements = getRepeatingFieldDivOnCurrentPage(
        childFieldArgs,
        parentRepeatArgs
      );
    else childFieldElements = getAllFieldDivsOnCurrentPage(childFieldArgs);
    for (var i = 0, l = childFieldElements.length; i < l; i++) {
      addRepeatRow(childFieldArgs, childFieldElements[i].id);
      updateSingleLookupField(childFieldArgs, childFieldElements[i]);
    }
  }
  function getRepeatingFieldDivOnCurrentPage(childFieldArgs, parentRepeatArgs) {
    var childFieldDivs = [],
      selector = "frm_field_" + childFieldArgs.fieldId + "-";
    selector +=
      parentRepeatArgs.repeatingSection +
      "-" +
      parentRepeatArgs.repeatRow +
      "_container";
    var container = document.getElementById(selector);
    if (container !== null) childFieldDivs.push(container);
    return childFieldDivs;
  }
  function updateWatchingFieldValue(childFieldArgs, parentRepeatArgs) {
    var childFieldElements = getAllTextFieldInputs(
      childFieldArgs,
      parentRepeatArgs
    );
    for (var i = 0, l = childFieldElements.length; i < l; i++) {
      addRepeatRowForInput(childFieldElements[i].name, childFieldArgs);
      updateSingleWatchingField(childFieldArgs, childFieldElements[i]);
    }
  }
  function getLookupArgsForSingleField(fieldId) {
    if (
      typeof __FRMLOOKUP === "undefined" ||
      typeof __FRMLOOKUP[fieldId] === "undefined"
    )
      return false;
    return __FRMLOOKUP[fieldId];
  }
  function updateSingleLookupField(childFieldArgs, childElement) {
    childFieldArgs.parentVals = getParentLookupFieldVals(childFieldArgs);
    if (childFieldArgs.inputType === "select")
      maybeReplaceSelectLookupFieldOptions(childFieldArgs, childElement);
    else if (
      childFieldArgs.inputType === "radio" ||
      childFieldArgs.inputType === "checkbox"
    )
      maybeReplaceCbRadioLookupOptions(childFieldArgs, childElement);
    else if (childFieldArgs.inputType === "data")
      maybeReplaceLookupList(childFieldArgs, childElement);
  }
  function updateSingleWatchingField(childFieldArgs, childElement) {
    childFieldArgs.parentVals = getParentLookupFieldVals(childFieldArgs);
    if (currentLookupHasQueue(childElement.id)) {
      addLookupToQueueOfTwo(childFieldArgs, childElement);
      return;
    }
    addLookupToQueueOfTwo(childFieldArgs, childElement);
    maybeInsertValueInFieldWatchingLookup(childFieldArgs, childElement);
  }
  function getAllTextFieldInputs(childFieldArgs, parentRepeatArgs) {
    var selector = "field_" + childFieldArgs.fieldKey;
    if (childFieldArgs.isRepeating)
      if (parentRepeatArgs.repeatingSection !== "")
        selector = '[id="' + selector + "-" + parentRepeatArgs.repeatRow + '"]';
      else selector = '[id^="' + selector + '-"]';
    else selector = '[id="' + selector + '"]';
    return document.querySelectorAll(selector);
  }
  function maybeSetWatchingFieldValue(input) {
    var fieldId = frmFrontForm.getFieldId(input, false),
      childFieldArgs = getLookupArgsForSingleField(fieldId);
    if (childFieldArgs === false || childFieldArgs.fieldType === "lookup")
      return;
    updateSingleWatchingField(childFieldArgs, input, "value changed");
  }
  function getAllFieldDivsOnCurrentPage(childFieldArgs) {
    var childFieldDivs = [];
    if (childFieldArgs.isRepeating)
      childFieldDivs = document.querySelectorAll(
        ".frm_field_" + childFieldArgs.fieldId + "_container"
      );
    else {
      var container = document.getElementById(
        "frm_field_" + childFieldArgs.fieldId + "_container"
      );
      if (container !== null) childFieldDivs.push(container);
    }
    return childFieldDivs;
  }
  function getParentLookupFieldVals(childFieldArgs) {
    var parentFieldArgs,
      parentVals = [],
      parentIds = childFieldArgs.parents,
      parentValue = false;
    for (var i = 0, l = parentIds.length; i < l; i++) {
      parentFieldArgs = getLookupArgsForSingleField(parentIds[i]);
      parentValue = getFieldValue(parentFieldArgs, childFieldArgs);
      if (parentValue === "" || parentValue === false) {
        parentVals = false;
        break;
      }
      parentVals[i] = parentValue;
    }
    return parentVals;
  }
  function getValueFromRadioInputs(radioInputs) {
    var radioValue = false,
      l = radioInputs.length;
    for (var i = 0; i < l; i++)
      if (radioInputs[i].type === "hidden" || radioInputs[i].checked) {
        radioValue = radioInputs[i].value;
        break;
      }
    return radioValue;
  }
  function maybeReplaceSelectLookupFieldOptions(childFieldArgs, childDiv) {
    var childSelect = childDiv.getElementsByTagName("SELECT")[0];
    if (childSelect === null) return;
    var currentValue = childSelect.value;
    if (childFieldArgs.parentVals === false) {
      childSelect.options.length = 1;
      childSelect.value = "";
      maybeUpdateChosenOptions(childSelect);
      if (currentValue !== "")
        triggerChange(jQuery(childSelect), childFieldArgs.fieldKey);
    } else {
      disableLookup(childSelect);
      disableFormPreLookup(childFieldArgs.formId);
      getLookupValues(childFieldArgs, function (newOptions) {
        replaceSelectLookupFieldOptions(
          childFieldArgs,
          childSelect,
          newOptions
        );
        triggerLookupOptionsLoaded(jQuery(childDiv));
        enableFormAfterLookup(childFieldArgs.formId);
      });
    }
  }
  function maybeUpdateChosenOptions(childSelect) {
    if (childSelect.className.indexOf("frm_chzn") > -1 && jQuery().chosen)
      jQuery(childSelect).trigger("chosen:updated");
  }
  function disableLookup(childSelect) {
    childSelect.className = childSelect.className + " frm_loading_lookup";
    childSelect.disabled = true;
    maybeUpdateChosenOptions(childSelect);
  }
  function disableFormPreLookup(formId) {
    processesRunning++;
    if (processesRunning === 1) {
      var form = getFormById(formId);
      if (form !== null) frmFrontForm.showSubmitLoading(jQuery(form));
    }
  }
  function enableFormAfterLookup(formId) {
    var form;
    processesRunning--;
    if (processesRunning <= 0) {
      form = getFormById(formId);
      if (form !== null) removeSubmitLoading(form, formId, processesRunning);
    }
  }
  function getFormById(formId) {
    var form = document.querySelector(
      "#frm_form_" + formId + "_container form"
    );
    if (form === null) {
      form = document.getElementById("frm_form_" + formId + "_container");
      if (form !== null) form = form.closest("form");
    }
    return form;
  }
  function enableLookup(childSelect, isReadOnly) {
    if (isReadOnly === false) childSelect.disabled = false;
    childSelect.className = childSelect.className.replace(
      " frm_loading_lookup",
      ""
    );
  }
  function isMultiSelect(element) {
    return element.tagName.toLowerCase() === "select" && element.multiple;
  }
  function getSelectedOptions(element) {
    if (!isMultiSelect(element)) return element.value;
    var i,
      option,
      selectedOptions = [];
    for (i = 0; i < element.options.length; i++) {
      option = element.options[i];
      if (option.selected) selectedOptions.push(option.value);
    }
    return selectedOptions;
  }
  function setSelectedOptions(element, values) {
    var option;
    if (!isMultiSelect(element)) {
      element.value = values;
      return;
    }
    Array.from(element.options).forEach(function (option) {
      option.selected = false;
    });
    values.forEach(function (value) {
      option = element.querySelector('option[value="' + value + '"]');
      if (option) option.selected = true;
    });
  }
  function replaceSelectLookupFieldOptions(fieldArgs, childSelect, newOptions) {
    var origVal = getSelectedOptions(childSelect);
    for (var i = childSelect.options.length; i > 0; i--) childSelect.remove(i);
    var optsLength = newOptions.length;
    for (i = 0; i < optsLength; i++)
      childSelect.options[i + 1] = new Option(
        newOptions[i],
        newOptions[i],
        false,
        false
      );
    setSelectLookupVal(childSelect, origVal);
    enableLookup(childSelect, fieldArgs.isReadOnly);
    maybeUpdateChosenOptions(childSelect);
    if (getSelectedOptions(childSelect).toString() !== origVal.toString())
      triggerChange(jQuery(childSelect), fieldArgs.fieldKey);
  }
  function setSelectLookupVal(childSelect, origVal) {
    setSelectedOptions(childSelect, origVal);
    if (childSelect.value === "") {
      var defaultValue = childSelect.getAttribute("data-frmval");
      if (defaultValue !== null) childSelect.value = defaultValue;
    }
  }
  function maybeReplaceCbRadioLookupOptions(childFieldArgs, childDiv) {
    if (childFieldArgs.parentVals === false) {
      var inputs = childDiv.getElementsByTagName("input");
      maybeHideRadioLookup(childFieldArgs, childDiv);
      clearValueForInputs(inputs);
    } else replaceCbRadioLookupOptions(childFieldArgs, childDiv);
  }
  function replaceCbRadioLookupOptions(childFieldArgs, childDiv) {
    var optContainer, inputs, currentValue, defaultValue, form, data, success;
    optContainer = childDiv.getElementsByClassName("frm_opt_container")[0];
    inputs = optContainer.getElementsByTagName("input");
    currentValue = "";
    addLoadingIconJS(childDiv, optContainer);
    if (childFieldArgs.inputType == "radio")
      currentValue = getValueFromRadioInputs(inputs);
    else currentValue = getValuesFromCheckboxInputs(inputs);
    defaultValue = jQuery(inputs[0]).data("frmval");
    disableFormPreLookup(childFieldArgs.formId);
    form = getFormById(childFieldArgs.formId);
    data = {
      action: "frm_replace_cb_radio_lookup_options",
      parent_fields: childFieldArgs.parents,
      parent_vals: childFieldArgs.parentVals,
      field_id: childFieldArgs.fieldId,
      container_field_id: getContainerFieldId(childFieldArgs),
      row_index: childFieldArgs.repeatRow,
      current_value: currentValue,
      default_value: defaultValue,
      nonce: frm_js.nonce,
    };
    success = function (newHtml) {
      var input;
      optContainer.innerHTML = newHtml;
      removeLoadingIconJS(childDiv, optContainer);
      if (inputs.length == 1 && inputs[0].value === "")
        maybeHideRadioLookup(childFieldArgs, childDiv);
      else {
        maybeShowRadioLookup(childFieldArgs, childDiv);
        maybeSetDefaultCbRadioValue(childFieldArgs, inputs, defaultValue);
      }
      input = inputs[0];
      triggerChange(jQuery(input), childFieldArgs.fieldKey);
      triggerLookupOptionsLoaded(jQuery(childDiv));
      enableFormAfterLookup(childFieldArgs.formId);
    };
    postToAjaxUrl(form, data, success);
  }
  function maybeReplaceLookupList(childFieldArgs, childDiv) {
    var inputs = childDiv.getElementsByTagName("input"),
      content = inputs[0].previousElementSibling;
    if (childFieldArgs.parentVals === false) {
      maybeHideRadioLookup(childFieldArgs, childDiv);
      if (typeof content !== "undefined") content.innerHTML = "";
    } else
      getLookupValues(childFieldArgs, function (response) {
        content.innerHTML = response.join(", ");
        inputs[0].value = response;
        maybeShowRadioLookup(childFieldArgs, childDiv);
        triggerLookupOptionsLoaded(jQuery(childDiv));
      });
  }
  function getLookupValues(childFieldArgs, callback) {
    disableFormPreLookup(childFieldArgs.formId);
    postToAjaxUrl(
      getFormById(childFieldArgs.formId),
      {
        action: "frm_replace_lookup_field_options",
        parent_fields: childFieldArgs.parents,
        parent_vals: childFieldArgs.parentVals,
        field_id: childFieldArgs.fieldId,
        nonce: frm_js.nonce,
      },
      function (newOptions) {
        enableFormAfterLookup(childFieldArgs.formId);
        callback(newOptions);
      },
      false,
      { dataType: "json" }
    );
  }
  function triggerLookupOptionsLoaded($fieldDiv) {
    $fieldDiv.trigger("frmLookupOptionsLoaded");
  }
  function maybeSetDefaultCbRadioValue(childFieldArgs, inputs, defaultValue) {
    if (defaultValue === undefined) return;
    var currentValue = false;
    if (childFieldArgs.inputType === "radio")
      currentValue = getValueFromRadioInputs(inputs);
    else currentValue = getValuesFromCheckboxInputs(inputs);
    if (currentValue !== false || inputs.length < 1) return;
    var inputName = inputs[0].name;
    setCheckboxOrRadioDefaultValue(inputName, defaultValue);
  }
  function maybeHideRadioLookup(childFieldArgs, childDiv) {
    if (isFieldConditionallyHidden(childDiv.id, childFieldArgs.formId)) return;
    hideFieldContainer(childDiv.id);
    addToHideFields(childDiv.id, childFieldArgs.formId);
  }
  function maybeShowRadioLookup(childFieldArgs, childDiv) {
    if (isFieldCurrentlyShown(childDiv.id, childFieldArgs.formId)) return;
    var logicArgs = getRulesForSingleField(childFieldArgs.fieldId);
    if (logicArgs === false || logicArgs.conditions.length < 1) {
      removeFromHideFields(childDiv.id, childFieldArgs.formId);
      showFieldContainer(childDiv.id);
    } else {
      logicArgs.containerId = childDiv.id;
      logicArgs.repeatRow = childFieldArgs.repeatRow;
      hideOrShowSingleField(logicArgs);
    }
  }
  function maybeInsertValueInFieldWatchingLookup(childFieldArgs, childInput) {
    if (isChildInputConditionallyHidden(childInput, childFieldArgs.formId)) {
      checkQueueAfterLookupCompleted(childInput.id);
      return;
    }
    if (childFieldArgs.parentVals === false) {
      var newValue = childInput.getAttribute("data-frmval");
      if (newValue === null) newValue = "";
      insertValueInFieldWatchingLookup(childFieldArgs, childInput, newValue);
      checkQueueAfterLookupCompleted(childInput.id);
    } else {
      disableFormPreLookup(childFieldArgs.formId);
      postToAjaxUrl(
        getFormById(childFieldArgs.formId),
        {
          action: "frm_get_lookup_text_value",
          parent_fields: childFieldArgs.parents,
          parent_vals: childFieldArgs.parentVals,
          field_id: childFieldArgs.fieldId,
          nonce: frm_js.nonce,
        },
        function (newValue) {
          if (
            !isChildInputConditionallyHidden(
              childInput,
              childFieldArgs.formId
            ) &&
            childInput.value != newValue
          )
            insertValueInFieldWatchingLookup(
              childFieldArgs.fieldKey,
              childInput,
              newValue
            );
          enableFormAfterLookup(childFieldArgs.formId);
          checkQueueAfterLookupCompleted(childInput.id);
        }
      );
    }
  }
  function currentLookupHasQueue(elementId) {
    return elementId in lookupQueues && lookupQueues[elementId].length > 0;
  }
  function addLookupToQueueOfTwo(childFieldArgs, childInput) {
    var elementId = childInput.id;
    if (elementId in lookupQueues) {
      if (lookupQueues[elementId].length >= 2)
        lookupQueues[elementId] = lookupQueues[elementId].slice(0, 1);
    } else lookupQueues[elementId] = [];
    lookupQueues[elementId].push({
      childFieldArgs: childFieldArgs,
      childInput: childInput,
    });
  }
  function checkQueueAfterLookupCompleted(elementId) {
    removeLookupFromQueue(elementId);
    doNextItemInLookupQueue(elementId);
  }
  function removeLookupFromQueue(elementId) {
    lookupQueues[elementId].shift();
  }
  function doNextItemInLookupQueue(elementId) {
    if (currentLookupHasQueue(elementId)) {
      var childFieldArgs = lookupQueues[elementId][0].childFieldArgs,
        childInput = lookupQueues[elementId][0].childInput;
      maybeInsertValueInFieldWatchingLookup(childFieldArgs, childInput);
    }
  }
  function decodeEntities(string) {
    var decoded = string
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    return decoded;
  }
  function insertValueInFieldWatchingLookup(fieldKey, childInput, newValue) {
    childInput.value = decodeEntities(newValue);
    triggerChange(jQuery(childInput), fieldKey);
  }
  function addRepeatRowForInput(fieldName, childFieldArgs) {
    var repeatArgs = getRepeatArgsFromFieldName(fieldName);
    if (repeatArgs.repeatRow !== "")
      childFieldArgs.repeatRow = repeatArgs.repeatRow;
    else childFieldArgs.repeatRow = "";
  }
  function updateDynamicField(depFieldArgs, onCurrentPage) {
    var depFieldArgsCopy = cloneObjectForDynamicFields(depFieldArgs);
    if (depFieldArgsCopy.inputType === "data")
      updateDynamicListData(depFieldArgsCopy, onCurrentPage);
    else if (onCurrentPage) updateDynamicFieldOptions(depFieldArgsCopy);
  }
  function cloneObjectForDynamicFields(depFieldArgs) {
    var dataLogic = {
      actualValue: depFieldArgs.dataLogic.actualValue,
      fieldId: depFieldArgs.dataLogic.fieldId,
    };
    var dynamicFieldArgs = {
      fieldId: depFieldArgs.fieldId,
      fieldKey: depFieldArgs.fieldKey,
      formId: depFieldArgs.formId,
      containerId: depFieldArgs.containerId,
      repeatRow: depFieldArgs.repeatRow,
      dataLogic: dataLogic,
      children: "",
      inputType: depFieldArgs.inputType,
    };
    return dynamicFieldArgs;
  }
  pendingDynamicFieldAjax = [];
  function updateDynamicListData(depFieldArgs, onCurrentPage) {
    var $fieldDiv;
    if (onCurrentPage) {
      $fieldDiv = jQuery("#" + depFieldArgs.containerId);
      addLoadingIcon($fieldDiv);
    }
    pendingDynamicFieldAjax.push({
      args: { depFieldArgs: depFieldArgs, onCurrentPage: onCurrentPage },
      data: {
        entry_id: depFieldArgs.dataLogic.actualValue,
        current_field: depFieldArgs.fieldId,
        hide_id: depFieldArgs.containerId,
        on_current_page: onCurrentPage,
        nonce: frm_js.nonce,
      },
    });
  }
  function updateDynamicFieldOptions(depFieldArgs) {
    var $fieldDiv = jQuery("#" + depFieldArgs.containerId),
      $fieldInputs = $fieldDiv.find(
        'select[name^="item_meta"], input[name^="item_meta"]'
      ),
      prevValue = getFieldValueFromInputs($fieldInputs),
      defaultVal = $fieldInputs.data("frmval"),
      editingEntry = $fieldDiv.closest("form").find('input[name="id"]').val();
    addLoadingIcon($fieldDiv);
    postToAjaxUrl(
      getFormById(depFieldArgs.formId),
      {
        action: "frm_fields_ajax_data_options",
        trigger_field_id: depFieldArgs.dataLogic.fieldId,
        entry_id: depFieldArgs.dataLogic.actualValue,
        field_id: depFieldArgs.fieldId,
        default_value: defaultVal,
        container_id: depFieldArgs.containerId,
        editing_entry: editingEntry,
        prev_val: prevValue,
        nonce: frm_js.nonce,
      },
      function (html) {
        var $optContainer = $fieldDiv.find(
          ".frm_opt_container, .frm_data_container"
        );
        $optContainer.php(html);
        var $dynamicFieldInputs = $optContainer.find(
          'select, input[type="checkbox"], input[type="radio"]'
        );
        removeLoadingIcon($optContainer);
        if (html === "" || $dynamicFieldInputs.length < 1)
          hideDynamicField(depFieldArgs);
        else {
          var valueChanged = dynamicFieldValueChanged(
            depFieldArgs,
            $dynamicFieldInputs,
            prevValue
          );
          showDynamicField(
            depFieldArgs,
            $fieldDiv,
            $dynamicFieldInputs,
            valueChanged
          );
        }
      }
    );
  }
  function dynamicFieldValueChanged(
    depFieldArgs,
    $dynamicFieldInputs,
    prevValue
  ) {
    var newValue = getFieldValueFromInputs($dynamicFieldInputs);
    return prevValue !== newValue;
  }
  function updateHiddenDynamicListField(depFieldArgs, newValue) {
    var inputId = "field_" + depFieldArgs.fieldKey;
    if (depFieldArgs.repeatRow !== "") inputId += "-" + depFieldArgs.repeatRow;
    var listInput = document.getElementById(inputId);
    if (listInput === null) return;
    listInput.value = newValue;
    if (
      isFieldConditionallyHidden(depFieldArgs.containerId, depFieldArgs.formId)
    )
      removeFromHideFields(depFieldArgs.containerId, depFieldArgs.formId);
    triggerChange(jQuery(listInput));
  }
  function addLoadingIcon($fieldDiv) {
    var currentHTML = $fieldDiv.php();
    if (currentHTML.indexOf("frm-loading-img") > -1);
    else {
      var loadingIcon = '<span class="frm-loading-img"></span>';
      $fieldDiv.php(currentHTML + loadingIcon);
      var $optContainer = $fieldDiv.find(
        ".frm_opt_container, .frm_data_container"
      );
      $optContainer.hide();
    }
  }
  function addLoadingIconJS(fieldDiv, optContainer) {
    var currentHTML = fieldDiv.innerHTML;
    if (currentHTML.indexOf("frm-loading-img") > -1);
    else {
      optContainer.classList.add("frm_hidden");
      var loadingIcon = document.createElement("span");
      loadingIcon.setAttribute("class", "frm-loading-img");
      fieldDiv.insertBefore(loadingIcon, optContainer.nextSibling);
    }
  }
  function removeLoadingIcon($optContainer) {
    $optContainer.parent().children(".frm-loading-img").remove();
    $optContainer.show();
  }
  function removeLoadingIconJS(fieldDiv, optContainer) {
    var loadingIcon = fieldDiv.getElementsByClassName("frm-loading-img")[0];
    if (loadingIcon !== null && loadingIcon !== undefined)
      loadingIcon.parentNode.removeChild(loadingIcon);
    optContainer.classList.remove("frm_hidden");
  }
  function getFieldValueFromInputs($inputs) {
    var fieldValue = [],
      currentValue = "";
    $inputs.each(function () {
      currentValue = this.value;
      if (this.type === "radio" || this.type === "checkbox") {
        if (this.checked === true) fieldValue.push(currentValue);
      } else if (currentValue !== "") fieldValue.push(currentValue);
    });
    if (fieldValue.length === 0) fieldValue = "";
    return fieldValue;
  }
  function hideDynamicField(depFieldArgs) {
    hideFieldAndClearValue(depFieldArgs, true);
  }
  function showDynamicField(
    depFieldArgs,
    $fieldDiv,
    $fieldInputs,
    valueChanged
  ) {
    if (
      isFieldConditionallyHidden(depFieldArgs.containerId, depFieldArgs.formId)
    ) {
      removeFromHideFields(depFieldArgs.containerId, depFieldArgs.formId);
      $fieldDiv.show();
    }
    if (
      $fieldInputs.hasClass("frm_chzn") ||
      $fieldInputs.hasClass("frm_slimselect")
    )
      loadAutocomplete();
    if (valueChanged === true) triggerChange($fieldInputs);
  }
  function triggerCalc() {
    if (typeof __FRMCALC === "undefined") return;
    var triggers = __FRMCALC.triggers;
    if (triggers)
      jQuery(triggers.join()).trigger({ type: "change", selfTriggered: true });
    triggerCalcWithoutFields();
  }
  function triggerCalcWithoutFields() {
    var calcs = __FRMCALC.calc,
      vals = [];
    for (var fieldKey in calcs)
      if (calcs[fieldKey].fields.length < 1) {
        var totalField = document.getElementById("field_" + fieldKey);
        if (
          totalField !== null &&
          !isChildInputConditionallyHidden(totalField, calcs[fieldKey].form_id)
        )
          doSingleCalculation(__FRMCALC, fieldKey, vals);
      }
  }
  function doCalculation(fieldId, triggerField) {
    if (typeof __FRMCALC === "undefined") return;
    var allCalcs = __FRMCALC,
      calc = allCalcs.fields[fieldId],
      vals = [];
    if (typeof calc === "undefined") return;
    var keys = calc.total;
    var len = keys.length;
    var pages = getStartEndPage(allCalcs.calc[keys[0]]);
    for (var i = 0, l = len; i < l; i++) {
      var totalOnPage = isTotalFieldOnPage(allCalcs.calc[keys[i]], pages);
      if (
        totalOnPage &&
        isTotalFieldConditionallyHidden(
          allCalcs.calc[keys[i]],
          triggerField.attr("name")
        ) === false
      )
        doSingleCalculation(allCalcs, keys[i], vals, triggerField);
    }
  }
  function getStartEndPage(thisField) {
    var formId = thisField.form_id,
      formContainer = document.getElementById(
        "frm_form_" + formId + "_container"
      );
    if (formContainer === null && thisField.in_section) {
      var fieldContainer = document.getElementById(
        "frm_field_" + thisField.in_section + "_container"
      );
      if (fieldContainer === null) return [];
      formContainer = closest(fieldContainer, function (el) {
        return el.tagName === "FORM";
      });
      formId = formContainer.elements.namedItem("form_id").value;
    }
    var hasPreviousPage = formContainer.getElementsByClassName("frm_next_page");
    var hasAnotherPage = document.getElementById("frm_page_order_" + formId);
    var pages = [];
    if (hasPreviousPage.length > 0) pages.start = hasPreviousPage[0];
    if (hasAnotherPage !== null) pages.end = hasAnotherPage;
    return pages;
  }
  function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  }
  function isTotalFieldOnPage(calcDetails, pages) {
    if (
      typeof pages.start !== "undefined" ||
      typeof pages.end !== "undefined"
    ) {
      var hiddenTotalField = jQuery(
        'input[type=hidden][name*="[' + calcDetails.field_id + ']"]'
      );
      if (hiddenTotalField.length)
        return isHiddenTotalOnPage(hiddenTotalField, pages);
    }
    return true;
  }
  function isHiddenTotalOnPage(hiddenTotalField, pages) {
    var onPage,
      hiddenParent = hiddenTotalField.closest(".frm_form_field");
    if (hiddenParent.length) return true;
    var totalPos = hiddenTotalField.index();
    var isAfterStart = true;
    var isBeforeEnd = true;
    if (typeof pages.start !== "undefined")
      isAfterStart = jQuery(pages.start).index() < totalPos;
    if (typeof pages.end !== "undefined")
      isBeforeEnd = jQuery(pages.end).index() > totalPos;
    onPage = isAfterStart && isBeforeEnd;
    if (!onPage)
      onPage = hiddenTotalField.closest(".do-calculation").length > 0;
    return onPage;
  }
  function isTotalFieldConditionallyHidden(calcDetails, triggerFieldName) {
    var hidden = false,
      fieldId = calcDetails.field_id,
      formId = calcDetails.form_id,
      hiddenFields = getHiddenFields(formId);
    if (hiddenFields.length < 1) return hidden;
    if (calcDetails.inSection === "0" && calcDetails.inEmbedForm === "0")
      hidden = isNonRepeatingFieldConditionallyHidden(fieldId, hiddenFields);
    else {
      var repeatArgs = getRepeatArgsFromFieldName(triggerFieldName);
      if (isNonRepeatingFieldConditionallyHidden(fieldId, hiddenFields))
        hidden = true;
      else if (
        isRepeatingFieldConditionallyHidden(fieldId, repeatArgs, hiddenFields)
      )
        hidden = true;
      else if (calcDetails.inSection !== "0" && calcDetails.inEmbedForm !== "0")
        hidden = isRepeatingFieldConditionallyHidden(
          calcDetails.inSection,
          repeatArgs,
          hiddenFields
        );
      else if (calcDetails.inSection !== "0")
        hidden = isNonRepeatingFieldConditionallyHidden(
          calcDetails.inSection,
          hiddenFields
        );
      else if (calcDetails.inEmbedForm !== "0")
        hidden = isNonRepeatingFieldConditionallyHidden(
          calcDetails.inEmbedForm,
          hiddenFields
        );
    }
    return hidden;
  }
  function isNonRepeatingFieldConditionallyHidden(fieldId, hiddenFields) {
    var htmlID = "frm_field_" + fieldId + "_container";
    return hiddenFields.indexOf(htmlID) > -1;
  }
  function isRepeatingFieldConditionallyHidden(
    fieldId,
    repeatArgs,
    hiddenFields
  ) {
    var hidden = false;
    if (repeatArgs.repeatingSection) {
      var fieldRepeatId =
        "frm_field_" + fieldId + "-" + repeatArgs.repeatingSection;
      fieldRepeatId += "-" + repeatArgs.repeatRow + "_container";
      hidden = hiddenFields.indexOf(fieldRepeatId) > -1;
    }
    return hidden;
  }
  function maybeShowCalculationsErrorAlert(err, fieldKey, thisFullCalc) {
    var alertMessage = "";
    if (!jQuery("form").hasClass("frm-admin-viewing")) return;
    alertMessage += frm_js.calc_error + " " + fieldKey + ":\n\n";
    alertMessage += thisFullCalc + "\n\n";
    if (err.message) alertMessage += err.message + "\n\n";
    alert(alertMessage);
  }
  function treatAsUTC(date) {
    var copy = new Date(date.valueOf());
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
    return copy;
  }
  function normalizeDate(date) {
    switch (typeof date) {
      case "number":
        return new Date(date * 864e5);
      case "string":
        return new Date(date);
      default:
        return date;
    }
  }
  function calculateDateDifference(a, b, format) {
    a = normalizeDate(a);
    b = normalizeDate(b);
    switch (format) {
      case "days": {
        return Math.floor((treatAsUTC(b) - treatAsUTC(a)) / 864e5);
      }
      case "years":
      default: {
        var years = b.getFullYear() - a.getFullYear();
        if (
          b.getMonth() < a.getMonth() ||
          (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())
        )
          years--;
        return years;
      }
    }
  }
  function doSingleCalculation(allCalcs, fieldKey, vals, triggerField) {
    var currency,
      total,
      dec,
      updatedTotal,
      thisCalc = allCalcs.calc[fieldKey],
      thisFullCalc = thisCalc.calc,
      totalField = jQuery(document.getElementById("field_" + fieldKey)),
      fieldInfo = {
        triggerField: triggerField,
        inSection: false,
        thisFieldCall: 'input[id^="field_' + fieldKey + '-"]',
      };
    if (totalField.attr("type") === "range") return;
    if (totalField.length < 1 && typeof triggerField !== "undefined") {
      fieldInfo.inSection = true;
      fieldInfo.thisFieldId = objectSearch(allCalcs.fieldsWithCalc, fieldKey);
      totalField = getSiblingField(fieldInfo);
    }
    if (totalField === null || totalField.length < 1) return;
    thisFullCalc = getValsForSingleCalc(
      thisCalc,
      thisFullCalc,
      allCalcs,
      vals,
      fieldInfo
    );
    total = "";
    dec = "";
    if ("function" === typeof window["frmProGetCalcTotal" + thisCalc.calc_type])
      total = window["frmProGetCalcTotal" + thisCalc.calc_type].call(
        thisCalc,
        thisFullCalc
      );
    else if (thisCalc.calc_type === "text") total = thisFullCalc;
    else {
      dec = thisCalc.calc_dec;
      if (thisFullCalc.indexOf(").toFixed(") > -1) {
        var calcParts = thisFullCalc.split(").toFixed(");
        if (isNumeric(calcParts[1])) {
          dec = calcParts[1];
          thisFullCalc = thisFullCalc.replace(").toFixed(" + dec, "");
        }
      }
      thisFullCalc = trimNumericCalculation(thisFullCalc);
      if (thisFullCalc !== "")
        try {
          total = parseFloat(eval(thisFullCalc));
        } catch (err) {
          maybeShowCalculationsErrorAlert(err, fieldKey, thisFullCalc);
        }
      if (typeof total === "undefined" || isNaN(total)) total = 0;
      if (isNumeric(dec) && total !== "") total = total.toFixed(dec);
    }
    if (thisCalc.is_currency === true && isNumeric(total)) {
      currency = getCurrencyFromCalcRule(thisCalc);
      if (currency.decimals > 0) {
        total = Math.round10(total, currency.decimals);
        total = maybeAddTrailingZeroToPrice(total, currency);
        dec = currency.decimals;
      }
    }
    if (totalField.val() === total) {
      setDisplayedTotal(totalField, total, currency);
      return;
    }
    updatedTotal = false;
    if (
      (isNumeric(dec) || thisCalc.is_currency) &&
      ["number", "text"].indexOf(totalField.attr("type")) > -1
    ) {
      if (
        total.toString().slice(-1) == "0" &&
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1
      )
        totalField[0].setAttribute("type", "text");
      if (
        totalField.parent().is(".frm_input_group.frm_with_box.frm_hidden") &&
        "string" === typeof total
      ) {
        updatedTotal = true;
        totalField.val(total.replace(",", "."));
      }
    }
    if (!updatedTotal) totalField.val(total);
    triggerEvent(document, "frmCalcUpdatedTotal", {
      totalField: totalField,
      total: total,
    });
    if (
      triggerField === null ||
      typeof triggerField === "undefined" ||
      totalField.attr("name") != triggerField.attr("name")
    )
      triggerChange(totalField, fieldKey);
    setDisplayedTotal(totalField, total, currency);
  }
  function setDisplayedTotal(totalField, total, currency) {
    var prepend,
      append,
      showTotal = totalField.parent().prev();
    if (!showTotal.hasClass("frm_total_formatted")) return;
    prepend = showTotal.data("prepend");
    append = showTotal.data("append");
    if (typeof prepend === "undefined") prepend = "";
    if (typeof append === "undefined") append = "";
    if (typeof currency === "object") {
      total = formatCurrency(total, currency);
      if (currency.symbol_left === prepend) prepend = "";
      if (currency.symbol_right === append) append = "";
    }
    if (prepend !== "")
      prepend = '<span class="frm_inline_pre">' + prepend + "</span>";
    if (append !== "")
      append = '<span class="frm_inline_pre">' + append + "</span>";
    showTotal.php(
      prepend + '<span class="frm_inline_total">' + total + "</span>" + append
    );
  }
  function getValsForSingleCalc(
    thisCalc,
    thisFullCalc,
    allCalcs,
    vals,
    fieldInfo
  ) {
    var fCount, f, field, date, findVar;
    fCount = thisCalc.fields.length;
    for (f = 0; f < fCount; f++) {
      field = {
        triggerField: fieldInfo.triggerField,
        thisFieldId: thisCalc.fields[f],
        inSection: fieldInfo.inSection,
        valKey: fieldInfo.inSection + "" + thisCalc.fields[f],
        thisField: allCalcs.fields[thisCalc.fields[f]],
        thisFieldCall: "input" + allCalcs.fieldKeys[thisCalc.fields[f]],
        formID: thisCalc.form_id,
      };
      field = getCallForField(field, allCalcs);
      if (!thisCalc.calc_type) {
        field.valKey = "num" + field.valKey;
        vals = getCalcFieldId(field, allCalcs, vals);
        if (
          typeof vals[field.valKey] === "undefined" ||
          isNaN(vals[field.valKey])
        ) {
          vals[field.valKey] = 0;
          if (field.thisField.type === "date") {
            date = tryToGetDateValue(field);
            if (null !== date)
              vals[field.valKey] = Math.floor(date.getTime() / 864e5);
            else thisFullCalc = "";
          }
        } else if (
          0 === vals[field.valKey] &&
          field.thisField.type === "date" &&
          dateValueShouldBeClearedForDateCalculation(field, fieldInfo)
        )
          thisFullCalc = "";
      } else {
        field.valKey = "text" + field.valKey;
        vals = getTextCalcFieldId(field, vals);
        if (typeof vals[field.valKey] === "undefined") vals[field.valKey] = "";
      }
      if (thisCalc.calc_type === "text")
        thisFullCalc = replaceShortcodesWithShowOptions(
          thisFullCalc,
          vals,
          field
        );
      findVar = "[" + field.thisFieldId + "]";
      findVar = findVar.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      thisFullCalc = thisFullCalc.replace(
        new RegExp(findVar, "g"),
        vals[field.valKey]
      );
    }
    return thisFullCalc;
  }
  function replaceShortcodesWithShowOptions(fullCalc, vals, field) {
    fullCalc = replaceShowShortcode(
      fullCalc,
      vals,
      field,
      "label",
      function () {
        return getOptionLabelsFromValues(vals[field.valKey], field);
      }
    );
    Array.prototype.forEach.call(
      ["first", "middle", "last"],
      function (nameFieldPart) {
        fullCalc = replaceNameShortcode(fullCalc, vals, field, nameFieldPart);
      }
    );
    return fullCalc;
  }
  function replaceNameShortcode(fullCalc, vals, field, show) {
    var valueCallback = function () {
      var match = false;
      document.querySelectorAll(field.thisFieldCall).forEach(function (input) {
        if (show === input.id.substr(-show.length)) match = input;
      });
      return match ? match.value : "";
    };
    return replaceShowShortcode(fullCalc, vals, field, show, valueCallback);
  }
  function replaceShowShortcode(fullCalc, vals, field, show, valueCallback) {
    var findVar;
    findVar = "[" + field.thisFieldId + " show=" + show + "]";
    if (-1 === fullCalc.indexOf(findVar)) return fullCalc;
    vals[field.valKey + show] = valueCallback();
    findVar = findVar.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    fullCalc = fullCalc.replace(
      new RegExp(findVar, "g"),
      vals[field.valKey + show]
    );
    return fullCalc;
  }
  function tryToGetDateValue(field) {
    var $element = jQuery(field.thisField.key);
    return $element.hasClass("hasDatepicker")
      ? $element.datepicker("getDate")
      : null;
  }
  function dateValueShouldBeClearedForDateCalculation(field, fieldInfo) {
    if (fieldInfo.triggerField !== null) {
      if (fieldInfo.triggerField.is("input")) {
        if (
          datepickerFieldShouldBeClearedForDateCalculation(
            fieldInfo.triggerField
          )
        )
          return fieldShouldBeClearedForDateCalculation(
            field.thisFieldCall,
            field.thisField.key
          );
        return "" === fieldInfo.triggerField.val();
      }
      return (
        fieldInfo.triggerField.is("div") &&
        fieldInfo.triggerField.end().is("input") &&
        "" === fieldInfo.triggerField.end().val()
      );
    } else if (
      fieldShouldBeClearedForDateCalculation(
        field.thisFieldCall,
        field.thisField.key
      )
    )
      return true;
    return false;
  }
  function datepickerFieldShouldBeClearedForDateCalculation(field) {
    var dateValue = field.hasClass("hasDatepicker")
      ? field.datepicker("getDate")
      : null;
    return null !== dateValue && -72e6 !== dateValue.getTime();
  }
  function fieldShouldBeClearedForDateCalculation(fieldCall, fieldKey) {
    return (
      0 === fieldCall.indexOf("input") &&
      0 === fieldKey.indexOf("[id=") &&
      "" === jQuery(fieldKey).val()
    );
  }
  function getOptionLabelsFromValues(value, field) {
    var fieldId, options, split, labels, length, index;
    fieldId = field.thisFieldId;
    if (
      "undefined" === typeof __FRMCALC.options ||
      "undefined" === typeof __FRMCALC.options[fieldId]
    )
      return value;
    options = __FRMCALC.options[fieldId];
    if ("checkbox" === field.thisField.type) {
      split = value.split(", ");
      labels = [];
      length = split.length;
      for (index = 0; index < length; ++index)
        if ("undefined" !== typeof options[split[index]])
          labels.push(options[split[index]]);
      return labels.join(", ");
    }
    return "undefined" !== typeof options[value] ? options[value] : "";
  }
  function trimNumericCalculation(numericCalc) {
    var lastChar = numericCalc.charAt(numericCalc.length - 1);
    if (lastChar === "+" || lastChar === "-")
      numericCalc = numericCalc.substr(0, numericCalc.length - 1);
    return numericCalc;
  }
  function getCallForField(field, allCalcs) {
    if (
      field.thisField.type === "checkbox" ||
      field.thisField.type === "radio" ||
      field.thisField.type === "scale" ||
      field.thisField.type === "star"
    )
      field.thisFieldCall =
        field.thisFieldCall +
        ":checked," +
        field.thisFieldCall +
        "[type=hidden]";
    else if (
      field.thisField.type === "select" ||
      field.thisField.type === "time"
    )
      field.thisFieldCall =
        "select" +
        allCalcs.fieldKeys[field.thisFieldId] +
        " option:selected," +
        field.thisFieldCall +
        "[type=hidden]";
    else if (field.thisField.type === "textarea")
      field.thisFieldCall =
        field.thisFieldCall +
        ",textarea" +
        allCalcs.fieldKeys[field.thisFieldId];
    return field;
  }
  function maybeDoCalcForSingleField(fieldInput) {
    if (typeof __FRMCALC === "undefined") return;
    if (!fieldCanDoCalc(fieldInput.type)) return;
    var allCalcs = __FRMCALC,
      fieldKey = getFieldKey(fieldInput.id, fieldInput.name),
      triggerField = maybeGetTriggerField(fieldInput),
      vals = [];
    if (allCalcs.calc[fieldKey] === undefined) return;
    doSingleCalculation(allCalcs, fieldKey, vals, triggerField);
  }
  function fieldCanDoCalc(fieldType) {
    return -1 !== ["text", "hidden", "number", "textarea"].indexOf(fieldType);
  }
  function getFieldKey(fieldHtmlId, fieldName) {
    var fieldKey = fieldHtmlId.replace("field_", ""),
      newFieldKey = "";
    if (isRepeatingFieldByName(fieldName)) {
      var fieldKeyParts = fieldKey.split("-");
      for (var i = 0; i < fieldKeyParts.length - 1; i++)
        if (newFieldKey === "") newFieldKey = fieldKeyParts[i];
        else newFieldKey = newFieldKey + "-" + fieldKeyParts[i];
      fieldKey = newFieldKey;
    }
    return fieldKey;
  }
  function maybeGetTriggerField(fieldInput) {
    var triggerField = null;
    if (isRepeatingFieldByName(fieldInput.name))
      if (fieldInput.type !== "hidden")
        triggerField = jQuery(fieldInput).closest(".frm_form_field");
      else triggerField = jQuery(fieldInput);
    return triggerField;
  }
  function isRepeatingFieldByName(fieldName) {
    var fieldNameParts = fieldName.split("][");
    return fieldNameParts.length >= 3;
  }
  function getCalcFieldId(field, allCalcs, vals) {
    if (typeof vals[field.valKey] !== "undefined" && vals[field.valKey] !== 0)
      return vals;
    vals[field.valKey] = 0;
    var currency,
      calcField = getCalcField(field);
    if (calcField === false) return vals;
    calcField.each(function () {
      var thisVal = getOptionValue(field.thisField, this);
      if (field.thisField.type === "date") {
        var d = getDateFieldValue(allCalcs.date, thisVal);
        if (d !== null)
          vals[field.valKey] = Math.ceil(d / (1e3 * 60 * 60 * 24));
      } else if ("data" === field.thisField.type) {
        vals[field.valKey] = 0;
        if ("" !== thisVal)
          if ("SELECT" === this.tagName)
            vals[field.valKey] = parseFloat(
              this.querySelector('option[value="' + thisVal + '"]').textContent
            );
          else if (null !== this.closest(".frm_checkbox")) {
            vals[field.valKey] = 0;
            jQuery(
              this.closest(".frm_opt_container").querySelectorAll(
                "input:checked"
              )
            ).each(function () {
              vals[field.valKey] += parseFloat(this.parentNode.textContent);
            });
          } else vals[field.valKey] = parseFloat(this.parentNode.textContent);
      } else if (
        this.hasAttribute("data-frmprice") ||
        field.thisField.type === "total"
      ) {
        currency = getCurrency(field.formID);
        vals[field.valKey] += parseFloat(
          !currency ? thisVal : preparePrice(thisVal, currency)
        );
      } else {
        var n = thisVal;
        if (n !== "" && n !== 0) {
          n = n.trim();
          n = parseFloat(n.replace(/,/g, "").match(/-?[\d\.e]+$/));
        }
        if (typeof n === "undefined" || isNaN(n) || n === "") n = 0;
        vals[field.valKey] += n;
      }
    });
    return vals;
  }
  function getTextCalcFieldId(field, vals) {
    if (typeof vals[field.valKey] !== "undefined" && vals[field.valKey] !== "")
      return vals;
    vals[field.valKey] = "";
    var calcField = getCalcField(field);
    if (calcField === false) return vals;
    var count = 0;
    var sep = "";
    calcField.each(function () {
      var thisVal = getOptionValue(field.thisField, this);
      thisVal = thisVal.trim();
      sep = getCalcSep(field, count);
      if (thisVal !== "") {
        vals[field.valKey] += sep + thisVal;
        count++;
      }
    });
    return vals;
  }
  function getCalcSep(field, count) {
    var sep = "";
    if (count > 0) {
      if (field.thisField.type === "time")
        if (count == 1) sep = ":";
        else {
          if (count == 2) sep = " ";
        }
      else sep = ", ";
      var customSep = jQuery(document).triggerHandler("frmCalSeparation", [
        field.thisField,
        count,
      ]);
      if (typeof customSep !== "undefined") sep = customSep;
    }
    return sep;
  }
  function getCalcField(field) {
    var calcField;
    if (field.inSection === false) {
      if ("name" === field.thisField.type)
        return getOffScreenFieldForName(field);
      calcField = jQuery(field.thisFieldCall);
      if (
        !calcField.length &&
        -1 !== ["date", "data"].indexOf(field.thisField.type)
      ) {
        calcField = jQuery(field.thisField.key);
        if (!calcField.length && "data" === field.thisField.type)
          calcField = jQuery(
            field.thisField.key.replace('="', "^=").replace('"]', "-") +
              "]:checked"
          );
      }
    } else calcField = getSiblingField(field);
    if (
      calcField === null ||
      typeof calcField === "undefined" ||
      calcField.length < 1
    )
      calcField = false;
    if (calcField.length > 1)
      calcField = filterCalcField(calcField, field.thisFieldId);
    return calcField;
  }
  function filterCalcField($calcField, thisFieldId) {
    return $calcField.filter(function () {
      var target = "OPTION" === this.nodeName ? this.closest("select") : this;
      return target && target.name && target.name.indexOf(thisFieldId) !== -1;
    });
  }
  function getOffScreenFieldForName(field) {
    var nameParts, input;
    nameParts = [];
    document.querySelectorAll(field.thisFieldCall).forEach(function (input) {
      nameParts.push(input.value);
    });
    input = document.createElement("input");
    input.value = nameParts.join(" ");
    return jQuery(input);
  }
  function getDateFieldValue(dateFormat, thisVal) {
    var d = 0;
    if (!thisVal);
    else if (typeof jQuery.datepicker === "undefined") {
      var splitAt = "-";
      if (dateFormat.indexOf("/") > -1) splitAt = "/";
      var year = "",
        month = "",
        day = "",
        formatPieces = dateFormat.split(splitAt),
        datePieces = thisVal.split(splitAt);
      for (var i = 0; i < formatPieces.length; i++)
        if (formatPieces[i] === "y") {
          var currentYear = new Date().getFullYear() + 15;
          var currentYearPlusFifteen = currentYear.toString().substr(2, 2);
          if (datePieces[i] > currentYearPlusFifteen)
            year = "19" + datePieces[i];
          else year = "20" + datePieces[i];
        } else if (formatPieces[i] === "yy") year = datePieces[i];
        else if (formatPieces[i] === "m" || formatPieces[i] === "mm") {
          month = datePieces[i];
          if (month.length < 2) month = "0" + month;
        } else if (formatPieces[i] === "d" || formatPieces[i] === "dd") {
          day = datePieces[i];
          if (day.length < 2) day = "0" + day;
        }
      d = Date.parse(year + "-" + month + "-" + day);
    } else d = jQuery.datepicker.parseDate(dateFormat, thisVal);
    return d;
  }
  function getSiblingField(field) {
    if (typeof field.triggerField === "undefined") return null;
    var fields = null,
      container = field.triggerField.closest(
        ".frm_repeat_sec, .frm_repeat_inline, .frm_repeat_grid"
      ),
      repeatArgs = getRepeatArgsFromFieldName(field.triggerField.attr("name")),
      siblingFieldCall = field.thisFieldCall
        .replace("[id=", "[id^=")
        .replace(/-"]/g, "-" + repeatArgs.repeatRow + '"]');
    if (container.length || repeatArgs.repeatRow !== "") {
      if (container.length)
        fields = container.find(
          siblingFieldCall + "," + siblingFieldCall.replace("input[", "select[")
        );
      else fields = jQuery(siblingFieldCall);
      if (fields === null || typeof fields === "undefined" || fields.length < 1)
        fields = uncheckedSiblingOrOutsideSection(
          field,
          container,
          siblingFieldCall
        );
    } else fields = getNonSiblingField(field);
    return fields;
  }
  function uncheckedSiblingOrOutsideSection(
    field,
    container,
    siblingFieldCall
  ) {
    var fields = null;
    if (siblingFieldCall.indexOf(":checked")) {
      var inSection = container.find(siblingFieldCall.replace(":checked", ""));
      if (inSection.length < 1) fields = getNonSiblingField(field);
    } else fields = getNonSiblingField(field);
    return fields;
  }
  function getNonSiblingField(field) {
    var nonSiblingField = jQuery(
      field.thisFieldCall +
        "," +
        field.thisFieldCall.replace("input[", "select[")
    );
    if (
      !nonSiblingField.length &&
      "input[" === field.thisFieldCall.substr(0, 6)
    )
      if (
        "undefined" !== typeof field.triggerField &&
        field.triggerField.is("div") &&
        field.triggerField.hasClass("frm_form_field")
      )
        nonSiblingField = field.triggerField.find(
          field.thisFieldCall.replace("input[", "textarea[")
        );
      else
        nonSiblingField = jQuery(
          field.thisFieldCall.replace("input[", "textarea[")
        );
    return nonSiblingField;
  }
  function getOptionValue(thisField, currentOpt) {
    var thisVal;
    if (isOtherOption(thisField, currentOpt))
      thisVal = getOtherValueAnyField(thisField, currentOpt);
    else if (currentOpt.type === "checkbox" || currentOpt.type === "radio")
      if (currentOpt.checked)
        thisVal = currentOpt.hasAttribute("data-frmprice")
          ? currentOpt.dataset.frmprice
          : currentOpt.value;
      else thisVal = currentOpt.dataset.off;
    else
      thisVal = currentOpt.hasAttribute("data-frmprice")
        ? currentOpt.dataset.frmprice
        : jQuery(currentOpt).val();
    if (typeof thisVal === "undefined") thisVal = "";
    return thisVal;
  }
  function isOtherOption(thisField, currentOpt) {
    var isOtherOpt = false;
    if (currentOpt.type === "hidden") {
      if (getOtherValueLimited(currentOpt) !== "") isOtherOpt = true;
    } else if (thisField.type === "select") {
      var optClass = currentOpt.className;
      if (optClass && optClass.indexOf("frm_other_trigger") > -1)
        isOtherOpt = true;
    } else if (thisField.type === "checkbox" || thisField.type === "radio")
      if (
        currentOpt.id.indexOf("-other_") > -1 &&
        currentOpt.id.indexOf("-otext") < 0
      )
        isOtherOpt = true;
    return isOtherOpt;
  }
  function getOtherValueLimited(currentOpt) {
    var otherVal = "",
      otherText = document.getElementById(currentOpt.id + "-otext");
    if (otherText !== null && otherText.value !== "")
      otherVal = otherText.value;
    return otherVal;
  }
  function getOtherValueAnyField(thisField, currentOpt) {
    var otherVal = 0;
    if (thisField.type === "select")
      if (currentOpt.type === "hidden")
        if (isCurrentOptRepeating(currentOpt));
        else otherVal = getOtherValueLimited(currentOpt);
      else otherVal = getOtherSelectValue(currentOpt);
    else if (thisField.type === "checkbox" || thisField.type === "radio")
      if (currentOpt.type === "hidden");
      else otherVal = getOtherValueLimited(currentOpt);
    return otherVal;
  }
  function isCurrentOptRepeating(currentOpt) {
    var isRepeating = false,
      parts = currentOpt.name.split("[");
    if (parts.length > 2) isRepeating = true;
    return isRepeating;
  }
  function getOtherSelectValue(currentOpt) {
    var fields = getOtherSelects(currentOpt);
    return fields.val();
  }
  function setOtherSelectValue(thisField, value) {
    var i,
      fields = getOtherSelects(thisField);
    if (fields.length < 1) return;
    fields.val(value);
    for (i = 0; i < thisField.options.length; i++)
      if (thisField.options[i].className.indexOf("frm_other_trigger") !== -1)
        thisField.options[i].selected = true;
  }
  function getOtherSelects(currentOpt) {
    return jQuery(currentOpt)
      .closest(".frm_other_container")
      .find(".frm_other_input");
  }
  function setOtherValueLimited(thisField, value) {
    var otherText,
      baseId,
      parentInput,
      i = 0,
      idParts = thisField.id.split("-");
    idParts.pop();
    baseId = idParts.join("-");
    otherText = document.querySelectorAll(
      "[id^=" + baseId + "-other][id$=otext]"
    );
    if (otherText.length > 0)
      for (i = 0; i < otherText.length; i++)
        if (otherText[i].value === "") {
          otherText[i].value = value;
          parentInput = document.getElementById(
            otherText[i].id.replace("-otext", "")
          );
          if (parentInput !== null) parentInput.checked = true;
        }
  }
  function savingDraftEntry(object) {
    var isDraft = false,
      savingDraft = jQuery(object).find(".frm_saving_draft");
    if (savingDraft.length) isDraft = savingDraft.val();
    return isDraft;
  }
  function goingToPrevPage(object) {
    var goingBack = false,
      nextPage = jQuery(object).find(".frm_next_page");
    if (nextPage.length && nextPage.val()) {
      var formID = jQuery(object).find('input[name="form_id"]').val();
      var prevPage = jQuery(object).find(
        'input[name="frm_page_order_' + formID + '"]'
      );
      if (prevPage.length) prevPage = parseInt(prevPage.val());
      else prevPage = 0;
      if (!prevPage || parseInt(nextPage.val()) < prevPage) goingBack = true;
    }
    return goingBack;
  }
  function afterFormSubmitted(event, form) {
    checkConditionalLogic("pageLoad");
    doEditInPlaceCleanUp(form);
    checkFieldsOnPage();
    maybeShowMoreStepsButton();
  }
  function afterPageChanged() {
    checkFieldsOnPage();
    addTopAddRowBtnForRepeater();
    maybeDisableCheckboxesWithLimit();
    calcProductsTotal();
    maybeShowMoreStepsButton();
    triggerChangeOnCalcTriggers();
  }
  function triggerChangeOnCalcTriggers() {
    if (
      "undefined" === typeof __FRMCALC ||
      "undefined" === typeof __FRMCALC.fieldKeys
    )
      return;
    Object.values(__FRMCALC.fieldKeys).forEach(function (key) {
      jQuery(key + ":not(label):not([type=hidden])").each(function () {
        jQuery(this).trigger({ type: "change", selfTriggered: true });
      });
    });
  }
  function generateGoogleTables(graphs, graphType) {
    for (var num = 0; num < graphs.length; num++)
      generateSingleGoogleTable(graphs[num], graphType);
  }
  function generateSingleGoogleTable(opts, type) {
    google.load("visualization", "1.0", {
      packages: [type],
      callback: function () {
        compileGoogleTable(opts);
      },
    });
  }
  function compileGoogleTable(opts) {
    var data = new google.visualization.DataTable(),
      showID = false;
    if (jQuery.inArray("id", opts.options.fields) !== -1) {
      showID = true;
      data.addColumn("number", frm_js.id);
    }
    var colCount = opts.fields.length;
    var type = "string";
    for (var i = 0, l = colCount; i < l; i++) {
      var thisCol = opts.fields[i];
      type = getGraphType(thisCol);
      data.addColumn(type, thisCol.name);
    }
    var showEdit = false;
    if (opts.options.edit_link) {
      showEdit = true;
      data.addColumn("string", opts.options.edit_link);
    }
    var showDelete = false;
    if (opts.options.delete_link) {
      showDelete = true;
      data.addColumn("string", opts.options.delete_link);
    }
    var col = 0;
    if (opts.entries !== null) {
      var entryCount = opts.entries.length;
      data.addRows(entryCount);
      var row = 0;
      for (var e = 0, len = entryCount; e < len; e++) {
        col = 0;
        var entry = opts.entries[e];
        if (showID) {
          data.setCell(row, col, entry.id);
          col++;
        }
        for (
          var field = 0, fieldCount = colCount;
          field < fieldCount;
          field++
        ) {
          var thisEntryCol = opts.fields[field];
          type = getGraphType(thisEntryCol);
          var fieldVal = entry.metas[thisEntryCol.id];
          if (type === "number" && (fieldVal === null || fieldVal === ""))
            fieldVal = 0;
          else if (type === "boolean")
            if (fieldVal === null || fieldVal == "false" || fieldVal === false)
              fieldVal = false;
            else fieldVal = true;
          data.setCell(row, col, fieldVal);
          col++;
        }
        if (showEdit) {
          if (typeof entry.editLink !== "undefined")
            data.setCell(
              row,
              col,
              '<a href="' +
                entry.editLink +
                '">' +
                opts.options.edit_link +
                "</a>"
            );
          else data.setCell(row, col, "");
          col++;
        }
        if (showDelete)
          if (typeof entry.deleteLink !== "undefined")
            data.setCell(
              row,
              col,
              '<a href="' +
                entry.deleteLink +
                '" class="frm_delete_link" data-frmconfirm="' +
                opts.options.confirm +
                '">' +
                opts.options.delete_link +
                "</a>"
            );
          else data.setCell(row, col, "");
        row++;
      }
    } else {
      data.addRows(1);
      col = 0;
      for (i = 0, l = colCount; i < l; i++) {
        if (col > 0) data.setCell(0, col, "");
        else data.setCell(0, col, opts.options.no_entries);
        col++;
      }
    }
    var chart = new google.visualization.Table(
      document.getElementById("frm_google_table_" + opts.options.form_id)
    );
    chart.draw(data, opts.graphOpts);
  }
  function generateGoogleGraphs(graphs) {
    var l, i;
    l = graphs.length;
    for (i = 0; i < l; i++) {
      generateSingleGoogleGraph(graphs[i]);
      if (
        "string" === typeof graphs[i].options.width &&
        "%" === graphs[i].options.width.substr(-1)
      )
        addResponsiveGraphListener(graphs[i]);
    }
  }
  function addResponsiveGraphListener(graphData) {
    window.addEventListener("resize", function () {
      generateSingleGoogleGraph(graphData);
    });
  }
  function generateSingleGoogleGraph(graphData) {
    google.charts.load("current", { packages: [graphData.package] });
    google.charts.setOnLoadCallback(function () {
      compileGoogleGraph(graphData);
    });
  }
  function compileGoogleGraph(graphData) {
    var data = new google.visualization.DataTable();
    data = google.visualization.arrayToDataTable(graphData.data);
    var chartDiv = document.getElementById("chart_" + graphData.graph_id);
    if (chartDiv === null) return;
    var type = graphData.type.charAt(0).toUpperCase() + graphData.type.slice(1);
    if (type !== "Histogram" && type !== "Table") type += "Chart";
    var chart = new google.visualization[type](chartDiv);
    chart.draw(data, graphData.options);
    jQuery(document).trigger("frmDrawChart", [
      chart,
      "chart_" + graphData.graph_id,
      data,
    ]);
  }
  function getGraphType(field) {
    var type = "string";
    if (field.type === "number") type = "number";
    else if (field.type === "checkbox" || field.type === "select") {
      var optCount = field.options.length;
      if (field.type === "select" && field.options[0] === "")
        if (field.field_options.post_field === "post_status") optCount = 3;
        else optCount = optCount - 1;
      if (optCount == 1) type = "boolean";
    }
    return type;
  }
  function removeRow() {
    if (!confirmRowRemoval()) return;
    var rowNum = jQuery(this).data("key"),
      sectionID = jQuery(this).data("parent"),
      id = "frm_section_" + sectionID + "-" + rowNum,
      thisRow = jQuery(this).parents('div[id^="frm_section_"]'),
      fields = thisRow.find("input, select, textarea, .frm_html_container"),
      formId = jQuery(this).closest("form").find('input[name="form_id"]').val();
    thisRow.fadeOut("slow", function () {
      thisRow.remove();
      fields.each(function () {
        var fieldID;
        if (this.matches(".frm_html_container")) fieldID = getHtmlFieldID(this);
        else fieldID = frmFrontForm.getFieldId(this, false);
        if (this.type != "file") doCalculation(fieldID, jQuery(this));
        var container =
          "frm_field_" +
          fieldID +
          "-" +
          sectionID +
          "-" +
          rowNum +
          "_container";
        removeFromHideFields(container, formId);
        if (this.classList.contains("wp-editor-area")) removeRichText(this.id);
      });
      showAddButton(sectionID);
      if (typeof frmThemeOverride_frmRemoveRow === "function")
        frmThemeOverride_frmRemoveRow(id, thisRow);
      jQuery(document).trigger("frmAfterRemoveRow");
    });
    return false;
  }
  function getHtmlFieldID(field) {
    var parentIDParts;
    parentIDParts = field.id.split("_");
    if (parentIDParts.length < 3) return 0;
    parentIDParts = parentIDParts[2];
    parentIDParts = parentIDParts.split("-");
    if (!parentIDParts.length) return 0;
    return parentIDParts[0];
  }
  function confirmRowRemoval() {
    if (!frm_js.repeaterRowDeleteConfirmation) return true;
    return confirm(frm_js.repeaterRowDeleteConfirmation);
  }
  function hideAddButton(sectionID) {
    jQuery("#frm_field_" + sectionID + "_container .frm_add_form_row").addClass(
      "frm_hide_add_button"
    );
  }
  function showAddButton(sectionID) {
    jQuery(
      "#frm_field_" + sectionID + "_container .frm_add_form_row"
    ).removeClass("frm_hide_add_button");
  }
  function addRow() {
    var thisBtn,
      id,
      i,
      numberOfSections,
      lastRowIndex,
      stateField,
      state,
      form,
      data,
      success,
      error,
      extraParams;
    if (currentlyAddingRow === true) return false;
    currentlyAddingRow = true;
    thisBtn = jQuery(this);
    id = thisBtn.data("parent");
    i = 0;
    numberOfSections = jQuery(".frm_repeat_" + id).length;
    if (numberOfSections > 0) {
      lastRowIndex = false;
      document
        .querySelectorAll(".frm_repeat_" + id)
        .forEach(function (element) {
          var strippedId = element.id.replace("frm_section_" + id + "-", ""),
            parsedId;
          if (!strippedId.length || "i" === strippedId[0]) return;
          parsedId = parseInt(strippedId);
          if (parsedId && (false === lastRowIndex || parsedId > lastRowIndex))
            lastRowIndex = parsedId;
        });
      if (false === lastRowIndex) i = 1;
      else i = lastRowIndex + 1;
    }
    stateField = document.querySelector('input[name="frm_state"]');
    state = null !== stateField ? stateField.value : "";
    form = jQuery(this).closest("form").get(0);
    data = {
      action: "frm_add_form_row",
      field_id: id,
      i: i,
      numberOfSections: numberOfSections,
      nonce: frm_js.nonce,
      frm_state: state,
    };
    success = function (r) {
      var html,
        item,
        checked,
        fieldID,
        fieldObject,
        reset,
        repeatArgs,
        j,
        inputRanges;
      if (r.php) {
        html = r.php;
        item = jQuery(html).addClass("frm-fade-in");
        thisBtn.parents(".frm_section_heading").append(item);
        inputRanges = item[0].querySelectorAll("input[type=range]");
        for (j = 0; j < inputRanges.length; j++)
          handleSliderEvent.call(inputRanges[j]);
        if (r.is_repeat_limit_reached) hideAddButton(id);
        checked = ["other"];
        reset = "reset";
        repeatArgs = {
          repeatingSection: id.toString(),
          repeatRow: i.toString(),
        };
        jQuery(html)
          .find("input, select, textarea")
          .each(function () {
            if (this.name === "") return true;
            if (this.type == "file")
              fieldID = this.name.replace("file", "").split("-")[0];
            else
              fieldID = this.name
                .replace("item_meta[", "")
                .split("]")[2]
                .replace("[", "");
            if (jQuery.inArray(fieldID, checked) == -1) {
              if (this.id === false || this.id === "") return;
              fieldObject = jQuery("#" + this.id);
              checked.push(fieldID);
              hideOrShowFieldById(fieldID, repeatArgs);
              updateWatchingFieldById(fieldID, repeatArgs, "value changed");
              checkFieldsWithConditionalLogicDependentOnThis(
                fieldID,
                fieldObject
              );
              checkFieldsWatchingLookup(fieldID, fieldObject, "value changed");
              doCalculation(fieldID, fieldObject);
              maybeDoCalcForSingleField(fieldObject.get(0));
              reset = "persist";
            }
          });
        jQuery(html)
          .find(".frm_html_container")
          .each(function () {
            var fieldID = this.id.replace("frm_field_", "").split("-")[0];
            checked.push(fieldID);
            hideOrShowFieldById(fieldID, repeatArgs);
          });
        loadDropzones(repeatArgs.repeatRow);
        loadSliders();
        loadAutocomplete();
        jQuery(html)
          .find(".frm_html_container")
          .each(function () {
            var fieldID = this.id.replace("frm_field_", "").split("-")[0];
            checked.push(fieldID);
            hideOrShowFieldById(fieldID, repeatArgs);
          });
        jQuery(html)
          .find(".wp-editor-area")
          .each(function () {
            initRichText(this.id);
          });
      }
      if (typeof frmThemeOverride_frmAddRow === "function")
        frmThemeOverride_frmAddRow(id, r);
      jQuery(document).trigger("frmAfterAddRow");
      jQuery(".frm_repeat_" + id).each(function (i) {
        this.style.zIndex = 999 - i;
      });
      currentlyAddingRow = false;
    };
    error = function () {
      currentlyAddingRow = false;
    };
    extraParams = { dataType: "json" };
    postToAjaxUrl(form, data, success, error, extraParams);
    return false;
  }
  function triggerToggleClickOnSpace(e) {
    if (32 === e.which) this.click();
  }
  function removeRichText(id) {
    tinymce.EditorManager.execCommand("mceRemoveEditor", true, id);
  }
  function initRichText(id) {
    var key = Object.keys(tinyMCEPreInit.mceInit)[0],
      orgSettings = tinyMCEPreInit.mceInit[key],
      newValues = {
        selector: "#" + id,
        body_class: orgSettings.body_class.replace(key, id),
      },
      newSettings = Object.assign({}, orgSettings, newValues);
    tinymce.init(newSettings);
  }
  function editEntry() {
    var $edit = jQuery(this),
      entryId = $edit.data("entryid"),
      prefix = $edit.data("prefix"),
      postId = $edit.data("pageid"),
      formId = $edit.data("formid"),
      cancel = $edit.data("cancel"),
      fields = $edit.data("fields"),
      excludeFields = $edit.data("excludefields"),
      startPage = $edit.data("startpage"),
      $cont = jQuery(document.getElementById(prefix + entryId)),
      orig = $cont.php();
    $cont.php(
      '<span class="frm-loading-img" id="' +
        prefix +
        entryId +
        '"></span><div class="frm_orig_content" style="display:none">' +
        orig +
        "</div>"
    );
    jQuery.ajax({
      type: "POST",
      url: frm_js.ajax_url,
      dataType: "html",
      data: {
        action: "frm_entries_edit_entry_ajax",
        post_id: postId,
        entry_id: entryId,
        id: formId,
        nonce: frm_js.nonce,
        fields: fields,
        exclude_fields: excludeFields,
        start_page: startPage,
      },
      success: function (html) {
        $cont.children(".frm-loading-img").replaceWith(html);
        $edit.removeClass("frm_inplace_edit").addClass("frm_cancel_edit");
        $edit.php(cancel);
        checkConditionalLogic("editInPlace");
        if (typeof frmFrontForm.fieldValueChanged === "function")
          jQuery(document).on(
            "change",
            '.frm-show-form input[name^="item_meta"], .frm-show-form select[name^="item_meta"], .frm-show-form textarea[name^="item_meta"]',
            frmFrontForm.fieldValueChanged
          );
        checkFieldsOnPage(prefix + entryId);
        triggerEvent(document, "frmInPlaceEdit");
      },
    });
    return false;
  }
  function cancelEdit() {
    var $cancelLink = jQuery(this),
      prefix = $cancelLink.data("prefix"),
      entryId = $cancelLink.data("entryid"),
      $cont = jQuery(document.getElementById(prefix + entryId));
    $cont.children(".frm_forms").replaceWith("");
    $cont
      .children(".frm_orig_content")
      .fadeIn("slow")
      .removeClass("frm_orig_content");
    switchCancelToEdit($cancelLink);
  }
  function switchCancelToEdit($link) {
    var label = $link.data("edit");
    $link.removeClass("frm_cancel_edit").addClass("frm_inplace_edit");
    $link.php(label);
  }
  function deleteEntry() {
    var entryId,
      prefix,
      $link = jQuery(this),
      confirmText = $link.data("deleteconfirm");
    if (confirm(confirmText)) {
      entryId = $link.data("entryid");
      prefix = $link.data("prefix");
      $link.replaceWith(
        '<span class="frm-loading-img" id="frm_delete_' + entryId + '"></span>'
      );
      jQuery.ajax({
        type: "POST",
        url: frm_js.ajax_url,
        data: {
          action: "frm_entries_destroy",
          entry: entryId,
          nonce: frm_js.nonce,
        },
        success: function (html) {
          if (html.replace(/^\s+|\s+$/g, "") === "success") {
            var container = jQuery(document.getElementById(prefix + entryId));
            container.fadeOut("slow", function () {
              container.remove();
            });
            jQuery(document.getElementById("frm_delete_" + entryId)).fadeOut(
              "slow"
            );
            jQuery(document).trigger("frmEntryDeleted", [entryId]);
          } else
            jQuery(
              document.getElementById("frm_delete_" + entryId)
            ).replaceWith(html);
        },
      });
    }
    return false;
  }
  function doEditInPlaceCleanUp(form) {
    var entryIdField = jQuery(form).find('input[name="id"]');
    if (entryIdField.length) {
      var link = document.getElementById("frm_edit_" + entryIdField.val());
      if (isCancelLink(link)) switchCancelToEdit(jQuery(link));
    }
  }
  function isCancelLink(link) {
    return link !== null && link.className.indexOf("frm_cancel_edit") > -1;
  }
  function loadUniqueTimeFields() {
    var timeFields, i, dateField;
    if (typeof __frmUniqueTimes === "undefined") return;
    timeFields = __frmUniqueTimes;
    for (i = 0; i < timeFields.length; i++) {
      dateField = document.getElementById(timeFields[i].dateID);
      jQuery(dateField).on("change", maybeTriggerUniqueTime);
      if ("" !== dateField.value) jQuery(dateField).trigger("change");
    }
  }
  function maybeTriggerUniqueTime() {
    var timeFields = __frmUniqueTimes;
    for (var i = 0; i < timeFields.length; i++)
      if (timeFields[i].dateID == this.id)
        frmProForm.removeUsedTimes(this, timeFields[i].timeID);
  }
  function checkFieldsOnPage(containerId, event) {
    if ("undefined" === typeof event) event = "";
    checkPreviouslyHiddenFields();
    loadDateFields();
    loadCustomInputMasks();
    loadSliders();
    loadAutocomplete(containerId);
    checkDynamicFields(event);
    checkLookupFields();
    triggerCalc();
    loadDropzones();
    checkPasswordFields();
    triggerLookupWatchUpdates();
  }
  function triggerLookupWatchUpdates() {
    var i, fieldId, keys, value, $changedInput;
    if (
      typeof __FRMLOOKUP === "undefined" ||
      document.querySelector('form input[name="id"]')
    )
      return;
    keys = Object.keys(__FRMLOOKUP);
    for (i = 0; i < keys.length; i++) {
      fieldId = keys[i];
      value = __FRMLOOKUP[fieldId];
      if (value.dependents.length <= 0) continue;
      $changedInput = jQuery("#field_" + value.fieldKey);
      if ($changedInput.length)
        checkFieldsWatchingLookup(fieldId, $changedInput, "value changed");
    }
  }
  function checkPasswordFields() {
    var passwordFields = document.querySelectorAll(".frm_strength_meter"),
      event = document.createEvent("HTMLEvents");
    event.initEvent("keyup", true, true);
    for (var i = 0; i < passwordFields.length; i++)
      passwordFields[i].dispatchEvent(event);
  }
  function checkPreviouslyHiddenFields() {
    if (typeof __frmHideFields !== "undefined")
      frmProForm.hidePreviouslyHiddenFields();
  }
  function loadAutocomplete(containerId) {
    loadChosen(containerId);
    loadSlimSelect(containerId);
  }
  function loadChosen(chosenContainer) {
    var opts;
    if (!jQuery().chosen) return;
    opts = {
      allow_single_deselect: true,
      no_results_text: frm_js.no_results,
      search_contains: true,
    };
    if (typeof __frmChosen !== "undefined") opts = "{" + __frmChosen + "}";
    if (typeof chosenContainer !== "undefined")
      jQuery("#" + chosenContainer)
        .find(".frm_chzn")
        .chosen(opts);
    else jQuery(".frm_chzn").chosen(opts);
  }
  function loadSlimSelect(containerId) {
    var container, dropdowns;
    if ("undefined" === typeof SlimSelect) return;
    if ("undefined" !== typeof containerId) {
      container = document.getElementById(containerId);
      if (!container) return;
      dropdowns = container.querySelectorAll("select.frm_slimselect");
    } else dropdowns = document.querySelectorAll("select.frm_slimselect");
    dropdowns.forEach(function (autocompleteInput) {
      var emptyOption;
      if (
        "none" === autocompleteInput.style.display ||
        autocompleteInput.classList.contains("ss-main") ||
        autocompleteInput.classList.contains("ss-content")
      )
        return;
      emptyOption = autocompleteInput.querySelector('option[value=""]');
      if (emptyOption && "" === emptyOption.textContent.trim())
        if ("multiple" === autocompleteInput.getAttribute("multiple"))
          emptyOption.parentElement.removeChild(emptyOption);
        else emptyOption.setAttribute("data-placeholder", "true");
      new SlimSelect({
        select: "#" + autocompleteInput.id,
        settings: {
          placeholderText: "",
          searchText: frm_js.no_results,
          searchPlaceholder: " ",
        },
        events: {
          afterOpen: function () {
            var ssContent, ssContentSearchInput, ssList, label;
            ssContent = document.querySelector(
              '.ss-content[data-id="' + autocompleteInput.dataset.id + '"]'
            );
            if (!ssContent) return;
            ssContent.removeAttribute("role");
            ssContentSearchInput = ssContent.querySelector(".ss-search input");
            if (!ssContentSearchInput) return;
            ssContentSearchInput.removeAttribute("aria-label");
            ssList = ssContent.querySelector(".ss-list");
            if (ssList) ssList.setAttribute("role", "listbox");
            label = document.querySelector(
              'label[for="' + autocompleteInput.id + '"]'
            );
            if (label) {
              ssContentSearchInput.setAttribute("aria-labelledby", label.id);
              if (ssList) ssList.setAttribute("aria-labelledby", label.id);
            }
          },
        },
      });
      makeSlimSelectAccessibilityChanges(autocompleteInput);
      autocompleteInput.addEventListener("change", function () {
        jQuery(autocompleteInput).trigger("change");
      });
    });
  }
  function makeSlimSelectAccessibilityChanges(autocompleteInput) {
    addAriaLabelledByToSlimSelectMainElement(autocompleteInput);
    openSlimSelectOnLabelClick(autocompleteInput);
  }
  function addAriaLabelledByToSlimSelectMainElement(autocompleteInput) {
    var label, slimselectElement;
    label = document.querySelector('label[for="' + autocompleteInput.id + '"]');
    if (label) {
      slimselectElement = document.querySelector(
        '.ss-main[data-id="' + autocompleteInput.getAttribute("data-id") + '"]'
      );
      if (slimselectElement)
        slimselectElement.setAttribute("aria-labelledby", label.id);
    }
  }
  function openSlimSelectOnLabelClick(autocompleteInput) {
    var label = document.querySelector(
      'label[for="' + autocompleteInput.id + '"]'
    );
    if (label) {
      var labelListener = function () {
        setTimeout(function () {
          autocompleteInput.slim.open();
        }, 0);
      };
      label.addEventListener("click", labelListener);
    }
  }
  function loadStars() {
    updateStars(this);
  }
  function hoverStars() {
    var input = this.previousSibling;
    updateStars(input);
  }
  function updateStars(hovered) {
    var starGroup = hovered.parentElement,
      stars = starGroup.children,
      current = parseInt(hovered.value),
      starClass = "star-rating",
      selectLabel = false;
    starGroup.className += " frm-star-hovered";
    for (var i = 0; i < stars.length; i++)
      if (stars[i].matches("." + starClass))
        if (selectLabel) stars[i].className += " star-rating-hover";
        else stars[i].classList.remove("star-rating-hover", "star-rating-on");
      else selectLabel = parseInt(stars[i].value) <= current;
  }
  function unhoverStars() {
    var input = this.previousSibling,
      starGroup = input.parentElement;
    starGroup.classList.remove("frm-star-hovered");
    var stars = starGroup.children;
    var selected = jQuery(starGroup).find("input:checked").attr("id");
    var isSelected = "";
    var starClass = "star-rating";
    for (var i = stars.length - 1; i > 0; i--)
      if (stars[i].matches("." + starClass)) {
        stars[i].classList.remove("star-rating-hover");
        if (
          isSelected === "" &&
          typeof selected !== "undefined" &&
          stars[i].getAttribute("for") == selected
        )
          isSelected = " star-rating-on";
        if (isSelected !== "") stars[i].className += isSelected;
      }
  }
  function clearStars(starGroup, noClearInput) {
    var labels, input;
    labels = starGroup.querySelectorAll(".star-rating-on");
    if (labels && labels.length)
      labels.forEach(function (el) {
        el.classList.remove("star-rating-on");
      });
    if (!noClearInput) {
      input = starGroup.querySelector('input[type="radio"]:checked');
      if (input) input.checked = false;
    }
  }
  function handleSliderEvent() {
    var i, c, fieldKey, currency;
    c = this.parentNode.children;
    for (i = 0; i < c.length; i++) {
      if (c[i].className !== "frm_range_value") continue;
      fieldKey = getFieldKey(this.id, this.name);
      if ("undefined" !== typeof __FRMCALC && __FRMCALC.calc[fieldKey]) {
        currency = getCurrencyFromCalcRule(__FRMCALC.calc[fieldKey]);
        c[i].textContent = formatCurrency(
          normalizeTotal(this.value, currency),
          currency
        );
      } else c[i].textContent = this.value;
      break;
    }
  }
  function loadSliders() {
    jQuery(document).on(
      "input change",
      "input[data-frmrange]",
      handleSliderEvent
    );
  }
  function getCurrencyFromCalcRule(calcRule) {
    return "undefined" !== typeof calcRule.custom_currency
      ? calcRule.custom_currency
      : getCurrency(calcRule.form_id);
  }
  function setInlineFormWidth() {
    var children,
      f,
      inlineForm,
      inlineForms = jQuery(".frm_inline_form .frm_fields_container");
    if (inlineForms.length)
      for (f = 0; f < inlineForms.length; f++) {
        inlineForm = jQuery(inlineForms[f]);
        children = inlineForm.children(".frm_form_field");
        if (children.length <= 12 && !fieldHasLayoutClass(children.last()))
          addAutoInlineLayout(inlineForm, children);
      }
  }
  function fieldHasLayoutClass(field) {
    var i,
      classList = field.attr("class"),
      layoutClasses = [
        "frm_full",
        "half",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
      ];
    if (typeof classList === "undefined") return false;
    for (i = 1; i <= 12; i++) {
      if (field.hasClass("frm" + i)) return true;
      if (i === 12)
        for (var c = 0; c < layoutClasses.length; c++) {
          if (classList.indexOf(layoutClasses[c]) !== -1) return true;
          if (c === layoutClasses.length - 1) return false;
        }
    }
  }
  function addAutoInlineLayout(inlineForm, children) {
    var fieldCount, colCount, i;
    fieldCount = children.length + 1;
    colCount = Math.max(2, Math.ceil(12 / fieldCount));
    for (i = 0; i < children.length; i++)
      if (!fieldHasLayoutClass(jQuery(children[i])))
        jQuery(children[i]).addClass("frm" + colCount);
    inlineForm.children(".frm_submit").addClass("frm" + colCount);
  }
  function checkConditionalLogic(event) {
    if (typeof __frmHideOrShowFields !== "undefined")
      frmProForm.hideOrShowFields(__frmHideOrShowFields, event);
    else showForm();
  }
  function showForm() {
    jQuery(".frm_pro_form").fadeIn("slow");
  }
  function checkDynamicFields(event) {
    if (typeof __frmDepDynamicFields !== "undefined") {
      if ("pageLoad" === event && typeof __frmHideOrShowFields === "undefined")
        clearHideFields();
      frmProForm.checkDependentDynamicFields(__frmDepDynamicFields);
    }
  }
  function checkLookupFields() {
    if (typeof __frmDepLookupFields !== "undefined")
      frmProForm.checkDependentLookupFields(__frmDepLookupFields);
  }
  function triggerChange(input, fieldKey) {
    if (typeof fieldKey === "undefined") fieldKey = "dependent";
    if (input.length > 1) input = input.eq(0);
    input.trigger({
      type: "change",
      selfTriggered: true,
      frmTriggered: fieldKey,
    });
  }
  function loadCustomInputMasks() {
    if (typeof __frmMasks === "undefined") return;
    var maskFields = __frmMasks;
    for (var i = 0; i < maskFields.length; i++)
      jQuery(maskFields[i].trigger).attr("data-frmmask", maskFields[i].mask);
  }
  function getRepeatArgsFromFieldName(fieldName) {
    var repeatArgs = { repeatingSection: "", repeatRow: "" };
    if (typeof fieldName !== "undefined" && isRepeatingFieldByName(fieldName)) {
      var inputNameParts = fieldName.split("][");
      repeatArgs.repeatingSection = inputNameParts[0].replace("item_meta[", "");
      repeatArgs.repeatRow = inputNameParts[1];
    }
    return repeatArgs;
  }
  function fadeOut($remove) {
    $remove.fadeOut("slow", function () {
      $remove.remove();
    });
  }
  function objectSearch(array, value) {
    for (var prop in array)
      if (array.hasOwnProperty(prop)) if (array[prop] === value) return prop;
    return null;
  }
  function isNumeric(obj) {
    return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
  }
  function checkPasswordField() {
    var fieldId, fieldIdSplit, checks, split, suffix, check, span;
    if (this.className.indexOf("frm_strength_meter") > -1) {
      fieldId = this.name
        .substr(this.name.indexOf("[") + 1)
        .replace(/\]\[\d\]\[/, "-");
      fieldId = fieldId.substr(0, fieldId.length - 1);
      fieldIdSplit = fieldId.split("-");
      if (fieldIdSplit.length === 2)
        fieldId = fieldIdSplit[1] + "-" + fieldIdSplit[0];
      checks = passwordChecks();
      split = this.id.split("-");
      suffix =
        split.length > 1 && !isNaN(split[split.length - 1])
          ? "-" + split[split.length - 1]
          : "";
      for (check in checks) {
        span = document.getElementById(
          "frm-pass-" + check + "-" + fieldId + suffix
        );
        addOrRemoveVerifyPass(checks[check], this.value, span);
      }
    }
  }
  function passwordChecks() {
    return {
      "eight-char": /^.{8,}$/,
      number: /\d/,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      "special-char": /(?=.*[^a-zA-Z0-9])/,
    };
  }
  function addOrRemoveVerifyPass(regEx, password, span) {
    if (span !== null) {
      var remove = regEx.test(password);
      if (remove) maybeRemovePassReq(span);
      else maybeRemovePassVerified(span);
    }
  }
  function maybeRemovePassReq(span) {
    if (span.classList.contains("frm-pass-req")) {
      span.classList.remove("frm-pass-req");
      span.classList.add("frm-pass-verified");
    }
  }
  function maybeRemovePassVerified(span) {
    if (span.classList.contains("frm-pass-verified")) {
      span.classList.remove("frm-pass-verified");
      span.classList.add("frm-pass-req");
    }
  }
  function checkCheckboxSelectionLimit() {
    var limit = parseInt(this.getAttribute("data-frmlimit")),
      checked = this.checked;
    if (!limit) return;
    var allBoxes = jQuery(this)
      .parents(".frm_opt_container")
      .find('input[type="checkbox"]');
    if (limit >= allBoxes.length) return;
    var checkedBoxes = allBoxes.filter(function () {
      return this.checked;
    });
    if (checked) {
      if (checkedBoxes.length >= limit)
        allBoxes
          .filter(function () {
            return !this.checked;
          })
          .attr("disabled", "disabled");
    } else allBoxes.prop("disabled", false);
  }
  function addTopAddRowBtnForRepeater() {
    jQuery('.frm_section_heading:has(div[class*="frm_repeat_"])').each(
      function () {
        var firstRepeatedSection = jQuery(this)
          .find('div[class*="frm_repeat_"]')
          .first()[0];
        var addButtonWrapper = document.createElement("div");
        addButtonWrapper.classList.add(
          "frm_form_field",
          "frm_hidden_container",
          "frm_repeat_buttons",
          "frm_hidden"
        );
        addButtonWrapper.append(
          firstRepeatedSection
            .querySelector(".frm_add_form_row")
            .cloneNode(true)
        );
        firstRepeatedSection.parentNode.insertBefore(
          addButtonWrapper,
          firstRepeatedSection
        );
      }
    );
  }
  function maybeDisableCheckboxesWithLimit() {
    jQuery('input[type="checkbox"][data-frmlimit]:not(:checked)').each(
      function () {
        var limit = parseInt(this.getAttribute("data-frmlimit"));
        if (!limit) return;
        var allBoxes = jQuery(this)
          .parents(".frm_opt_container")
          .find('input[type="checkbox"]');
        if (limit >= allBoxes.length) return;
        var checkedBoxes = allBoxes.filter(function () {
          return this.checked;
        });
        if (limit > checkedBoxes.length) return;
        this.setAttribute("disabled", "disabled");
      }
    );
  }
  function checkQuantityFieldMinMax(input) {
    var val = parseFloat(input.value ? input.value.trim() : 0),
      max = input.hasAttribute("max")
        ? parseFloat(input.getAttribute("max"))
        : 0,
      min = input.hasAttribute("min")
        ? parseFloat(input.getAttribute("min"))
        : 0;
    if (isNaN(val)) return 0;
    max = isNaN(max) ? 0 : max;
    min = isNaN(min) ? 0 : min < 0 ? 0 : min;
    if (val < min) {
      input.value = min;
      return min;
    }
    if (0 !== max && val > max) {
      input.value = max;
      return max;
    }
    return val;
  }
  function setHiddenProduct(input) {
    input.setAttribute("data-frmhidden", "1");
    triggerChange(jQuery(input));
  }
  function setHiddenProductContainer(container) {
    if (container.innerHTML.indexOf("data-frmprice") !== -1)
      jQuery(container)
        .find("input[data-frmprice], select:has([data-frmprice])")
        .attr("data-frmhidden", "1");
  }
  function setShownProduct(input) {
    var wasHidden = input.getAttribute("data-frmhidden");
    if (wasHidden !== null) {
      input.removeAttribute("data-frmhidden");
      triggerChange(jQuery(input));
    }
  }
  function calcProductsTotal(e) {
    var formTotals = [],
      totalFields;
    if (typeof __FRMCURR === "undefined") return;
    if (
      undefined !== e &&
      "undefined" !== typeof e.target &&
      ("keyup" === e.type || "change" === e.type)
    ) {
      var el = e.target;
      if (
        el.hasAttribute("data-frmprice") &&
        el instanceof HTMLInputElement &&
        "text" === el.type
      )
        el.setAttribute("data-frmprice", el.value.trim());
    }
    totalFields = jQuery("[data-frmtotal]");
    if (!totalFields.length) return;
    totalFields.each(function () {
      var currency,
        formId,
        formatted,
        total = 0,
        totalField = jQuery(this),
        $form = totalField.closest("form"),
        isRepeatingTotal = isRepeatingFieldByName(this.name);
      if (!$form.length) return;
      formId = $form.find('input[name="form_id"]').val();
      currency = getCurrency(formId);
      if (typeof formTotals[formId] !== "undefined" && !isRepeatingTotal)
        total = formTotals[formId];
      else {
        $form
          .find("input[data-frmprice],select:has([data-frmprice])")
          .each(function () {
            var quantity,
              $this,
              price = 0,
              isUserDef = false,
              isSingle = false;
            if (isRepeatingTotal && !isRepeatingWithTotal(this, totalField[0]))
              return;
            if (
              this.hasAttribute("data-frmhigherpg") ||
              isProductFieldHidden(this)
            )
              return;
            if (this.tagName === "SELECT") {
              if (this.selectedIndex !== -1)
                price =
                  this.options[this.selectedIndex].getAttribute(
                    "data-frmprice"
                  );
            } else {
              isUserDef = "text" === this.type;
              isSingle = "hidden" === this.type;
              $this = jQuery(this);
              if (!isUserDef && !isSingle && !$this.is(":checked")) return;
              price = this.getAttribute("data-frmprice");
            }
            if (!price) price = 0;
            else {
              price = preparePrice(price, currency);
              quantity = getQuantity(isUserDef, this);
              price = parseFloat(quantity) * parseFloat(price);
            }
            total += price;
          });
        if (!isRepeatingTotal) formTotals[formId] = total;
      }
      total = isNaN(total) ? 0 : total;
      currency.decimal_separator = currency.decimal_separator.trim();
      if (!currency.decimal_separator.length) currency.decimal_separator = ".";
      total = normalizeTotal(total, currency);
      totalField.val(total);
      triggerChange(totalField);
      total = formatCurrency(total, currency);
      formatted = totalField.prev(".frm_total_formatted");
      if (formatted.length < 1)
        formatted = totalField
          .closest(".frm_form_field")
          .find(".frm_total_formatted");
      if (formatted.length) formatted.php(total);
    });
  }
  function normalizeTotal(total, currency) {
    total =
      currency.decimals > 0
        ? Math.round10(total, currency.decimals)
        : Math.ceil(total);
    return maybeAddTrailingZeroToPrice(total, currency);
  }
  function formatCurrency(total, currency) {
    var leftSymbol, rightSymbol;
    total = maybeAddTrailingZeroToPrice(total, currency);
    total = maybeRemoveTrailingZerosFromPrice(total, currency);
    total = addThousands(total, currency);
    leftSymbol = currency.symbol_left + currency.symbol_padding;
    rightSymbol = currency.symbol_padding + currency.symbol_right;
    return leftSymbol + total + rightSymbol;
  }
  function maybeRemoveTrailingZerosFromPrice(total, currency) {
    var split = total.split(currency.decimal_separator);
    if (2 !== split.length || split[1].length <= currency.decimals)
      return total;
    if (0 === currency.decimals) return split[0];
    return (
      split[0] +
      currency.decimal_separator +
      split[1].substr(0, currency.decimals)
    );
  }
  function addRteRequiredMessages() {
    var keys, length, index, key, field;
    if ("undefined" === typeof __FRMRTEREQMESSAGES) return;
    keys = Object.keys(__FRMRTEREQMESSAGES);
    length = keys.length;
    for (index = 0; index < length; ++index) {
      key = keys[index];
      field = document.getElementById(key);
      if (field) field.setAttribute("data-reqmsg", __FRMRTEREQMESSAGES[key]);
    }
  }
  function isProductFieldHidden(input) {
    return input.getAttribute("data-frmhidden") !== null;
  }
  function isRepeatingWithTotal(input, total) {
    var regex = /item_meta\[.+?\]\[.+?\]/;
    return (
      isRepeatingFieldByName(input.name) &&
      total.name.match(regex)[0] === input.name.match(regex)[0]
    );
  }
  function getCurrency(formId) {
    if (
      typeof __FRMCURR !== "undefined" &&
      typeof __FRMCURR[formId] !== "undefined"
    )
      return __FRMCURR[formId];
  }
  function getQuantity(isUserDef, field) {
    var quantity,
      quantityFields,
      isRepeating,
      fieldID,
      $this = jQuery(field);
    fieldID = frmFrontForm.getFieldId(field, false);
    if (!fieldID) return 0;
    isRepeating = isRepeatingFieldByName(field.name);
    if (isRepeating) {
      var match = field.name.match(/item_meta\[.+?\]\[.+?\]/);
      if (null === match) return 0;
      $this.nameMatch = match[0];
    }
    quantity = getQuantityField($this, fieldID, isRepeating);
    if (quantity) quantity = checkQuantityFieldMinMax(quantity);
    else {
      quantityFields = getQuantityFields($this, isRepeating);
      if (
        1 === quantityFields.length &&
        "" === quantityFields[0].getAttribute("data-frmproduct").trim()
      )
        quantity = checkQuantityFieldMinMax(quantityFields[0]);
      else quantity = 1;
    }
    if (0 === quantity && isUserDef) quantity = 1;
    return quantity;
  }
  function getQuantityField(elementObj, fieldID, isRepeating) {
    var quantity,
      quantityFields = elementObj.closest("form").find("[data-frmproduct]");
    fieldID = fieldID.toString();
    quantityFields.each(function () {
      var ids;
      if (isRepeating && -1 === this.name.indexOf(elementObj.nameMatch))
        return true;
      ids = JSON.parse(this.getAttribute("data-frmproduct").trim());
      if ("" === ids) return true;
      ids = "string" === typeof ids ? [ids.toString()] : ids;
      if (ids.indexOf(fieldID) > -1) {
        quantity = this;
        return false;
      }
    });
    return quantity;
  }
  function getQuantityFields(elementObj, isRepeating) {
    var quantityFields;
    if (isRepeating)
      quantityFields = elementObj
        .closest("form")
        .find('[name^="' + elementObj.nameMatch + '"]' + "[data-frmproduct]");
    else
      quantityFields = elementObj
        .closest("form")
        .find('[data-frmproduct]:not([id*="-"])');
    return quantityFields;
  }
  function preparePrice(price, currency) {
    var matches;
    if (!price) return 0;
    price = price + "";
    matches = price.match(/[0-9,.]*\.?,?[0-9]+/g);
    if (null === matches) return 0;
    price = matches.length ? matches[matches.length - 1] : 0;
    if (price) {
      price = maybeUseDecimal(price, currency);
      price = price
        .replace(currency.thousand_separator, "")
        .replace(currency.decimal_separator, ".");
    }
    return price;
  }
  function maybeUseDecimal(amount, currency) {
    var usedForDecimal, amountParts;
    if (currency.thousand_separator == ".") {
      amountParts = amount.split(".");
      usedForDecimal = 2 == amountParts.length && 2 == amountParts[1].length;
      if (usedForDecimal)
        amount = amount.replace(".", currency.decimal_separator);
    }
    return amount;
  }
  function maybeAddTrailingZeroToPrice(price, currency) {
    if ("number" !== typeof price) return price;
    price += "";
    var pos = price.indexOf(".");
    if (pos === -1) price = price + ".00";
    else if (price.substring(pos + 1).length < 2) price += "0";
    return price.replace(".", currency.decimal_separator);
  }
  function addThousands(total, currency) {
    if (currency.thousand_separator)
      total = total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousand_separator);
    return total;
  }
  function setAutoHeightForTextArea() {
    document
      .querySelectorAll(".frm-show-form textarea")
      .forEach(function (element) {
        var minHeight, callback;
        if (
          typeof element.dataset.autoGrow === "undefined" ||
          element.getAttribute("frm-autogrow")
        )
          return;
        minHeight = getElementHeight(element);
        element.style.overflowY = "hidden";
        element.style.transition = "none";
        callback = function () {
          adjustHeight(element, minHeight);
        };
        callback();
        element.addEventListener("input", callback);
        window.addEventListener("resize", callback);
        document.addEventListener("frmShowField", callback);
        element.setAttribute("frm-autogrow", 1);
      });
  }
  function getElementHeight(element) {
    var clone, container, height;
    clone = element.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = "-10000px";
    clone.style.top = "-10000px";
    container = jQuery(element).closest(".frm_forms").get(0);
    container.appendChild(clone);
    height = clone.clientHeight;
    container.removeChild(clone);
    return height;
  }
  function adjustHeight(el, minHeight) {
    if (minHeight >= el.scrollHeight) return;
    el.style.height = 0;
    el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
  }
  function updateContentLength() {
    function onChange(e) {
      var length,
        max,
        type,
        messageEl = e.target.nextElementSibling,
        countEl = messageEl.querySelector("span");
      if (!countEl) return;
      type = messageEl.getAttribute("data-max-type");
      max = parseInt(messageEl.getAttribute("data-max"));
      if ("word" === type)
        length = e.target.value.split(/\s+/).filter(function (word) {
          return word;
        }).length;
      else length = e.target.value.length;
      countEl.innerText = length;
      messageEl.classList.toggle("frm_limit_error", length > max);
    }
    document.addEventListener(
      "input",
      function (e) {
        var target;
        for (
          target = e.target;
          target && target != this;
          target = target.parentNode
        )
          if (
            target.matches("textarea") &&
            target.nextElementSibling &&
            target.nextElementSibling.matches(".frm_pro_max_limit_desc")
          ) {
            onChange(e);
            break;
          }
      },
      false
    );
  }
  function triggerEvent(element, eventType, data) {
    var event;
    if ("function" === typeof frmFrontForm.triggerCustomEvent) {
      frmFrontForm.triggerCustomEvent(element, eventType, data);
      return;
    }
    if (typeof window.CustomEvent === "function")
      event = new CustomEvent(eventType);
    else if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventType, false, true);
    } else return;
    event.frmData = data;
    element.dispatchEvent(event);
  }
  function startOverButton() {
    function getInputs(formEl) {
      return getInputsInFieldOnPage(formEl);
    }
    function resetInputs(formEl) {
      var inputs = getInputs(formEl);
      function resetRepeater(repeatBtns) {
        var repeater, items;
        repeater = repeatBtns.parentElement;
        items = repeater.querySelectorAll(
          ".frm_repeat_sec, .frm_repeat_inline, .frm_repeat_grid"
        );
        if (!items.length) {
          currentlyAddingRow = false;
          repeatBtns.querySelector(".frm_add_form_row").click();
        } else if (items.length > 1)
          items.forEach(function (item, index) {
            if (index) item.parentElement.removeChild(item);
          });
      }
      formEl
        .querySelectorAll(".frm_section_heading > .frm_repeat_buttons")
        .forEach(resetRepeater);
      clearValueForInputs(inputs, "", true);
      inputs.forEach(function (input) {
        if (input.disabled && input.getAttribute("data-frmlimit"))
          input.removeAttribute("disabled");
      });
    }
    function isMultiPagesForm(formId) {
      return (
        document.getElementById("frm_page_order_" + formId) ||
        document.querySelector(
          "#frm_form_" + formId + '_container input[name="frm_next_page"]'
        )
      );
    }
    function reloadForm(formId, formEl) {
      formEl.classList.add("frm_loading_form");
      postToAjaxUrl(
        formEl,
        { action: "frm_load_form", form: formId, _ajax_nonce: frm_js.nonce },
        function (response) {
          var idValueMapping;
          if (!response.success) {
            console.log(response);
            return;
          }
          idValueMapping = getDefaultValuesFromForm(formEl);
          jQuery(formEl.closest(".frm_forms")).replaceWith(response.data);
          setDefaultValues(idValueMapping);
          maybeShowMoreStepsButton();
          if ("undefined" !== typeof __frmAjaxDropzone)
            window.__frmDropzone = __frmAjaxDropzone;
          checkConditionalLogic("pageLoad");
          checkFieldsOnPage("frm_form_" + formId + "_container");
          triggerCompletedEvent(formId);
        },
        function (response) {
          console.log(response);
        }
      );
    }
    function getDefaultValuesFromForm(formEl) {
      var inputs,
        values = {};
      inputs = formEl.querySelectorAll("[data-frmval]");
      inputs.forEach(function (input) {
        values[input.id] = input.getAttribute("data-frmval");
      });
      return values;
    }
    function setDefaultValues(idValueMapping) {
      Object.keys(idValueMapping).forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        input.setAttribute("data-frmval", idValueMapping[id]);
        if ("checkbox" === input.type || "radio" === input.type) {
          if (input.value === idValueMapping[id]) input.checked = true;
          return;
        }
        input.value = idValueMapping[id];
      });
    }
    function hasSaveDraft(formEl) {
      return !!formEl.querySelector(".frm_save_draft");
    }
    function deleteDraft(formId, formEl) {
      postToAjaxUrl(formEl, {
        action: "frm_delete_draft_entry",
        form: formId,
        _ajax_nonce: frm_js.nonce,
      });
    }
    function onClickStartOver(e) {
      e.preventDefault();
      var formEl, formId, draftIdInput;
      formEl = e.target.closest("form");
      if (!formEl) return;
      formId = formEl.querySelector('input[name="form_id"]').value;
      if (hasSaveDraft(formEl)) {
        deleteDraft(formId, formEl);
        draftIdInput = formEl.querySelector('input[name="id"]');
        if (draftIdInput) draftIdInput.remove();
        formEl.querySelector('input[name="frm_action"]').value = "create";
      }
      if (isMultiPagesForm(formId)) reloadForm(formId, formEl);
      else {
        resetInputs(formEl);
        triggerCompletedEvent(formId);
      }
    }
    function triggerCompletedEvent(formId) {
      triggerEvent(document, "frm_after_start_over", { formId: formId });
    }
    document.addEventListener(
      "click",
      function (e) {
        var target;
        for (
          target = e.target;
          target && target != this;
          target = target.parentNode
        )
          if (target.matches(".frm_start_over")) {
            onClickStartOver.call(target, e);
            break;
          }
      },
      false
    );
  }
  function maybeShowMoreStepsButton() {
    var i,
      listWrappers,
      listWrapper,
      rootlineSteps,
      wrappingElementsCount,
      startIndex,
      hiddenSteps,
      showMoreButtonLi,
      showMoreButton,
      hiddenStepsWrapper,
      oldIE;
    listWrappers = document.getElementsByClassName("frm_rootline");
    copyRootlines(listWrappers);
    oldIE = isOldIEVersion(10);
    for (i = 0; i < listWrappers.length; i++) {
      listWrapper = listWrappers[i];
      if (oldIE) {
        listWrapper.className += " frm_hidden";
        continue;
      }
      rootlineSteps = listWrapper.children;
      wrappingElementsCount = countOverflowPages(rootlineSteps);
      if (!wrappingElementsCount) continue;
      showMoreButton = listWrapper.querySelector(".frm_rootline_show_more_btn");
      if (!showMoreButton) continue;
      showMoreButton.addEventListener("click", showMoreSteps);
      showMoreButtonLi = showMoreButton.parentNode;
      showMoreButtonLi.className = showMoreButtonLi.className.replace(
        " frm_hidden",
        ""
      );
      startIndex =
        rootlineSteps.length - wrappingElementsCount > 1
          ? rootlineSteps.length - wrappingElementsCount - 3
          : 0;
      hiddenSteps = [].slice.call(
        rootlineSteps,
        Math.max(startIndex, 1),
        rootlineSteps.length - 2
      );
      hiddenStepsWrapper = showMoreButtonLi.querySelector(
        ".frm_rootline_hidden_steps"
      );
      hiddenSteps.forEach(function (hiddenStep) {
        hiddenStepsWrapper.appendChild(hiddenStep);
      });
      moveRootlineTitles(hiddenStepsWrapper, listWrapper, showMoreButton);
      listWrapper.insertBefore(
        showMoreButtonLi,
        listWrapper.children[listWrapper.children.length - 1]
      );
      if (
        listWrapper.children[listWrapper.children.length - 1].className.indexOf(
          "frm_current_page"
        ) !== -1
      )
        updateRootlineStyle(hiddenStepsWrapper);
    }
  }
  function isOldIEVersion(max) {
    var version,
      myNav = navigator.userAgent.toLowerCase();
    version =
      myNav.indexOf("msie") !== -1 ? parseInt(myNav.split("msie")[1]) : false;
    return version !== false && max >= version;
  }
  function countOverflowPages(rootlineSteps) {
    var j,
      wrappingElementsCount = 0;
    for (j = 0; j < rootlineSteps.length; j++)
      if (
        rootlineSteps[j].offsetTop !== rootlineSteps[0].offsetTop &&
        rootlineSteps[j].className.indexOf(
          "frm_rootline_show_hidden_steps_btn"
        ) === -1
      )
        wrappingElementsCount++;
    return wrappingElementsCount;
  }
  function moveRootlineTitles(hiddenStepsWrapper, listWrapper, showMoreButton) {
    var currentPageTitle,
      currentStepTitle,
      rootlineGroup,
      activeHiddenStepLink = hiddenStepsWrapper.querySelector(
        "input:not(.frm_page_back):not(.frm_page_skip)"
      );
    if (activeHiddenStepLink) {
      currentPageTitle = activeHiddenStepLink.parentElement.querySelector(
        ".frm_rootline_title"
      );
      maybeUpdateRootlineTitles(
        activeHiddenStepLink.parentElement.previousElementSibling,
        hiddenStepsWrapper
      );
      showMoreButton.parentElement.className += " active";
      showMoreButton.className += " active";
    } else
      currentPageTitle = listWrapper
        .querySelector(".frm_current_page")
        .querySelector(".frm_rootline_title");
    if (!currentPageTitle) return;
    currentStepTitle = currentPageTitle.textContent;
    if (!currentStepTitle) return;
    rootlineGroup = listWrapper.closest(".frm_rootline_group");
    showCurrentHiddenStepText(currentStepTitle);
  }
  function showCurrentHiddenStepText(currentStepTitle) {
    var rootlineCurrentStep = document.createElement("span");
    rootlineCurrentStep.className = "frm_rootline_title";
    rootlineCurrentStep.textContent = currentStepTitle;
    document
      .querySelector(".frm_rootline_show_hidden_steps_btn")
      .appendChild(rootlineCurrentStep);
  }
  function copyRootlines(listWrappers) {
    var i, listWrappers, listWrapper, rootlinesBackup;
    rootlinesBackup = {};
    for (i = 0; i < listWrappers.length; i++) {
      listWrapper = listWrappers[i];
      rootlinesBackup[listWrapper.closest("form").getAttribute("id")] =
        listWrapper.cloneNode(true);
    }
    listWrappersOriginal = rootlinesBackup;
  }
  function maybeUpdateRootlineTitles(previousPageLink, hiddenStepsWrapper) {
    var i;
    if (previousPageLink) {
      i = 0;
      while (previousPageLink) {
        i++;
        previousPageLink = previousPageLink.previousElementSibling;
      }
      updateRootlineStyle(hiddenStepsWrapper, i);
    }
  }
  function updateRootlineStyle(hiddenStepsWrapper, uptoIndex) {
    var rootlineTitles, rootlineTitle;
    if (!uptoIndex) uptoIndex = hiddenStepsWrapper.children.length;
    rootlineTitles = [].slice.call(hiddenStepsWrapper.children, 0, uptoIndex);
    rootlineTitles.forEach(function (el) {
      rootlineTitle = el.querySelector(".frm_rootline_title");
      if (rootlineTitle) rootlineTitle.className += " frm_prev_page_title";
    });
  }
  function showMoreSteps(e) {
    var hiddenStepsWrapper = e.target.parentElement.querySelector("ul");
    if (hiddenStepsWrapper.className.indexOf("frm_hidden") > -1)
      hiddenStepsWrapper.className = hiddenStepsWrapper.className.replace(
        " frm_hidden",
        ""
      );
    else hiddenStepsWrapper.className += " frm_hidden";
  }
  function maybeAddPolyfills() {
    if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.msMatchesSelector;
    if (!Element.prototype.closest)
      Element.prototype.closest = function (s) {
        var el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    (function (arr) {
      arr.forEach(function (item) {
        if (item.hasOwnProperty("remove")) return;
        Object.defineProperty(item, "remove", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            this.parentNode.removeChild(this);
          },
        });
      });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
    if (window.NodeList && !NodeList.prototype.forEach)
      NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++)
          callback.call(thisArg, this[i], i, this);
      };
  }
  function validateFieldValue() {
    document.addEventListener("frm_validate_field_value", function (event) {
      if (
        "object" !== typeof event.frmData.field ||
        "object" !== typeof event.frmData.errors
      )
        return;
      if ("password" === event.frmData.field.type)
        validatePasswordStrength(event.frmData.field, event.frmData.errors);
    });
  }
  function validatePasswordStrength(field, errors) {
    var check, regex, checks;
    if ("object" !== typeof window.frm_password_checks) return;
    if (
      -1 === field.className.indexOf("frm_strong_pass") ||
      0 === field.id.indexOf("field_conf_")
    )
      return;
    checks = window.frm_password_checks;
    for (check in checks) {
      regex = checks[check].regex.slice(1, checks[check].regex.length - 1);
      regex = new RegExp(regex);
      if (!regex.test(field.value)) {
        errors[frmFrontForm.getFieldId(field)] = checks[check].message;
        return;
      }
    }
  }
  function maybeTriggerCalc(event) {
    if (
      event.persisted ||
      (window.performance &&
        window.performance.getEntriesByType("navigation")[0].type ===
          "back_forward")
    )
      triggerCalc();
  }
  function showMoreStepsButtonEvents() {
    var timeout;
    window.addEventListener("resize", function () {
      var i, listWrappers, listWrapper, form;
      listWrappers = document.getElementsByClassName("frm_rootline");
      for (i = 0; i < listWrappers.length; i++) {
        listWrapper = listWrappers[i];
        form = listWrapper.closest("form");
        form
          .querySelector(".frm_rootline_group")
          .replaceChild(
            listWrappersOriginal[form.getAttribute("id")],
            listWrapper
          );
      }
      clearTimeout(timeout);
      timeout = setTimeout(maybeShowMoreStepsButton(), 100);
    });
  }
  function handleShowPasswordBtn() {
    documentOn("click", ".frm_show_password_btn", function (event) {
      var input = event.target
          .closest(".frm_show_password_wrapper")
          .querySelector("input"),
        button = input.nextElementSibling;
      if ("password" === input.type) {
        input.type = "text";
        button.setAttribute("data-show-password-label", button.title);
        button.title = button.getAttribute("data-hide-password-label");
      } else {
        input.type = "password";
        button.title = button.getAttribute("data-show-password-label");
      }
      button.setAttribute("aria-label", button.title);
    });
  }
  function documentOn(event, selector, handler, options) {
    if ("undefined" === typeof options) options = false;
    document.addEventListener(
      event,
      function (e) {
        var target;
        for (
          target = e.target;
          target && target != this;
          target = target.parentNode
        )
          if (target && target.matches && target.matches(selector)) {
            handler.call(target, e);
            break;
          }
      },
      options
    );
  }
  function handleElementorPopupConflicts() {
    var elementorPopupWrapper = document.querySelector(
      ".elementor-popup-modal"
    );
    if (null !== elementorPopupWrapper) {
      elementorPopupWrapper
        .querySelectorAll(".frm_dropzone")
        .forEach(function (item) {
          item.classList.remove("dz-clickable");
        });
      elementorPopupWrapper
        .querySelectorAll(".frm_form_field .chosen-container")
        .forEach(function (chosenContainer) {
          chosenContainer.remove();
        });
    }
    loadDropzones();
    loadAutocomplete();
  }
  function getAllFormClasses(input) {
    var formContainer, formClasses;
    formContainer = input.closest(".with_frm_style");
    if (!formContainer) return [];
    formClasses = [];
    Array.prototype.forEach.call(
      formContainer.className.split(" "),
      function (className) {
        var trimmedClassName = className.trim();
        if ("" !== trimmedClassName && "frm_forms" !== trimmedClassName)
          formClasses.push(trimmedClassName);
      }
    );
    return formClasses;
  }
  return {
    init: function () {
      maybeAddPolyfills();
      addEventListener("pageshow", maybeTriggerCalc);
      jQuery(document).on("frmFormComplete", afterFormSubmitted);
      jQuery(document).on("frmPageChanged", afterPageChanged);
      jQuery(document).on(
        "frmAfterAddRow frmAfterRemoveRow",
        calcProductsTotal
      );
      jQuery(document).on("click", ".frm_trigger", toggleSection);
      jQuery(document).on("keydown", ".frm_trigger", toggleSection);
      var $blankField = jQuery(".frm_blank_field");
      if ($blankField.length)
        $blankField
          .closest(".frm_toggle_container")
          .prev(".frm_trigger")
          .trigger("click");
      jQuery(document).on("click", ".frm_remove_link", removeFile);
      jQuery(document).on("focusin", "input[data-frmmask]", function () {
        jQuery(this).mask(jQuery(this).data("frmmask").toString(), {
          autoclear: false,
        });
      });
      jQuery(document).on("frmFieldChanged", maybeCheckDependent);
      jQuery(document).on(
        "keyup",
        "input.frm_strength_meter",
        checkPasswordField
      );
      jQuery(document).on("keydown", ".frm_switch", triggerToggleClickOnSpace);
      jQuery(document).on(
        "mouseenter click",
        ".frm-star-group input",
        loadStars
      );
      jQuery(document).on(
        "mouseenter",
        ".frm-star-group .star-rating:not(.star-rating-readonly)",
        hoverStars
      );
      jQuery(document).on(
        "mouseleave",
        ".frm-star-group .star-rating:not(.star-rating-readonly)",
        unhoverStars
      );
      jQuery(document).on(
        "click",
        '.frm-show-form input[type="submit"], .frm-show-form input[name="frm_prev_page"], .frm_page_back, .frm_page_skip, .frm-show-form .frm_save_draft, .frm_prev_page, .frm_button_submit, .frm_rootline_show_hidden_steps_btn .frm_rootline_single',
        setNextPage
      );
      jQuery(document).on(
        "change",
        '.frm_other_container input[type="checkbox"], .frm_other_container input[type="radio"], .frm_other_container select',
        showOtherText
      );
      jQuery(document).on(
        "change",
        '.frm_switch_block input[type="checkbox"]',
        setToggleAriaChecked
      );
      jQuery(document).on("click", ".frm_remove_form_row", removeRow);
      jQuery(document).on("click", ".frm_add_form_row", addRow);
      jQuery(".frm_edit_link_container").on(
        "click",
        "a.frm_inplace_edit",
        editEntry
      );
      jQuery(".frm_edit_link_container").on(
        "click",
        "a.frm_cancel_edit",
        cancelEdit
      );
      jQuery(document).on("click", ".frm_ajax_delete", deleteEntry);
      jQuery(".frm_month_heading, .frm_year_heading").on("click", function () {
        var content = jQuery(this).children(
          ".ui-icon-triangle-1-e, .ui-icon-triangle-1-s"
        );
        if (content.hasClass("ui-icon-triangle-1-e")) {
          content
            .addClass("ui-icon-triangle-1-s")
            .removeClass("ui-icon-triangle-1-e");
          jQuery(this).next(".frm_toggle_container").fadeIn("slow");
        } else {
          content
            .addClass("ui-icon-triangle-1-e")
            .removeClass("ui-icon-triangle-1-s");
          jQuery(this).next(".frm_toggle_container").hide();
        }
      });
      jQuery(document).on(
        "elementor/popup/show",
        handleElementorPopupConflicts
      );
      addTopAddRowBtnForRepeater();
      jQuery(document).on(
        "click",
        'input[type="checkbox"][data-frmlimit]',
        checkCheckboxSelectionLimit
      );
      jQuery(document).on(
        "change",
        '[type="checkbox"][data-frmprice],[type="radio"][data-frmprice],[type="hidden"][data-frmprice],select:has([data-frmprice])',
        calcProductsTotal
      );
      jQuery(document).on(
        "keyup change",
        '[data-frmproduct],[type="text"][data-frmprice]',
        calcProductsTotal
      );
      jQuery(document).on(
        "frmFormComplete frmPageChanged frmInPlaceEdit frmAfterAddRow",
        setAutoHeightForTextArea
      );
      maybeDisableCheckboxesWithLimit();
      setInlineFormWidth();
      checkConditionalLogic("pageLoad");
      checkFieldsOnPage(undefined, "pageLoad");
      processPendingAjax();
      addRteRequiredMessages();
      setAutoHeightForTextArea();
      updateContentLength();
      calcProductsTotal();
      startOverButton();
      maybeShowMoreStepsButton();
      showMoreStepsButtonEvents();
      validateFieldValue();
      handleShowPasswordBtn();
    },
    savingDraft: function (object) {
      return savingDraftEntry(object);
    },
    goingToPreviousPage: function (object) {
      return goingToPrevPage(object);
    },
    hideOrShowFields: function (ids, event) {
      if ("pageLoad" === event) clearHideFields();
      var len = ids.length,
        repeatArgs = { repeatingSection: "", repeatRow: "" };
      for (var i = 0, l = len; i < l; i++) {
        hideOrShowFieldById(ids[i], repeatArgs);
        if (i == l - 1) showForm();
      }
    },
    hidePreviouslyHiddenFields: function () {
      var hiddenFields = getAllHiddenFields(),
        len = hiddenFields.length;
      for (var i = 0, l = len; i < l; i++) {
        var container = document.getElementById(hiddenFields[i]);
        if (container == null) {
          container = document.querySelector("#" + hiddenFields[i]);
          if (
            container != null &&
            hiddenFields[i].indexOf("frm_final_submit") > -1
          ) {
            hidePreviouslyHiddenSubmitButton(hiddenFields[i]);
            continue;
          }
        }
        if (container !== null) {
          container.style.display = "none";
          setHiddenProductContainer(container);
        }
      }
    },

    checkDependentDynamicFields: function (ids) {
      var len = ids.length,
        repeatArgs = { repeatingSection: "", repeatRow: "" };
      for (var i = 0, l = len; i < l; i++)
        hideOrShowFieldById(ids[i], repeatArgs);
    },
    checkDependentLookupFields: function (ids) {
      var fieldId,
        repeatArgs = { repeatingSection: "", repeatRow: "" };
      for (var i = 0, l = ids.length; i < l; i++) {
        fieldId = ids[i];
        updateWatchingFieldById(fieldId, repeatArgs, "value changed");
      }
    },
    loadGoogle: function () {
      var graphs, packages, i;
      if (typeof google === "undefined" || !google || !google.load) {
        setTimeout(frmProForm.loadGoogle, 30);
        return;
      }
      graphs = __FRMTABLES;
      packages = Object.keys(graphs);
      for (i = 0; i < packages.length; i++)
        if (packages[i] === "graphs") generateGoogleGraphs(graphs[packages[i]]);
        else generateGoogleTables(graphs[packages[i]], packages[i]);
    },
    removeUsedTimes: function (obj, timeField) {
      var $form, form, e, data, success, extraParams;
      $form = jQuery(obj).parents("form").first();
      form = $form.get(0);
      e = $form.find('input[name="id"]');
      data = {
        action: "frm_fields_ajax_time_options",
        time_field: timeField,
        date_field: obj.id,
        entry_id: e ? e.val() : "",
        date: jQuery(obj).val(),
        nonce: frm_js.nonce,
      };
      success = function (opts) {
        var $timeField = jQuery(document.getElementById(timeField));
        $timeField.find("option").prop("disabled", false);
        if (opts.length > 0)
          for (var i = 0, l = opts.length; i < l; i++)
            $timeField
              .get(0)
              .querySelectorAll('option[value="' + opts[i] + '"]')
              .forEach(function (option) {
                option.disabled = true;
                if (option.selected) option.selected = false;
              });
      };
      extraParams = { dataType: "json" };
      postToAjaxUrl(form, data, success, false, extraParams);
    },
    changeRte: function (editor) {
      editor.on("change", function () {
        var content = editor.getBody().innerHTML;
        jQuery("#" + editor.id)
          .val(content)
          .trigger("change");
      });
    },
    addFormidableClassToDatepicker: function (_, options) {
      if (options.dpDiv) {
        Array.prototype.forEach.call(
          getAllFormClasses(options.input.get(0)),
          function (formClass) {
            options.dpDiv.get(0).classList.add(formClass);
          }
        );
        options.dpDiv.addClass("frm-datepicker");
        options.dpDiv.get(0).setAttribute("is-formidable-datepicker", 1);
      }
      return options;
    },
    removeFormidableClassFromDatepicker: function (_, options) {
      var dpDiv;
      if (options.dpDiv) {
        dpDiv = options.dpDiv.get(0);
        dpDiv.removeAttribute("is-formidable-datepicker");
        setTimeout(function () {
          if (dpDiv.hasAttribute("is-formidable-datepicker")) return;
          Array.prototype.forEach.call(
            getAllFormClasses(options.input.get(0)),
            function (formClass) {
              options.dpDiv.get(0).classList.remove(formClass);
            }
          );
          jQuery(dpDiv).removeClass("frm-datepicker");
        }, 400);
      }
    },
  };
}
var frmProForm = frmProFormJS();
jQuery(document).ready(function () {
  frmProForm.init();
});
(function () {
  if (!Math.round10)
    Math.round10 = function (value, decimals) {
      return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    };
})();
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).SlimSelect =
        e());
})(this, function () {
  "use strict";
  function t() {
    return Math.random().toString(36).substring(2, 10);
  }
  function e(t, e = 50, s = !1) {
    let i;
    return function (...n) {
      const a = self,
        l = s && !i;
      clearTimeout(i),
        (i = setTimeout(() => {
          (i = null), s || t.apply(a, n);
        }, e)),
        l && t.apply(a, n);
    };
  }
  function s(t, e) {
    return JSON.stringify(t) === JSON.stringify(e);
  }
  class i {
    constructor(e) {
      (this.id = ""),
        (this.style = ""),
        (this.class = []),
        (this.isMultiple = !1),
        (this.isOpen = !1),
        (this.isFullOpen = !1),
        (this.intervalMove = null),
        e || (e = {}),
        (this.id = "ss-" + t()),
        (this.style = e.style || ""),
        (this.class = e.class || []),
        (this.disabled = void 0 !== e.disabled && e.disabled),
        (this.alwaysOpen = void 0 !== e.alwaysOpen && e.alwaysOpen),
        (this.showSearch = void 0 === e.showSearch || e.showSearch),
        (this.ariaLabel = e.ariaLabel || "Combobox"),
        (this.searchPlaceholder = e.searchPlaceholder || "Search"),
        (this.searchText = e.searchText || "No Results"),
        (this.searchingText = e.searchingText || "Searching..."),
        (this.searchHighlight =
          void 0 !== e.searchHighlight && e.searchHighlight),
        (this.closeOnSelect = void 0 === e.closeOnSelect || e.closeOnSelect),
        (this.contentLocation = e.contentLocation || document.body),
        (this.contentPosition = e.contentPosition || "absolute"),
        (this.openPosition = e.openPosition || "auto"),
        (this.placeholderText =
          void 0 !== e.placeholderText ? e.placeholderText : "Select Value"),
        (this.allowDeselect = void 0 !== e.allowDeselect && e.allowDeselect),
        (this.hideSelected = void 0 !== e.hideSelected && e.hideSelected),
        (this.showOptionTooltips =
          void 0 !== e.showOptionTooltips && e.showOptionTooltips),
        (this.minSelected = e.minSelected || 0),
        (this.maxSelected = e.maxSelected || 1e3),
        (this.timeoutDelay = e.timeoutDelay || 200),
        (this.maxValuesShown = e.maxValuesShown || 20),
        (this.maxValuesMessage = e.maxValuesMessage || "{number} selected");
    }
  }
  class n {
    constructor(e) {
      if (
        ((this.id = e.id && "" !== e.id ? e.id : t()),
        (this.label = e.label || ""),
        (this.selectAll = void 0 !== e.selectAll && e.selectAll),
        (this.selectAllText = e.selectAllText || "Select All"),
        (this.closable = e.closable || "off"),
        (this.options = []),
        e.options)
      )
        for (const t of e.options) this.options.push(new a(t));
    }
  }
  class a {
    constructor(e) {
      (this.id = e.id && "" !== e.id ? e.id : t()),
        (this.value = void 0 === e.value ? e.text : e.value),
        (this.text = e.text || ""),
        (this.php = e.php || ""),
        (this.selected = void 0 !== e.selected && e.selected),
        (this.display = void 0 === e.display || e.display),
        (this.disabled = void 0 !== e.disabled && e.disabled),
        (this.mandatory = void 0 !== e.mandatory && e.mandatory),
        (this.placeholder = void 0 !== e.placeholder && e.placeholder),
        (this.class = e.class || ""),
        (this.style = e.style || ""),
        (this.data = e.data || {});
    }
  }
  class l {
    constructor(t, e) {
      (this.selectType = "single"),
        (this.data = []),
        (this.selectType = t),
        this.setData(e);
    }
    validateDataArray(t) {
      if (!Array.isArray(t)) return new Error("Data must be an array");
      for (let e of t) {
        if (!(e instanceof n || "label" in e))
          return e instanceof a || "text" in e
            ? this.validateOption(e)
            : new Error("Data object must be a valid optgroup or option");
        if (!("label" in e)) return new Error("Optgroup must have a label");
        if ("options" in e && e.options)
          for (let t of e.options) return this.validateOption(t);
      }
      return null;
    }
    validateOption(t) {
      return "text" in t ? null : new Error("Option must have a text");
    }
    partialToFullData(t) {
      let e = [];
      return (
        t.forEach((t) => {
          if (t instanceof n || "label" in t) {
            let s = [];
            "options" in t &&
              t.options &&
              t.options.forEach((t) => {
                s.push(new a(t));
              }),
              s.length > 0 && e.push(new n(t));
          }
          (t instanceof a || "text" in t) && e.push(new a(t));
        }),
        e
      );
    }
    setData(t) {
      (this.data = this.partialToFullData(t)),
        "single" === this.selectType &&
          this.setSelectedBy("value", this.getSelected());
    }
    getData() {
      return this.filter(null, !0);
    }
    getDataOptions() {
      return this.filter(null, !1);
    }
    addOption(t) {
      this.setData(this.getData().concat(new a(t)));
    }
    setSelectedBy(t, e) {
      let s = null,
        i = !1;
      for (let l of this.data) {
        if (l instanceof n)
          for (let n of l.options)
            s || (s = n),
              (n.selected = !i && e.includes(n[t])),
              n.selected && "single" === this.selectType && (i = !0);
        l instanceof a &&
          (s || (s = l),
          (l.selected = !i && e.includes(l[t])),
          l.selected && "single" === this.selectType && (i = !0));
      }
      "single" === this.selectType && s && !i && (s.selected = !0);
    }
    getSelected() {
      let t = this.getSelectedOptions(),
        e = [];
      return (
        t.forEach((t) => {
          e.push(t.value);
        }),
        e
      );
    }
    getSelectedOptions() {
      return this.filter((t) => t.selected, !1);
    }
    getSelectedIDs() {
      let t = this.getSelectedOptions(),
        e = [];
      return (
        t.forEach((t) => {
          e.push(t.id);
        }),
        e
      );
    }
    getOptgroupByID(t) {
      for (let e of this.data) if (e instanceof n && e.id === t) return e;
      return null;
    }
    getOptionByID(t) {
      let e = this.filter((e) => e.id === t, !1);
      return e.length ? e[0] : null;
    }
    getSelectType() {
      return this.selectType;
    }
    getFirstOption() {
      let t = null;
      for (let e of this.data)
        if (
          (e instanceof n ? (t = e.options[0]) : e instanceof a && (t = e), t)
        )
          break;
      return t;
    }
    search(t, e) {
      return "" === (t = t.trim())
        ? this.getData()
        : this.filter((s) => e(s, t), !0);
    }
    filter(t, e) {
      const s = [];
      return (
        this.data.forEach((i) => {
          if (i instanceof n) {
            let l = [];
            if (
              (i.options.forEach((i) => {
                (t && !t(i)) || (e ? l.push(new a(i)) : s.push(new a(i)));
              }),
              l.length > 0)
            ) {
              let t = new n(i);
              (t.options = l), s.push(t);
            }
          }
          i instanceof a && ((t && !t(i)) || s.push(new a(i)));
        }),
        s
      );
    }
  }
  class o {
    constructor(t, e, s) {
      (this.classes = {
        main: "ss-main",
        placeholder: "ss-placeholder",
        values: "ss-values",
        single: "ss-single",
        max: "ss-max",
        value: "ss-value",
        valueText: "ss-value-text",
        valueDelete: "ss-value-delete",
        valueOut: "ss-value-out",
        deselect: "ss-deselect",
        deselectPath: "M10,10 L90,90 M10,90 L90,10",
        arrow: "ss-arrow",
        arrowClose: "M10,30 L50,70 L90,30",
        arrowOpen: "M10,70 L50,30 L90,70",
        content: "ss-content",
        openAbove: "ss-open-above",
        openBelow: "ss-open-below",
        search: "ss-search",
        searchHighlighter: "ss-search-highlight",
        searching: "ss-searching",
        addable: "ss-addable",
        addablePath: "M50,10 L50,90 M10,50 L90,50",
        list: "ss-list",
        optgroup: "ss-optgroup",
        optgroupLabel: "ss-optgroup-label",
        optgroupLabelText: "ss-optgroup-label-text",
        optgroupActions: "ss-optgroup-actions",
        optgroupSelectAll: "ss-selectall",
        optgroupSelectAllBox: "M60,10 L10,10 L10,90 L90,90 L90,50",
        optgroupSelectAllCheck: "M30,45 L50,70 L90,10",
        optgroupClosable: "ss-closable",
        option: "ss-option",
        optionDelete: "M10,10 L90,90 M10,90 L90,10",
        highlighted: "ss-highlighted",
        open: "ss-open",
        close: "ss-close",
        selected: "ss-selected",
        error: "ss-error",
        disabled: "ss-disabled",
        hide: "ss-hide",
      }),
        (this.store = e),
        (this.settings = t),
        (this.callbacks = s),
        (this.main = this.mainDiv()),
        (this.content = this.contentDiv()),
        this.updateClassStyles(),
        this.updateAriaAttributes(),
        this.settings.contentLocation.appendChild(this.content.main);
    }
    enable() {
      this.main.main.classList.remove(this.classes.disabled),
        (this.content.search.input.disabled = !1);
    }
    disable() {
      this.main.main.classList.add(this.classes.disabled),
        (this.content.search.input.disabled = !0);
    }
    open() {
      this.main.arrow.path.setAttribute("d", this.classes.arrowOpen),
        this.main.main.classList.add(
          "up" === this.settings.openPosition
            ? this.classes.openAbove
            : this.classes.openBelow
        ),
        this.main.main.setAttribute("aria-expanded", "true"),
        this.moveContent();
      const t = this.store.getSelectedOptions();
      if (t.length) {
        const e = t[t.length - 1].id,
          s = this.content.list.querySelector('[data-id="' + e + '"]');
        s && this.ensureElementInView(this.content.list, s);
      }
    }
    close() {
      this.main.main.classList.remove(this.classes.openAbove),
        this.main.main.classList.remove(this.classes.openBelow),
        this.main.main.setAttribute("aria-expanded", "false"),
        this.content.main.classList.remove(this.classes.openAbove),
        this.content.main.classList.remove(this.classes.openBelow),
        this.main.arrow.path.setAttribute("d", this.classes.arrowClose);
    }
    updateClassStyles() {
      if (
        ((this.main.main.className = ""),
        this.main.main.removeAttribute("style"),
        (this.content.main.className = ""),
        this.content.main.removeAttribute("style"),
        this.main.main.classList.add(this.classes.main),
        this.content.main.classList.add(this.classes.content),
        "" !== this.settings.style &&
          ((this.main.main.style.cssText = this.settings.style),
          (this.content.main.style.cssText = this.settings.style)),
        this.settings.class.length)
      )
        for (const t of this.settings.class)
          "" !== t.trim() &&
            (this.main.main.classList.add(t.trim()),
            this.content.main.classList.add(t.trim()));
      "relative" === this.settings.contentPosition &&
        this.content.main.classList.add("ss-" + this.settings.contentPosition);
    }
    updateAriaAttributes() {
      (this.main.main.role = "combobox"),
        this.main.main.setAttribute("aria-haspopup", "listbox"),
        this.main.main.setAttribute("aria-controls", this.content.main.id),
        this.main.main.setAttribute("aria-expanded", "false"),
        this.content.main.setAttribute("role", "listbox");
    }
    mainDiv() {
      var t;
      const e = document.createElement("div");
      (e.dataset.id = this.settings.id),
        e.setAttribute("aria-label", this.settings.ariaLabel),
        (e.tabIndex = 0),
        (e.onkeydown = (t) => {
          switch (t.key) {
            case "ArrowUp":
            case "ArrowDown":
              return (
                this.callbacks.open(),
                "ArrowDown" === t.key
                  ? this.highlight("down")
                  : this.highlight("up"),
                !1
              );
            case "Tab":
              return this.callbacks.close(), !0;
            case "Enter":
            case " ":
              this.callbacks.open();
              const e = this.content.list.querySelector(
                "." + this.classes.highlighted
              );
              return e && e.click(), !1;
            case "Escape":
              return this.callbacks.close(), !1;
          }
          return !1;
        }),
        (e.onclick = (t) => {
          this.settings.disabled ||
            (this.settings.isOpen
              ? this.callbacks.close()
              : this.callbacks.open());
        });
      const s = document.createElement("div");
      s.classList.add(this.classes.values), e.appendChild(s);
      const i = document.createElement("div");
      i.classList.add(this.classes.deselect);
      const n =
        null === (t = this.store) || void 0 === t
          ? void 0
          : t.getSelectedOptions();
      !this.settings.allowDeselect ||
      (this.settings.isMultiple && n && n.length <= 0)
        ? i.classList.add(this.classes.hide)
        : i.classList.remove(this.classes.hide),
        (i.onclick = (t) => {
          if ((t.stopPropagation(), this.settings.disabled)) return;
          let e = !0;
          const s = this.store.getSelectedOptions(),
            i = [];
          if (
            (this.callbacks.beforeChange &&
              (e = !0 === this.callbacks.beforeChange(i, s)),
            e)
          ) {
            if (this.settings.isMultiple)
              this.callbacks.setSelected([], !1), this.updateDeselectAll();
            else {
              const t = this.store.getFirstOption(),
                e = t ? t.value : "";
              this.callbacks.setSelected(e, !1);
            }
            this.settings.closeOnSelect && this.callbacks.close(),
              this.callbacks.afterChange &&
                this.callbacks.afterChange(this.store.getSelectedOptions());
          }
        });
      const a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      a.setAttribute("viewBox", "0 0 100 100");
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("d", this.classes.deselectPath),
        a.appendChild(l),
        i.appendChild(a),
        e.appendChild(i);
      const o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      o.classList.add(this.classes.arrow),
        o.setAttribute("viewBox", "0 0 100 100");
      const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
      return (
        c.setAttribute("d", this.classes.arrowClose),
        this.settings.alwaysOpen && o.classList.add(this.classes.hide),
        o.appendChild(c),
        e.appendChild(o),
        {
          main: e,
          values: s,
          deselect: { main: i, svg: a, path: l },
          arrow: { main: o, path: c },
        }
      );
    }
    mainFocus(t) {
      "click" !== t && this.main.main.focus({ preventScroll: !0 });
    }
    placeholder() {
      const t = this.store.filter((t) => t.placeholder, !1);
      let e = this.settings.placeholderText;
      t.length &&
        ("" !== t[0].php
          ? (e = t[0].php)
          : "" !== t[0].text && (e = t[0].text));
      const s = document.createElement("div");
      return s.classList.add(this.classes.placeholder), (s.innerHTML = e), s;
    }
    renderValues() {
      this.settings.isMultiple
        ? this.renderMultipleValues()
        : this.renderSingleValue();
    }
    renderSingleValue() {
      const t = this.store.filter((t) => t.selected && !t.placeholder, !1),
        e = t.length > 0 ? t[0] : null;
      if (e) {
        const t = document.createElement("div");
        t.classList.add(this.classes.single),
          e.php ? (t.innerHTML = e.php) : (t.innerText = e.text),
          (this.main.values.innerHTML = t.outerHTML);
      } else this.main.values.innerHTML = this.placeholder().outerHTML;
      this.settings.allowDeselect && t.length
        ? this.main.deselect.main.classList.remove(this.classes.hide)
        : this.main.deselect.main.classList.add(this.classes.hide);
    }
    renderMultipleValues() {
      let t = this.main.values.childNodes,
        e = this.store.filter((t) => t.selected && t.display, !1);
      if (0 === e.length)
        return void (this.main.values.innerHTML = this.placeholder().outerHTML);
      {
        const t = this.main.values.querySelector(
          "." + this.classes.placeholder
        );
        t && t.remove();
      }
      if (e.length > this.settings.maxValuesShown) {
        const t = document.createElement("div");
        return (
          t.classList.add(this.classes.max),
          (t.textContent = this.settings.maxValuesMessage.replace(
            "{number}",
            e.length.toString()
          )),
          void (this.main.values.innerHTML = t.outerHTML)
        );
      }
      {
        const t = this.main.values.querySelector("." + this.classes.max);
        t && t.remove();
      }
      let s = [];
      for (let i = 0; i < t.length; i++) {
        const n = t[i],
          a = n.getAttribute("data-id");
        if (a) {
          e.filter((t) => t.id === a, !1).length || s.push(n);
        }
      }
      for (const t of s)
        t.classList.add(this.classes.valueOut),
          setTimeout(() => {
            this.main.values.hasChildNodes() &&
              this.main.values.contains(t) &&
              this.main.values.removeChild(t);
          }, 100);
      t = this.main.values.childNodes;
      for (let s = 0; s < e.length; s++) {
        let i = !0;
        for (let n = 0; n < t.length; n++)
          e[s].id === String(t[n].dataset.id) && (i = !1);
        i &&
          (0 === t.length
            ? this.main.values.appendChild(this.multipleValue(e[s]))
            : 0 === s
            ? this.main.values.insertBefore(this.multipleValue(e[s]), t[s])
            : t[s - 1].insertAdjacentElement(
                "afterend",
                this.multipleValue(e[s])
              ));
      }
      this.updateDeselectAll();
    }
    multipleValue(t) {
      const e = document.createElement("div");
      e.classList.add(this.classes.value), (e.dataset.id = t.id);
      const s = document.createElement("div");
      if (
        (s.classList.add(this.classes.valueText),
        (s.innerText = t.text),
        e.appendChild(s),
        !t.mandatory)
      ) {
        const s = document.createElement("div");
        s.classList.add(this.classes.valueDelete),
          (s.onclick = (e) => {
            if (
              (e.preventDefault(), e.stopPropagation(), this.settings.disabled)
            )
              return;
            let s = !0;
            const i = this.store.getSelectedOptions(),
              l = i.filter((e) => e.selected && e.id !== t.id, !0);
            if (
              !(
                this.settings.minSelected &&
                l.length < this.settings.minSelected
              ) &&
              (this.callbacks.beforeChange &&
                (s = !0 === this.callbacks.beforeChange(l, i)),
              s)
            ) {
              let t = [];
              for (const e of l) {
                if (e instanceof n) for (const s of e.options) t.push(s.value);
                e instanceof a && t.push(e.value);
              }
              this.callbacks.setSelected(t, !1),
                this.settings.closeOnSelect && this.callbacks.close(),
                this.callbacks.afterChange && this.callbacks.afterChange(l),
                this.updateDeselectAll();
            }
          });
        const i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        i.setAttribute("viewBox", "0 0 100 100");
        const l = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        l.setAttribute("d", this.classes.optionDelete),
          i.appendChild(l),
          s.appendChild(i),
          e.appendChild(s);
      }
      return e;
    }
    contentDiv() {
      const t = document.createElement("div");
      t.dataset.id = this.settings.id;
      const e = this.searchDiv();
      t.appendChild(e.main);
      const s = this.listDiv();
      return t.appendChild(s), { main: t, search: e, list: s };
    }
    moveContent() {
      "relative" !== this.settings.contentPosition &&
      "down" !== this.settings.openPosition
        ? "up" !== this.settings.openPosition
          ? "up" === this.putContent()
            ? this.moveContentAbove()
            : this.moveContentBelow()
          : this.moveContentAbove()
        : this.moveContentBelow();
    }
    searchDiv() {
      const t = document.createElement("div"),
        s = document.createElement("input"),
        i = document.createElement("div");
      t.classList.add(this.classes.search);
      const n = { main: t, input: s };
      if (
        (this.settings.showSearch ||
          (t.classList.add(this.classes.hide), (s.readOnly = !0)),
        (s.type = "search"),
        (s.placeholder = this.settings.searchPlaceholder),
        (s.tabIndex = -1),
        s.setAttribute("aria-label", this.settings.searchPlaceholder),
        s.setAttribute("autocapitalize", "off"),
        s.setAttribute("autocomplete", "off"),
        s.setAttribute("autocorrect", "off"),
        (s.oninput = e((t) => {
          this.callbacks.search(t.target.value);
        }, 100)),
        (s.onkeydown = (t) => {
          switch (t.key) {
            case "ArrowUp":
            case "ArrowDown":
              return (
                "ArrowDown" === t.key
                  ? this.highlight("down")
                  : this.highlight("up"),
                !1
              );
            case "Tab":
              return this.callbacks.close(), !0;
            case "Escape":
              return this.callbacks.close(), !1;
            case "Enter":
            case " ":
              if (this.callbacks.addable && t.ctrlKey) return i.click(), !1;
              {
                const t = this.content.list.querySelector(
                  "." + this.classes.highlighted
                );
                if (t) return t.click(), !1;
              }
              return !0;
          }
          return !0;
        }),
        t.appendChild(s),
        this.callbacks.addable)
      ) {
        i.classList.add(this.classes.addable);
        const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        e.setAttribute("viewBox", "0 0 100 100");
        const s = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        s.setAttribute("d", this.classes.addablePath),
          e.appendChild(s),
          i.appendChild(e),
          (i.onclick = (t) => {
            if (
              (t.preventDefault(), t.stopPropagation(), !this.callbacks.addable)
            )
              return;
            const e = this.content.search.input.value.trim();
            if ("" === e) return void this.content.search.input.focus();
            const s = (t) => {
                let e = new a(t);
                if ((this.callbacks.addOption(e), this.settings.isMultiple)) {
                  let t = this.store.getSelected();
                  t.push(e.value), this.callbacks.setSelected(t, !0);
                } else this.callbacks.setSelected([e.value], !0);
                this.callbacks.search(""),
                  this.settings.closeOnSelect &&
                    setTimeout(() => {
                      this.callbacks.close();
                    }, 100);
              },
              i = this.callbacks.addable(e);
            !1 !== i &&
              null != i &&
              (i instanceof Promise
                ? i.then((t) => {
                    s("string" == typeof t ? { text: t, value: t } : t);
                  })
                : s("string" == typeof i ? { text: i, value: i } : i));
          }),
          t.appendChild(i),
          (n.addable = { main: i, svg: e, path: s });
      }
      return n;
    }
    searchFocus() {
      this.content.search.input.focus();
    }
    getOptions(t = !1, e = !1, s = !1) {
      let i = "." + this.classes.option;
      return (
        t && (i += ":not(." + this.classes.placeholder + ")"),
        e && (i += ":not(." + this.classes.disabled + ")"),
        s && (i += ":not(." + this.classes.hide + ")"),
        Array.from(this.content.list.querySelectorAll(i))
      );
    }
    highlight(t) {
      const e = this.getOptions(!0, !0, !0);
      if (0 === e.length) return;
      if (1 === e.length && !e[0].classList.contains(this.classes.highlighted))
        return void e[0].classList.add(this.classes.highlighted);
      let s = !1;
      for (const t of e)
        t.classList.contains(this.classes.highlighted) && (s = !0);
      if (!s)
        for (const t of e)
          if (t.classList.contains(this.classes.selected)) {
            t.classList.add(this.classes.highlighted);
            break;
          }
      for (let s = 0; s < e.length; s++)
        if (e[s].classList.contains(this.classes.highlighted)) {
          const i = e[s];
          i.classList.remove(this.classes.highlighted);
          const n = i.parentElement;
          if (n && n.classList.contains(this.classes.open)) {
            const t = n.querySelector("." + this.classes.optgroupLabel);
            t && t.click();
          }
          let a =
            e[
              "down" === t
                ? s + 1 < e.length
                  ? s + 1
                  : 0
                : s - 1 >= 0
                ? s - 1
                : e.length - 1
            ];
          a.classList.add(this.classes.highlighted),
            this.ensureElementInView(this.content.list, a);
          const l = a.parentElement;
          if (l && l.classList.contains(this.classes.close)) {
            const t = l.querySelector("." + this.classes.optgroupLabel);
            t && t.click();
          }
          return;
        }
      e["down" === t ? 0 : e.length - 1].classList.add(
        this.classes.highlighted
      ),
        this.ensureElementInView(
          this.content.list,
          e["down" === t ? 0 : e.length - 1]
        );
    }
    listDiv() {
      const t = document.createElement("div");
      return t.classList.add(this.classes.list), t;
    }
    renderError(t) {
      this.content.list.innerHTML = "";
      const e = document.createElement("div");
      e.classList.add(this.classes.error),
        (e.textContent = t),
        this.content.list.appendChild(e);
    }
    renderSearching() {
      this.content.list.innerHTML = "";
      const t = document.createElement("div");
      t.classList.add(this.classes.searching),
        (t.textContent = this.settings.searchingText),
        this.content.list.appendChild(t);
    }
    renderOptions(t) {
      if (((this.content.list.innerHTML = ""), 0 === t.length)) {
        const t = document.createElement("div");
        return (
          t.classList.add(this.classes.search),
          (t.innerHTML = this.settings.searchText),
          void this.content.list.appendChild(t)
        );
      }
      for (const e of t) {
        if (e instanceof n) {
          const t = document.createElement("div");
          t.classList.add(this.classes.optgroup);
          const s = document.createElement("div");
          s.classList.add(this.classes.optgroupLabel), t.appendChild(s);
          const i = document.createElement("div");
          i.classList.add(this.classes.optgroupLabelText),
            (i.textContent = e.label),
            s.appendChild(i);
          const n = document.createElement("div");
          if (
            (n.classList.add(this.classes.optgroupActions),
            s.appendChild(n),
            this.settings.isMultiple && e.selectAll)
          ) {
            const t = document.createElement("div");
            t.classList.add(this.classes.optgroupSelectAll);
            let s = !0;
            for (const t of e.options)
              if (!t.selected) {
                s = !1;
                break;
              }
            s && t.classList.add(this.classes.selected);
            const i = document.createElement("span");
            (i.textContent = e.selectAllText), t.appendChild(i);
            const a = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            a.setAttribute("viewBox", "0 0 100 100"), t.appendChild(a);
            const l = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            l.setAttribute("d", this.classes.optgroupSelectAllBox),
              a.appendChild(l);
            const o = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            o.setAttribute("d", this.classes.optgroupSelectAllCheck),
              a.appendChild(o),
              t.addEventListener("click", (t) => {
                t.preventDefault(), t.stopPropagation();
                const i = this.store.getSelected();
                if (s) {
                  const t = i.filter((t) => {
                    for (const s of e.options) if (t === s.value) return !1;
                    return !0;
                  });
                  this.callbacks.setSelected(t, !0);
                } else {
                  const t = i.concat(e.options.map((t) => t.value));
                  for (const t of e.options)
                    this.store.getOptionByID(t.id) ||
                      this.callbacks.addOption(t);
                  this.callbacks.setSelected(t, !0);
                }
              }),
              n.appendChild(t);
          }
          if ("off" !== e.closable) {
            const i = document.createElement("div");
            i.classList.add(this.classes.optgroupClosable);
            const a = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            a.setAttribute("viewBox", "0 0 100 100"),
              a.classList.add(this.classes.arrow),
              i.appendChild(a);
            const l = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            a.appendChild(l),
              e.options.some((t) => t.selected) ||
              "" !== this.content.search.input.value.trim()
                ? (i.classList.add(this.classes.open),
                  l.setAttribute("d", this.classes.arrowOpen))
                : "open" === e.closable
                ? (t.classList.add(this.classes.open),
                  l.setAttribute("d", this.classes.arrowOpen))
                : "close" === e.closable &&
                  (t.classList.add(this.classes.close),
                  l.setAttribute("d", this.classes.arrowClose)),
              s.addEventListener("click", (e) => {
                e.preventDefault(),
                  e.stopPropagation(),
                  t.classList.contains(this.classes.close)
                    ? (t.classList.remove(this.classes.close),
                      t.classList.add(this.classes.open),
                      l.setAttribute("d", this.classes.arrowOpen))
                    : (t.classList.remove(this.classes.open),
                      t.classList.add(this.classes.close),
                      l.setAttribute("d", this.classes.arrowClose));
              }),
              n.appendChild(i);
          }
          t.appendChild(s);
          for (const s of e.options) t.appendChild(this.option(s));
          this.content.list.appendChild(t);
        }
        e instanceof a && this.content.list.appendChild(this.option(e));
      }
    }
    option(t) {
      if (t.placeholder) {
        const t = document.createElement("div");
        return (
          t.classList.add(this.classes.option),
          t.classList.add(this.classes.hide),
          t
        );
      }
      const e = document.createElement("div");
      return (
        (e.dataset.id = t.id),
        (e.id = t.id),
        e.classList.add(this.classes.option),
        e.setAttribute("role", "option"),
        t.class &&
          t.class.split(" ").forEach((t) => {
            e.classList.add(t);
          }),
        t.style && (e.style.cssText = t.style),
        this.settings.searchHighlight &&
        "" !== this.content.search.input.value.trim()
          ? (e.innerHTML = this.highlightText(
              "" !== t.php ? t.php : t.text,
              this.content.search.input.value,
              this.classes.searchHighlighter
            ))
          : "" !== t.php
          ? (e.innerHTML = t.php)
          : (e.textContent = t.text),
        this.settings.showOptionTooltips &&
          e.textContent &&
          e.setAttribute("title", e.textContent),
        t.display || e.classList.add(this.classes.hide),
        t.disabled && e.classList.add(this.classes.disabled),
        t.selected &&
          this.settings.hideSelected &&
          e.classList.add(this.classes.hide),
        t.selected
          ? (e.classList.add(this.classes.selected),
            e.setAttribute("aria-selected", "true"),
            this.main.main.setAttribute("aria-activedescendant", e.id))
          : (e.classList.remove(this.classes.selected),
            e.setAttribute("aria-selected", "false")),
        e.addEventListener("click", (e) => {
          e.preventDefault(), e.stopPropagation();
          const s = this.store.getSelected(),
            i = e.currentTarget,
            n = String(i.dataset.id);
          if (t.disabled || (t.selected && !this.settings.allowDeselect))
            return;
          if (
            (this.settings.isMultiple &&
              this.settings.maxSelected <= s.length &&
              !t.selected) ||
            (this.settings.isMultiple &&
              this.settings.minSelected >= s.length &&
              t.selected)
          )
            return;
          let a = !1;
          const l = this.store.getSelectedOptions();
          let o = [];
          this.settings.isMultiple &&
            (o = t.selected ? l.filter((t) => t.id !== n) : l.concat(t)),
            this.settings.isMultiple || (o = t.selected ? [] : [t]),
            this.callbacks.beforeChange || (a = !0),
            this.callbacks.beforeChange &&
              (a = !1 !== this.callbacks.beforeChange(o, l)),
            a &&
              (this.store.getOptionByID(n) || this.callbacks.addOption(t),
              this.callbacks.setSelected(
                o.map((t) => t.value),
                !1
              ),
              this.settings.closeOnSelect && this.callbacks.close(),
              this.callbacks.afterChange && this.callbacks.afterChange(o));
        }),
        e
      );
    }
    destroy() {
      this.main.main.remove(), this.content.main.remove();
    }
    highlightText(t, e, s) {
      let i = t;
      const n = new RegExp("(" + e.trim() + ")(?![^<]*>[^<>]*</)", "i");
      if (!t.match(n)) return t;
      const a = t.match(n).index,
        l = a + t.match(n)[0].toString().length,
        o = t.substring(a, l);
      return (i = i.replace(n, `<mark class="${s}">${o}</mark>`)), i;
    }
    moveContentAbove() {
      const t = this.main.main.offsetHeight,
        e = this.content.main.offsetHeight;
      this.main.main.classList.remove(this.classes.openBelow),
        this.main.main.classList.add(this.classes.openAbove),
        this.content.main.classList.remove(this.classes.openBelow),
        this.content.main.classList.add(this.classes.openAbove);
      const s = this.main.main.getBoundingClientRect();
      (this.content.main.style.margin = "-" + (t + e - 1) + "px 0px 0px 0px"),
        (this.content.main.style.top =
          s.top + s.height + window.scrollY + "px"),
        (this.content.main.style.left = s.left + window.scrollX + "px"),
        (this.content.main.style.width = s.width + "px");
    }
    moveContentBelow() {
      this.main.main.classList.remove(this.classes.openAbove),
        this.main.main.classList.add(this.classes.openBelow),
        this.content.main.classList.remove(this.classes.openAbove),
        this.content.main.classList.add(this.classes.openBelow);
      const t = this.main.main.getBoundingClientRect();
      (this.content.main.style.margin = "-1px 0px 0px 0px"),
        "relative" !== this.settings.contentPosition &&
          ((this.content.main.style.top =
            t.top + t.height + window.scrollY + "px"),
          (this.content.main.style.left = t.left + window.scrollX + "px"),
          (this.content.main.style.width = t.width + "px"));
    }
    ensureElementInView(t, e) {
      const s = t.scrollTop + t.offsetTop,
        i = s + t.clientHeight,
        n = e.offsetTop,
        a = n + e.clientHeight;
      n < s ? (t.scrollTop -= s - n) : a > i && (t.scrollTop += a - i);
    }
    putContent() {
      const t = this.main.main.offsetHeight,
        e = this.main.main.getBoundingClientRect(),
        s = this.content.main.offsetHeight;
      return window.innerHeight - (e.top + t) <= s && e.top > s ? "up" : "down";
    }
    updateDeselectAll() {
      if (!this.store || !this.settings) return;
      const t = this.store.getSelectedOptions(),
        e = t && t.length > 0,
        s = this.settings.isMultiple,
        i = this.settings.allowDeselect,
        n = this.main.deselect.main,
        a = this.classes.hide;
      !i || (s && !e) ? n.classList.add(a) : n.classList.remove(a);
    }
  }
  class c {
    constructor(t) {
      (this.listen = !1),
        (this.observer = null),
        (this.select = t),
        (this.valueChange = this.valueChange.bind(this)),
        this.select.addEventListener("change", this.valueChange, {
          passive: !0,
        }),
        (this.observer = new MutationObserver(this.observeCall.bind(this))),
        this.changeListen(!0);
    }
    enable() {
      this.select.disabled = !1;
    }
    disable() {
      this.select.disabled = !0;
    }
    hideUI() {
      (this.select.tabIndex = -1),
        (this.select.style.display = "none"),
        this.select.setAttribute("aria-hidden", "true");
    }
    showUI() {
      this.select.removeAttribute("tabindex"),
        (this.select.style.display = ""),
        this.select.removeAttribute("aria-hidden");
    }
    changeListen(t) {
      (this.listen = t),
        t &&
          this.observer &&
          this.observer.observe(this.select, {
            subtree: !0,
            childList: !0,
            attributes: !0,
          }),
        t || (this.observer && this.observer.disconnect());
    }
    valueChange(t) {
      return (
        this.listen &&
          this.onValueChange &&
          this.onValueChange(this.getSelectedValues()),
        !0
      );
    }
    observeCall(t) {
      if (!this.listen) return;
      let e = !1,
        s = !1,
        i = !1;
      for (const n of t)
        n.target === this.select &&
          ("disabled" === n.attributeName && (s = !0),
          "class" === n.attributeName && (e = !0)),
          ("OPTGROUP" !== n.target.nodeName &&
            "OPTION" !== n.target.nodeName) ||
            (i = !0);
      e &&
        this.onClassChange &&
        this.onClassChange(this.select.className.split(" ")),
        s &&
          this.onDisabledChange &&
          (this.changeListen(!1),
          this.onDisabledChange(this.select.disabled),
          this.changeListen(!0)),
        i &&
          this.onOptionsChange &&
          (this.changeListen(!1),
          this.onOptionsChange(this.getData()),
          this.changeListen(!0));
    }
    getData() {
      let t = [];
      const e = this.select.childNodes;
      for (const s of e)
        "OPTGROUP" === s.nodeName && t.push(this.getDataFromOptgroup(s)),
          "OPTION" === s.nodeName && t.push(this.getDataFromOption(s));
      return t;
    }
    getDataFromOptgroup(t) {
      let e = {
        id: t.id,
        label: t.label,
        selectAll: !!t.dataset && "true" === t.dataset.selectall,
        selectAllText: t.dataset ? t.dataset.selectalltext : "Select all",
        closable: t.dataset ? t.dataset.closable : "off",
        options: [],
      };
      const s = t.childNodes;
      for (const t of s)
        "OPTION" === t.nodeName && e.options.push(this.getDataFromOption(t));
      return e;
    }
    getDataFromOption(t) {
      return {
        id: t.id,
        value: t.value,
        text: t.text,
        html: t.dataset && t.dataset.php ? t.dataset.php : "",
        selected: t.selected,
        display: "none" !== t.style.display,
        disabled: t.disabled,
        mandatory: !!t.dataset && "true" === t.dataset.mandatory,
        placeholder: "true" === t.dataset.placeholder,
        class: t.className,
        style: t.style.cssText,
        data: t.dataset,
      };
    }
    getSelectedValues() {
      let t = [];
      const e = this.select.childNodes;
      for (const s of e) {
        if ("OPTGROUP" === s.nodeName) {
          const e = s.childNodes;
          for (const s of e)
            if ("OPTION" === s.nodeName) {
              const e = s;
              e.selected && t.push(e.value);
            }
        }
        if ("OPTION" === s.nodeName) {
          const e = s;
          e.selected && t.push(e.value);
        }
      }
      return t;
    }
    setSelected(t) {
      this.changeListen(!1);
      const e = this.select.childNodes;
      for (const s of e) {
        if ("OPTGROUP" === s.nodeName) {
          const e = s.childNodes;
          for (const s of e)
            if ("OPTION" === s.nodeName) {
              const e = s;
              e.selected = t.includes(e.value);
            }
        }
        if ("OPTION" === s.nodeName) {
          const e = s;
          e.selected = t.includes(e.value);
        }
      }
      this.changeListen(!0);
    }
    updateSelect(t, e, s) {
      this.changeListen(!1),
        t && (this.select.dataset.id = t),
        e && (this.select.style.cssText = e),
        s &&
          ((this.select.className = ""),
          s.forEach((t) => {
            "" !== t.trim() && this.select.classList.add(t.trim());
          })),
        this.changeListen(!0);
    }
    updateOptions(t) {
      this.changeListen(!1), (this.select.innerHTML = "");
      for (const e of t)
        e instanceof n && this.select.appendChild(this.createOptgroup(e)),
          e instanceof a && this.select.appendChild(this.createOption(e));
      this.select.dispatchEvent(new Event("change")), this.changeListen(!0);
    }
    createOptgroup(t) {
      const e = document.createElement("optgroup");
      if (
        ((e.id = t.id),
        (e.label = t.label),
        t.selectAll && (e.dataset.selectAll = "true"),
        "off" !== t.closable && (e.dataset.closable = t.closable),
        t.options)
      )
        for (const s of t.options) e.appendChild(this.createOption(s));
      return e;
    }
    createOption(t) {
      const e = document.createElement("option");
      return (
        (e.id = t.id),
        (e.value = t.value),
        (e.innerHTML = t.text),
        "" !== t.php && e.setAttribute("data-html", t.php),
        t.selected && (e.selected = t.selected),
        t.disabled && (e.disabled = !0),
        !1 === t.display && (e.style.display = "none"),
        t.placeholder && e.setAttribute("data-placeholder", "true"),
        t.mandatory && e.setAttribute("data-mandatory", "true"),
        t.class &&
          t.class.split(" ").forEach((t) => {
            e.classList.add(t);
          }),
        t.data &&
          "object" == typeof t.data &&
          Object.keys(t.data).forEach((s) => {
            e.setAttribute(
              "data-" +
                (function (t) {
                  const e = t.replace(
                    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
                    (t) => "-" + t.toLowerCase()
                  );
                  return t[0] === t[0].toUpperCase() ? e.substring(1) : e;
                })(s),
              t.data[s]
            );
          }),
        e
      );
    }
    destroy() {
      this.changeListen(!1),
        this.select.removeEventListener("change", this.valueChange),
        this.observer && (this.observer.disconnect(), (this.observer = null)),
        delete this.select.dataset.id,
        this.showUI();
    }
  }
  return class {
    constructor(t) {
      var s;
      if (
        ((this.events = {
          search: void 0,
          searchFilter: (t, e) =>
            -1 !== t.text.toLowerCase().indexOf(e.toLowerCase()),
          addable: void 0,
          beforeChange: void 0,
          afterChange: void 0,
          beforeOpen: void 0,
          afterOpen: void 0,
          beforeClose: void 0,
          afterClose: void 0,
        }),
        (this.windowResize = e(() => {
          (this.settings.isOpen || this.settings.isFullOpen) &&
            this.render.moveContent();
        })),
        (this.windowScroll = e(() => {
          (this.settings.isOpen || this.settings.isFullOpen) &&
            this.render.moveContent();
        })),
        (this.documentClick = (t) => {
          this.settings.isOpen &&
            t.target &&
            !(function (t, e) {
              function s(t, s) {
                return (s && t && t.classList && t.classList.contains(s)) ||
                  (s && t && t.dataset && t.dataset.id && t.dataset.id === e)
                  ? t
                  : null;
              }
              return (
                s(t, e) ||
                (function t(e, i) {
                  return e && e !== document
                    ? s(e, i)
                      ? e
                      : t(e.parentNode, i)
                    : null;
                })(t, e)
              );
            })(t.target, this.settings.id) &&
            this.close(t.type);
        }),
        (this.windowVisibilityChange = () => {
          document.hidden && this.close();
        }),
        (this.selectEl =
          "string" == typeof t.select
            ? document.querySelector(t.select)
            : t.select),
        !this.selectEl)
      )
        return void (
          t.events &&
          t.events.error &&
          t.events.error(new Error("Could not find select element"))
        );
      if ("SELECT" !== this.selectEl.tagName)
        return void (
          t.events &&
          t.events.error &&
          t.events.error(new Error("Element isnt of type select"))
        );
      this.selectEl.dataset.ssid && this.destroy(),
        (this.settings = new i(t.settings));
      const n = [
        "afterChange",
        "beforeOpen",
        "afterOpen",
        "beforeClose",
        "afterClose",
      ];
      for (const s in t.events)
        t.events.hasOwnProperty(s) &&
          (-1 !== n.indexOf(s)
            ? (this.events[s] = e(t.events[s], 100))
            : (this.events[s] = t.events[s]));
      (this.settings.disabled = (
        null === (s = t.settings) || void 0 === s ? void 0 : s.disabled
      )
        ? t.settings.disabled
        : this.selectEl.disabled),
        (this.settings.isMultiple = this.selectEl.multiple),
        (this.settings.style = this.selectEl.style.cssText),
        (this.settings.class = this.selectEl.className.split(" ")),
        (this.select = new c(this.selectEl)),
        this.select.updateSelect(
          this.settings.id,
          this.settings.style,
          this.settings.class
        ),
        this.select.hideUI(),
        (this.select.onValueChange = (t) => {
          this.setSelected(t);
        }),
        (this.select.onClassChange = (t) => {
          (this.settings.class = t), this.render.updateClassStyles();
        }),
        (this.select.onDisabledChange = (t) => {
          t ? this.disable() : this.enable();
        }),
        (this.select.onOptionsChange = (t) => {
          this.setData(t);
        }),
        (this.store = new l(
          this.settings.isMultiple ? "multiple" : "single",
          t.data ? t.data : this.select.getData()
        )),
        t.data && this.select.updateOptions(this.store.getData());
      const a = {
        open: this.open.bind(this),
        close: this.close.bind(this),
        addable: this.events.addable ? this.events.addable : void 0,
        setSelected: this.setSelected.bind(this),
        addOption: this.addOption.bind(this),
        search: this.search.bind(this),
        beforeChange: this.events.beforeChange,
        afterChange: this.events.afterChange,
      };
      (this.render = new o(this.settings, this.store, a)),
        this.render.renderValues(),
        this.render.renderOptions(this.store.getData());
      const h = this.selectEl.getAttribute("aria-label"),
        r = this.selectEl.getAttribute("aria-labelledby");
      h
        ? this.render.main.main.setAttribute("aria-label", h)
        : r && this.render.main.main.setAttribute("aria-labelledby", r),
        this.selectEl.parentNode &&
          this.selectEl.parentNode.insertBefore(
            this.render.main.main,
            this.selectEl.nextSibling
          ),
        document.addEventListener("click", this.documentClick),
        window.addEventListener("resize", this.windowResize, !1),
        "auto" === this.settings.openPosition &&
          window.addEventListener("scroll", this.windowScroll, !1),
        document.addEventListener(
          "visibilitychange",
          this.windowVisibilityChange
        ),
        this.settings.disabled && this.disable(),
        this.settings.alwaysOpen && this.open(),
        (this.selectEl.slim = this);
    }
    enable() {
      (this.settings.disabled = !1), this.select.enable(), this.render.enable();
    }
    disable() {
      (this.settings.disabled = !0),
        this.select.disable(),
        this.render.disable();
    }
    getData() {
      return this.store.getData();
    }
    setData(t) {
      const e = this.store.getSelected(),
        i = this.store.validateDataArray(t);
      if (i) return void (this.events.error && this.events.error(i));
      this.store.setData(t);
      const n = this.store.getData();
      this.select.updateOptions(n),
        this.render.renderValues(),
        this.render.renderOptions(n),
        this.events.afterChange &&
          !s(e, this.store.getSelected()) &&
          this.events.afterChange(this.store.getSelectedOptions());
    }
    getSelected() {
      return this.store.getSelected();
    }
    setSelected(t, e = !0) {
      const i = this.store.getSelected();
      this.store.setSelectedBy("value", Array.isArray(t) ? t : [t]);
      const n = this.store.getData();
      this.select.updateOptions(n),
        this.render.renderValues(),
        "" !== this.render.content.search.input.value
          ? this.search(this.render.content.search.input.value)
          : this.render.renderOptions(n),
        e &&
          this.events.afterChange &&
          !s(i, this.store.getSelected()) &&
          this.events.afterChange(this.store.getSelectedOptions());
    }
    addOption(t) {
      const e = this.store.getSelected();
      this.store.getDataOptions().some((e) => {
        var s;
        return (
          e.value === (null !== (s = t.value) && void 0 !== s ? s : t.text)
        );
      }) || this.store.addOption(t);
      const i = this.store.getData();
      this.select.updateOptions(i),
        this.render.renderValues(),
        this.render.renderOptions(i),
        this.events.afterChange &&
          !s(e, this.store.getSelected()) &&
          this.events.afterChange(this.store.getSelectedOptions());
    }
    open() {
      this.settings.disabled ||
        this.settings.isOpen ||
        (this.events.beforeOpen && this.events.beforeOpen(),
        this.render.open(),
        this.settings.showSearch && this.render.searchFocus(),
        (this.settings.isOpen = !0),
        setTimeout(() => {
          this.events.afterOpen && this.events.afterOpen(),
            this.settings.isOpen && (this.settings.isFullOpen = !0);
        }, this.settings.timeoutDelay),
        "absolute" === this.settings.contentPosition &&
          (this.settings.intervalMove &&
            clearInterval(this.settings.intervalMove),
          (this.settings.intervalMove = setInterval(
            this.render.moveContent.bind(this.render),
            500
          ))));
    }
    close(t = null) {
      this.settings.isOpen &&
        !this.settings.alwaysOpen &&
        (this.events.beforeClose && this.events.beforeClose(),
        this.render.close(),
        "" !== this.render.content.search.input.value && this.search(""),
        this.render.mainFocus(t),
        (this.settings.isOpen = !1),
        (this.settings.isFullOpen = !1),
        setTimeout(() => {
          this.events.afterClose && this.events.afterClose();
        }, this.settings.timeoutDelay),
        this.settings.intervalMove &&
          clearInterval(this.settings.intervalMove));
    }
    search(t) {
      if (
        (this.render.content.search.input.value !== t &&
          (this.render.content.search.input.value = t),
        !this.events.search)
      )
        return void this.render.renderOptions(
          "" === t
            ? this.store.getData()
            : this.store.search(t, this.events.searchFilter)
        );
      this.render.renderSearching();
      const e = this.events.search(t, this.store.getSelectedOptions());
      e instanceof Promise
        ? e
            .then((t) => {
              this.render.renderOptions(this.store.partialToFullData(t));
            })
            .catch((t) => {
              this.render.renderError("string" == typeof t ? t : t.message);
            })
        : Array.isArray(e)
        ? this.render.renderOptions(this.store.partialToFullData(e))
        : this.render.renderError(
            "Search event must return a promise or an array of data"
          );
    }
    destroy() {
      document.removeEventListener("click", this.documentClick),
        window.removeEventListener("resize", this.windowResize, !1),
        "auto" === this.settings.openPosition &&
          window.removeEventListener("scroll", this.windowScroll, !1),
        document.removeEventListener(
          "visibilitychange",
          this.windowVisibilityChange
        ),
        this.store.setData([]),
        this.render.destroy(),
        this.select.destroy();
    }
  };
});

!(function (e, t) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var n = t();
    for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
  }
})(self, function () {
  return (function () {
    var e = {
        3099: function (e) {
          e.exports = function (e) {
            if ("function" != typeof e)
              throw TypeError(String(e) + " is not a function");
            return e;
          };
        },
        6077: function (e, t, n) {
          var r = n(111);
          e.exports = function (e) {
            if (!r(e) && null !== e)
              throw TypeError("Can't set " + String(e) + " as a prototype");
            return e;
          };
        },
        1223: function (e, t, n) {
          var r = n(5112),
            i = n(30),
            o = n(3070),
            a = r("unscopables"),
            u = Array.prototype;
          null == u[a] && o.f(u, a, { configurable: !0, value: i(null) }),
            (e.exports = function (e) {
              u[a][e] = !0;
            });
        },
        1530: function (e, t, n) {
          "use strict";
          var r = n(8710).charAt;
          e.exports = function (e, t, n) {
            return t + (n ? r(e, t).length : 1);
          };
        },
        5787: function (e) {
          e.exports = function (e, t, n) {
            if (!(e instanceof t))
              throw TypeError("Incorrect " + (n ? n + " " : "") + "invocation");
            return e;
          };
        },
        9670: function (e, t, n) {
          var r = n(111);
          e.exports = function (e) {
            if (!r(e)) throw TypeError(String(e) + " is not an object");
            return e;
          };
        },
        4019: function (e) {
          e.exports =
            "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView;
        },
        260: function (e, t, n) {
          "use strict";
          var r,
            i = n(4019),
            o = n(9781),
            a = n(7854),
            u = n(111),
            s = n(6656),
            l = n(648),
            c = n(8880),
            f = n(1320),
            p = n(3070).f,
            h = n(9518),
            d = n(7674),
            v = n(5112),
            y = n(9711),
            g = a.Int8Array,
            m = g && g.prototype,
            b = a.Uint8ClampedArray,
            x = b && b.prototype,
            w = g && h(g),
            E = m && h(m),
            k = Object.prototype,
            A = k.isPrototypeOf,
            S = v("toStringTag"),
            F = y("TYPED_ARRAY_TAG"),
            T = i && !!d && "Opera" !== l(a.opera),
            C = !1,
            L = {
              Int8Array: 1,
              Uint8Array: 1,
              Uint8ClampedArray: 1,
              Int16Array: 2,
              Uint16Array: 2,
              Int32Array: 4,
              Uint32Array: 4,
              Float32Array: 4,
              Float64Array: 8,
            },
            R = { BigInt64Array: 8, BigUint64Array: 8 },
            I = function (e) {
              if (!u(e)) return !1;
              var t = l(e);
              return s(L, t) || s(R, t);
            };
          for (r in L) a[r] || (T = !1);
          if (
            (!T || "function" != typeof w || w === Function.prototype) &&
            ((w = function () {
              throw TypeError("Incorrect invocation");
            }),
            T)
          )
            for (r in L) a[r] && d(a[r], w);
          if ((!T || !E || E === k) && ((E = w.prototype), T))
            for (r in L) a[r] && d(a[r].prototype, E);
          if ((T && h(x) !== E && d(x, E), o && !s(E, S)))
            for (r in ((C = !0),
            p(E, S, {
              get: function () {
                return u(this) ? this[F] : void 0;
              },
            }),
            L))
              a[r] && c(a[r], F, r);
          e.exports = {
            NATIVE_ARRAY_BUFFER_VIEWS: T,
            TYPED_ARRAY_TAG: C && F,
            aTypedArray: function (e) {
              if (I(e)) return e;
              throw TypeError("Target is not a typed array");
            },
            aTypedArrayConstructor: function (e) {
              if (d) {
                if (A.call(w, e)) return e;
              } else
                for (var t in L)
                  if (s(L, r)) {
                    var n = a[t];
                    if (n && (e === n || A.call(n, e))) return e;
                  }
              throw TypeError("Target is not a typed array constructor");
            },
            exportTypedArrayMethod: function (e, t, n) {
              if (o) {
                if (n)
                  for (var r in L) {
                    var i = a[r];
                    i && s(i.prototype, e) && delete i.prototype[e];
                  }
                (E[e] && !n) || f(E, e, n ? t : (T && m[e]) || t);
              }
            },
            exportTypedArrayStaticMethod: function (e, t, n) {
              var r, i;
              if (o) {
                if (d) {
                  if (n) for (r in L) (i = a[r]) && s(i, e) && delete i[e];
                  if (w[e] && !n) return;
                  try {
                    return f(w, e, n ? t : (T && g[e]) || t);
                  } catch (e) {}
                }
                for (r in L) !(i = a[r]) || (i[e] && !n) || f(i, e, t);
              }
            },
            isView: function (e) {
              if (!u(e)) return !1;
              var t = l(e);
              return "DataView" === t || s(L, t) || s(R, t);
            },
            isTypedArray: I,
            TypedArray: w,
            TypedArrayPrototype: E,
          };
        },
        3331: function (e, t, n) {
          "use strict";
          var r = n(7854),
            i = n(9781),
            o = n(4019),
            a = n(8880),
            u = n(2248),
            s = n(7293),
            l = n(5787),
            c = n(9958),
            f = n(7466),
            p = n(7067),
            h = n(1179),
            d = n(9518),
            v = n(7674),
            y = n(8006).f,
            g = n(3070).f,
            m = n(1285),
            b = n(8003),
            x = n(9909),
            w = x.get,
            E = x.set,
            k = "ArrayBuffer",
            A = "DataView",
            S = "Wrong index",
            F = r.ArrayBuffer,
            T = F,
            C = r.DataView,
            L = C && C.prototype,
            R = Object.prototype,
            I = r.RangeError,
            U = h.pack,
            O = h.unpack,
            _ = function (e) {
              return [255 & e];
            },
            M = function (e) {
              return [255 & e, (e >> 8) & 255];
            },
            z = function (e) {
              return [
                255 & e,
                (e >> 8) & 255,
                (e >> 16) & 255,
                (e >> 24) & 255,
              ];
            },
            P = function (e) {
              return (e[3] << 24) | (e[2] << 16) | (e[1] << 8) | e[0];
            },
            j = function (e) {
              return U(e, 23, 4);
            },
            D = function (e) {
              return U(e, 52, 8);
            },
            N = function (e, t) {
              g(e.prototype, t, {
                get: function () {
                  return w(this)[t];
                },
              });
            },
            B = function (e, t, n, r) {
              var i = p(n),
                o = w(e);
              if (i + t > o.byteLength) throw I(S);
              var a = w(o.buffer).bytes,
                u = i + o.byteOffset,
                s = a.slice(u, u + t);
              return r ? s : s.reverse();
            },
            q = function (e, t, n, r, i, o) {
              var a = p(n),
                u = w(e);
              if (a + t > u.byteLength) throw I(S);
              for (
                var s = w(u.buffer).bytes,
                  l = a + u.byteOffset,
                  c = r(+i),
                  f = 0;
                f < t;
                f++
              )
                s[l + f] = c[o ? f : t - f - 1];
            };
          if (o) {
            if (
              !s(function () {
                F(1);
              }) ||
              !s(function () {
                new F(-1);
              }) ||
              s(function () {
                return new F(), new F(1.5), new F(NaN), F.name != k;
              })
            ) {
              for (
                var W,
                  H = ((T = function (e) {
                    return l(this, T), new F(p(e));
                  }).prototype = F.prototype),
                  Y = y(F),
                  G = 0;
                Y.length > G;

              )
                (W = Y[G++]) in T || a(T, W, F[W]);
              H.constructor = T;
            }
            v && d(L) !== R && v(L, R);
            var Q = new C(new T(2)),
              $ = L.setInt8;
            Q.setInt8(0, 2147483648),
              Q.setInt8(1, 2147483649),
              (!Q.getInt8(0) && Q.getInt8(1)) ||
                u(
                  L,
                  {
                    setInt8: function (e, t) {
                      $.call(this, e, (t << 24) >> 24);
                    },
                    setUint8: function (e, t) {
                      $.call(this, e, (t << 24) >> 24);
                    },
                  },
                  { unsafe: !0 }
                );
          } else
            (T = function (e) {
              l(this, T, k);
              var t = p(e);
              E(this, { bytes: m.call(new Array(t), 0), byteLength: t }),
                i || (this.byteLength = t);
            }),
              (C = function (e, t, n) {
                l(this, C, A), l(e, T, A);
                var r = w(e).byteLength,
                  o = c(t);
                if (o < 0 || o > r) throw I("Wrong offset");
                if (o + (n = void 0 === n ? r - o : f(n)) > r)
                  throw I("Wrong length");
                E(this, { buffer: e, byteLength: n, byteOffset: o }),
                  i ||
                    ((this.buffer = e),
                    (this.byteLength = n),
                    (this.byteOffset = o));
              }),
              i &&
                (N(T, "byteLength"),
                N(C, "buffer"),
                N(C, "byteLength"),
                N(C, "byteOffset")),
              u(C.prototype, {
                getInt8: function (e) {
                  return (B(this, 1, e)[0] << 24) >> 24;
                },
                getUint8: function (e) {
                  return B(this, 1, e)[0];
                },
                getInt16: function (e) {
                  var t = B(
                    this,
                    2,
                    e,
                    arguments.length > 1 ? arguments[1] : void 0
                  );
                  return (((t[1] << 8) | t[0]) << 16) >> 16;
                },
                getUint16: function (e) {
                  var t = B(
                    this,
                    2,
                    e,
                    arguments.length > 1 ? arguments[1] : void 0
                  );
                  return (t[1] << 8) | t[0];
                },
                getInt32: function (e) {
                  return P(
                    B(this, 4, e, arguments.length > 1 ? arguments[1] : void 0)
                  );
                },
                getUint32: function (e) {
                  return (
                    P(
                      B(
                        this,
                        4,
                        e,
                        arguments.length > 1 ? arguments[1] : void 0
                      )
                    ) >>> 0
                  );
                },
                getFloat32: function (e) {
                  return O(
                    B(this, 4, e, arguments.length > 1 ? arguments[1] : void 0),
                    23
                  );
                },
                getFloat64: function (e) {
                  return O(
                    B(this, 8, e, arguments.length > 1 ? arguments[1] : void 0),
                    52
                  );
                },
                setInt8: function (e, t) {
                  q(this, 1, e, _, t);
                },
                setUint8: function (e, t) {
                  q(this, 1, e, _, t);
                },
                setInt16: function (e, t) {
                  q(
                    this,
                    2,
                    e,
                    M,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
                setUint16: function (e, t) {
                  q(
                    this,
                    2,
                    e,
                    M,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
                setInt32: function (e, t) {
                  q(
                    this,
                    4,
                    e,
                    z,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
                setUint32: function (e, t) {
                  q(
                    this,
                    4,
                    e,
                    z,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
                setFloat32: function (e, t) {
                  q(
                    this,
                    4,
                    e,
                    j,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
                setFloat64: function (e, t) {
                  q(
                    this,
                    8,
                    e,
                    D,
                    t,
                    arguments.length > 2 ? arguments[2] : void 0
                  );
                },
              });
          b(T, k), b(C, A), (e.exports = { ArrayBuffer: T, DataView: C });
        },
        1048: function (e, t, n) {
          "use strict";
          var r = n(7908),
            i = n(1400),
            o = n(7466),
            a = Math.min;
          e.exports =
            [].copyWithin ||
            function (e, t) {
              var n = r(this),
                u = o(n.length),
                s = i(e, u),
                l = i(t, u),
                c = arguments.length > 2 ? arguments[2] : void 0,
                f = a((void 0 === c ? u : i(c, u)) - l, u - s),
                p = 1;
              for (
                l < s && s < l + f && ((p = -1), (l += f - 1), (s += f - 1));
                f-- > 0;

              )
                l in n ? (n[s] = n[l]) : delete n[s], (s += p), (l += p);
              return n;
            };
        },
        1285: function (e, t, n) {
          "use strict";
          var r = n(7908),
            i = n(1400),
            o = n(7466);
          e.exports = function (e) {
            for (
              var t = r(this),
                n = o(t.length),
                a = arguments.length,
                u = i(a > 1 ? arguments[1] : void 0, n),
                s = a > 2 ? arguments[2] : void 0,
                l = void 0 === s ? n : i(s, n);
              l > u;

            )
              t[u++] = e;
            return t;
          };
        },
        8533: function (e, t, n) {
          "use strict";
          var r = n(2092).forEach,
            i = n(9341)("forEach");
          e.exports = i
            ? [].forEach
            : function (e) {
                return r(this, e, arguments.length > 1 ? arguments[1] : void 0);
              };
        },
        8457: function (e, t, n) {
          "use strict";
          var r = n(9974),
            i = n(7908),
            o = n(3411),
            a = n(7659),
            u = n(7466),
            s = n(6135),
            l = n(1246);
          e.exports = function (e) {
            var t,
              n,
              c,
              f,
              p,
              h,
              d = i(e),
              v = "function" == typeof this ? this : Array,
              y = arguments.length,
              g = y > 1 ? arguments[1] : void 0,
              m = void 0 !== g,
              b = l(d),
              x = 0;
            if (
              (m && (g = r(g, y > 2 ? arguments[2] : void 0, 2)),
              null == b || (v == Array && a(b)))
            )
              for (n = new v((t = u(d.length))); t > x; x++)
                (h = m ? g(d[x], x) : d[x]), s(n, x, h);
            else
              for (
                p = (f = b.call(d)).next, n = new v();
                !(c = p.call(f)).done;
                x++
              )
                (h = m ? o(f, g, [c.value, x], !0) : c.value), s(n, x, h);
            return (n.length = x), n;
          };
        },
        1318: function (e, t, n) {
          var r = n(5656),
            i = n(7466),
            o = n(1400),
            a = function (e) {
              return function (t, n, a) {
                var u,
                  s = r(t),
                  l = i(s.length),
                  c = o(a, l);
                if (e && n != n) {
                  for (; l > c; ) if ((u = s[c++]) != u) return !0;
                } else
                  for (; l > c; c++)
                    if ((e || c in s) && s[c] === n) return e || c || 0;
                return !e && -1;
              };
            };
          e.exports = { includes: a(!0), indexOf: a(!1) };
        },
        2092: function (e, t, n) {
          var r = n(9974),
            i = n(8361),
            o = n(7908),
            a = n(7466),
            u = n(5417),
            s = [].push,
            l = function (e) {
              var t = 1 == e,
                n = 2 == e,
                l = 3 == e,
                c = 4 == e,
                f = 6 == e,
                p = 7 == e,
                h = 5 == e || f;
              return function (d, v, y, g) {
                for (
                  var m,
                    b,
                    x = o(d),
                    w = i(x),
                    E = r(v, y, 3),
                    k = a(w.length),
                    A = 0,
                    S = g || u,
                    F = t ? S(d, k) : n || p ? S(d, 0) : void 0;
                  k > A;
                  A++
                )
                  if ((h || A in w) && ((b = E((m = w[A]), A, x)), e))
                    if (t) F[A] = b;
                    else if (b)
                      switch (e) {
                        case 3:
                          return !0;
                        case 5:
                          return m;
                        case 6:
                          return A;
                        case 2:
                          s.call(F, m);
                      }
                    else
                      switch (e) {
                        case 4:
                          return !1;
                        case 7:
                          s.call(F, m);
                      }
                return f ? -1 : l || c ? c : F;
              };
            };
          e.exports = {
            forEach: l(0),
            map: l(1),
            filter: l(2),
            some: l(3),
            every: l(4),
            find: l(5),
            findIndex: l(6),
            filterOut: l(7),
          };
        },
        6583: function (e, t, n) {
          "use strict";
          var r = n(5656),
            i = n(9958),
            o = n(7466),
            a = n(9341),
            u = Math.min,
            s = [].lastIndexOf,
            l = !!s && 1 / [1].lastIndexOf(1, -0) < 0,
            c = a("lastIndexOf"),
            f = l || !c;
          e.exports = f
            ? function (e) {
                if (l) return s.apply(this, arguments) || 0;
                var t = r(this),
                  n = o(t.length),
                  a = n - 1;
                for (
                  arguments.length > 1 && (a = u(a, i(arguments[1]))),
                    a < 0 && (a = n + a);
                  a >= 0;
                  a--
                )
                  if (a in t && t[a] === e) return a || 0;
                return -1;
              }
            : s;
        },
        1194: function (e, t, n) {
          var r = n(7293),
            i = n(5112),
            o = n(7392),
            a = i("species");
          e.exports = function (e) {
            return (
              o >= 51 ||
              !r(function () {
                var t = [];
                return (
                  ((t.constructor = {})[a] = function () {
                    return { foo: 1 };
                  }),
                  1 !== t[e](Boolean).foo
                );
              })
            );
          };
        },
        9341: function (e, t, n) {
          "use strict";
          var r = n(7293);
          e.exports = function (e, t) {
            var n = [][e];
            return (
              !!n &&
              r(function () {
                n.call(
                  null,
                  t ||
                    function () {
                      throw 1;
                    },
                  1
                );
              })
            );
          };
        },
        3671: function (e, t, n) {
          var r = n(3099),
            i = n(7908),
            o = n(8361),
            a = n(7466),
            u = function (e) {
              return function (t, n, u, s) {
                r(n);
                var l = i(t),
                  c = o(l),
                  f = a(l.length),
                  p = e ? f - 1 : 0,
                  h = e ? -1 : 1;
                if (u < 2)
                  for (;;) {
                    if (p in c) {
                      (s = c[p]), (p += h);
                      break;
                    }
                    if (((p += h), e ? p < 0 : f <= p))
                      throw TypeError(
                        "Reduce of empty array with no initial value"
                      );
                  }
                for (; e ? p >= 0 : f > p; p += h)
                  p in c && (s = n(s, c[p], p, l));
                return s;
              };
            };
          e.exports = { left: u(!1), right: u(!0) };
        },
        5417: function (e, t, n) {
          var r = n(111),
            i = n(3157),
            o = n(5112)("species");
          e.exports = function (e, t) {
            var n;
            return (
              i(e) &&
                ("function" != typeof (n = e.constructor) ||
                (n !== Array && !i(n.prototype))
                  ? r(n) && null === (n = n[o]) && (n = void 0)
                  : (n = void 0)),
              new (void 0 === n ? Array : n)(0 === t ? 0 : t)
            );
          };
        },
        3411: function (e, t, n) {
          var r = n(9670),
            i = n(9212);
          e.exports = function (e, t, n, o) {
            try {
              return o ? t(r(n)[0], n[1]) : t(n);
            } catch (t) {
              throw (i(e), t);
            }
          };
        },
        7072: function (e, t, n) {
          var r = n(5112)("iterator"),
            i = !1;
          try {
            var o = 0,
              a = {
                next: function () {
                  return { done: !!o++ };
                },
                return: function () {
                  i = !0;
                },
              };
            (a[r] = function () {
              return this;
            }),
              Array.from(a, function () {
                throw 2;
              });
          } catch (e) {}
          e.exports = function (e, t) {
            if (!t && !i) return !1;
            var n = !1;
            try {
              var o = {};
              (o[r] = function () {
                return {
                  next: function () {
                    return { done: (n = !0) };
                  },
                };
              }),
                e(o);
            } catch (e) {}
            return n;
          };
        },
        4326: function (e) {
          var t = {}.toString;
          e.exports = function (e) {
            return t.call(e).slice(8, -1);
          };
        },
        648: function (e, t, n) {
          var r = n(1694),
            i = n(4326),
            o = n(5112)("toStringTag"),
            a =
              "Arguments" ==
              i(
                (function () {
                  return arguments;
                })()
              );
          e.exports = r
            ? i
            : function (e) {
                var t, n, r;
                return void 0 === e
                  ? "Undefined"
                  : null === e
                  ? "Null"
                  : "string" ==
                    typeof (n = (function (e, t) {
                      try {
                        return e[t];
                      } catch (e) {}
                    })((t = Object(e)), o))
                  ? n
                  : a
                  ? i(t)
                  : "Object" == (r = i(t)) && "function" == typeof t.callee
                  ? "Arguments"
                  : r;
              };
        },
        9920: function (e, t, n) {
          var r = n(6656),
            i = n(3887),
            o = n(1236),
            a = n(3070);
          e.exports = function (e, t) {
            for (var n = i(t), u = a.f, s = o.f, l = 0; l < n.length; l++) {
              var c = n[l];
              r(e, c) || u(e, c, s(t, c));
            }
          };
        },
        8544: function (e, t, n) {
          var r = n(7293);
          e.exports = !r(function () {
            function e() {}
            return (
              (e.prototype.constructor = null),
              Object.getPrototypeOf(new e()) !== e.prototype
            );
          });
        },
        4994: function (e, t, n) {
          "use strict";
          var r = n(3383).IteratorPrototype,
            i = n(30),
            o = n(9114),
            a = n(8003),
            u = n(7497),
            s = function () {
              return this;
            };
          e.exports = function (e, t, n) {
            var l = t + " Iterator";
            return (
              (e.prototype = i(r, { next: o(1, n) })),
              a(e, l, !1, !0),
              (u[l] = s),
              e
            );
          };
        },
        8880: function (e, t, n) {
          var r = n(9781),
            i = n(3070),
            o = n(9114);
          e.exports = r
            ? function (e, t, n) {
                return i.f(e, t, o(1, n));
              }
            : function (e, t, n) {
                return (e[t] = n), e;
              };
        },
        9114: function (e) {
          e.exports = function (e, t) {
            return {
              enumerable: !(1 & e),
              configurable: !(2 & e),
              writable: !(4 & e),
              value: t,
            };
          };
        },
        6135: function (e, t, n) {
          "use strict";
          var r = n(7593),
            i = n(3070),
            o = n(9114);
          e.exports = function (e, t, n) {
            var a = r(t);
            a in e ? i.f(e, a, o(0, n)) : (e[a] = n);
          };
        },
        654: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(4994),
            o = n(9518),
            a = n(7674),
            u = n(8003),
            s = n(8880),
            l = n(1320),
            c = n(5112),
            f = n(1913),
            p = n(7497),
            h = n(3383),
            d = h.IteratorPrototype,
            v = h.BUGGY_SAFARI_ITERATORS,
            y = c("iterator"),
            g = "keys",
            m = "values",
            b = "entries",
            x = function () {
              return this;
            };
          e.exports = function (e, t, n, c, h, w, E) {
            i(n, t, c);
            var k,
              A,
              S,
              F = function (e) {
                if (e === h && I) return I;
                if (!v && e in L) return L[e];
                switch (e) {
                  case g:
                  case m:
                  case b:
                    return function () {
                      return new n(this, e);
                    };
                }
                return function () {
                  return new n(this);
                };
              },
              T = t + " Iterator",
              C = !1,
              L = e.prototype,
              R = L[y] || L["@@iterator"] || (h && L[h]),
              I = (!v && R) || F(h),
              U = ("Array" == t && L.entries) || R;
            if (
              (U &&
                ((k = o(U.call(new e()))),
                d !== Object.prototype &&
                  k.next &&
                  (f ||
                    o(k) === d ||
                    (a ? a(k, d) : "function" != typeof k[y] && s(k, y, x)),
                  u(k, T, !0, !0),
                  f && (p[T] = x))),
              h == m &&
                R &&
                R.name !== m &&
                ((C = !0),
                (I = function () {
                  return R.call(this);
                })),
              (f && !E) || L[y] === I || s(L, y, I),
              (p[t] = I),
              h)
            )
              if (
                ((A = { values: F(m), keys: w ? I : F(g), entries: F(b) }), E)
              )
                for (S in A) (v || C || !(S in L)) && l(L, S, A[S]);
              else r({ target: t, proto: !0, forced: v || C }, A);
            return A;
          };
        },
        9781: function (e, t, n) {
          var r = n(7293);
          e.exports = !r(function () {
            return (
              7 !=
              Object.defineProperty({}, 1, {
                get: function () {
                  return 7;
                },
              })[1]
            );
          });
        },
        317: function (e, t, n) {
          var r = n(7854),
            i = n(111),
            o = r.document,
            a = i(o) && i(o.createElement);
          e.exports = function (e) {
            return a ? o.createElement(e) : {};
          };
        },
        8324: function (e) {
          e.exports = {
            CSSRuleList: 0,
            CSSStyleDeclaration: 0,
            CSSValueList: 0,
            ClientRectList: 0,
            DOMRectList: 0,
            DOMStringList: 0,
            DOMTokenList: 1,
            DataTransferItemList: 0,
            FileList: 0,
            HTMLAllCollection: 0,
            HTMLCollection: 0,
            HTMLFormElement: 0,
            HTMLSelectElement: 0,
            MediaList: 0,
            MimeTypeArray: 0,
            NamedNodeMap: 0,
            NodeList: 1,
            PaintRequestList: 0,
            Plugin: 0,
            PluginArray: 0,
            SVGLengthList: 0,
            SVGNumberList: 0,
            SVGPathSegList: 0,
            SVGPointList: 0,
            SVGStringList: 0,
            SVGTransformList: 0,
            SourceBufferList: 0,
            StyleSheetList: 0,
            TextTrackCueList: 0,
            TextTrackList: 0,
            TouchList: 0,
          };
        },
        8113: function (e, t, n) {
          var r = n(5005);
          e.exports = r("navigator", "userAgent") || "";
        },
        7392: function (e, t, n) {
          var r,
            i,
            o = n(7854),
            a = n(8113),
            u = o.process,
            s = u && u.versions,
            l = s && s.v8;
          l
            ? (i = (r = l.split("."))[0] + r[1])
            : a &&
              (!(r = a.match(/Edge\/(\d+)/)) || r[1] >= 74) &&
              (r = a.match(/Chrome\/(\d+)/)) &&
              (i = r[1]),
            (e.exports = i && +i);
        },
        748: function (e) {
          e.exports = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf",
          ];
        },
        2109: function (e, t, n) {
          var r = n(7854),
            i = n(1236).f,
            o = n(8880),
            a = n(1320),
            u = n(3505),
            s = n(9920),
            l = n(4705);
          e.exports = function (e, t) {
            var n,
              c,
              f,
              p,
              h,
              d = e.target,
              v = e.global,
              y = e.stat;
            if ((n = v ? r : y ? r[d] || u(d, {}) : (r[d] || {}).prototype))
              for (c in t) {
                if (
                  ((p = t[c]),
                  (f = e.noTargetGet ? (h = i(n, c)) && h.value : n[c]),
                  !l(v ? c : d + (y ? "." : "#") + c, e.forced) && void 0 !== f)
                ) {
                  if (typeof p == typeof f) continue;
                  s(p, f);
                }
                (e.sham || (f && f.sham)) && o(p, "sham", !0), a(n, c, p, e);
              }
          };
        },
        7293: function (e) {
          e.exports = function (e) {
            try {
              return !!e();
            } catch (e) {
              return !0;
            }
          };
        },
        7007: function (e, t, n) {
          "use strict";
          n(4916);
          var r = n(1320),
            i = n(7293),
            o = n(5112),
            a = n(2261),
            u = n(8880),
            s = o("species"),
            l = !i(function () {
              var e = /./;
              return (
                (e.exec = function () {
                  var e = [];
                  return (e.groups = { a: "7" }), e;
                }),
                "7" !== "".replace(e, "$<a>")
              );
            }),
            c = "$0" === "a".replace(/./, "$0"),
            f = o("replace"),
            p = !!/./[f] && "" === /./[f]("a", "$0"),
            h = !i(function () {
              var e = /(?:)/,
                t = e.exec;
              e.exec = function () {
                return t.apply(this, arguments);
              };
              var n = "ab".split(e);
              return 2 !== n.length || "a" !== n[0] || "b" !== n[1];
            });
          e.exports = function (e, t, n, f) {
            var d = o(e),
              v = !i(function () {
                var t = {};
                return (
                  (t[d] = function () {
                    return 7;
                  }),
                  7 != ""[e](t)
                );
              }),
              y =
                v &&
                !i(function () {
                  var t = !1,
                    n = /a/;
                  return (
                    "split" === e &&
                      (((n = {}).constructor = {}),
                      (n.constructor[s] = function () {
                        return n;
                      }),
                      (n.flags = ""),
                      (n[d] = /./[d])),
                    (n.exec = function () {
                      return (t = !0), null;
                    }),
                    n[d](""),
                    !t
                  );
                });
            if (
              !v ||
              !y ||
              ("replace" === e && (!l || !c || p)) ||
              ("split" === e && !h)
            ) {
              var g = /./[d],
                m = n(
                  d,
                  ""[e],
                  function (e, t, n, r, i) {
                    return t.exec === a
                      ? v && !i
                        ? { done: !0, value: g.call(t, n, r) }
                        : { done: !0, value: e.call(n, t, r) }
                      : { done: !1 };
                  },
                  {
                    REPLACE_KEEPS_$0: c,
                    REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: p,
                  }
                ),
                b = m[0],
                x = m[1];
              r(String.prototype, e, b),
                r(
                  RegExp.prototype,
                  d,
                  2 == t
                    ? function (e, t) {
                        return x.call(e, this, t);
                      }
                    : function (e) {
                        return x.call(e, this);
                      }
                );
            }
            f && u(RegExp.prototype[d], "sham", !0);
          };
        },
        9974: function (e, t, n) {
          var r = n(3099);
          e.exports = function (e, t, n) {
            if ((r(e), void 0 === t)) return e;
            switch (n) {
              case 0:
                return function () {
                  return e.call(t);
                };
              case 1:
                return function (n) {
                  return e.call(t, n);
                };
              case 2:
                return function (n, r) {
                  return e.call(t, n, r);
                };
              case 3:
                return function (n, r, i) {
                  return e.call(t, n, r, i);
                };
            }
            return function () {
              return e.apply(t, arguments);
            };
          };
        },
        5005: function (e, t, n) {
          var r = n(857),
            i = n(7854),
            o = function (e) {
              return "function" == typeof e ? e : void 0;
            };
          e.exports = function (e, t) {
            return arguments.length < 2
              ? o(r[e]) || o(i[e])
              : (r[e] && r[e][t]) || (i[e] && i[e][t]);
          };
        },
        1246: function (e, t, n) {
          var r = n(648),
            i = n(7497),
            o = n(5112)("iterator");
          e.exports = function (e) {
            if (null != e) return e[o] || e["@@iterator"] || i[r(e)];
          };
        },
        8554: function (e, t, n) {
          var r = n(9670),
            i = n(1246);
          e.exports = function (e) {
            var t = i(e);
            if ("function" != typeof t)
              throw TypeError(String(e) + " is not iterable");
            return r(t.call(e));
          };
        },
        647: function (e, t, n) {
          var r = n(7908),
            i = Math.floor,
            o = "".replace,
            a = /\$([$&'`]|\d\d?|<[^>]*>)/g,
            u = /\$([$&'`]|\d\d?)/g;
          e.exports = function (e, t, n, s, l, c) {
            var f = n + e.length,
              p = s.length,
              h = u;
            return (
              void 0 !== l && ((l = r(l)), (h = a)),
              o.call(c, h, function (r, o) {
                var a;
                switch (o.charAt(0)) {
                  case "$":
                    return "$";
                  case "&":
                    return e;
                  case "`":
                    return t.slice(0, n);
                  case "'":
                    return t.slice(f);
                  case "<":
                    a = l[o.slice(1, -1)];
                    break;
                  default:
                    var u = +o;
                    if (0 === u) return r;
                    if (u > p) {
                      var c = i(u / 10);
                      return 0 === c
                        ? r
                        : c <= p
                        ? void 0 === s[c - 1]
                          ? o.charAt(1)
                          : s[c - 1] + o.charAt(1)
                        : r;
                    }
                    a = s[u - 1];
                }
                return void 0 === a ? "" : a;
              })
            );
          };
        },
        7854: function (e, t, n) {
          var r = function (e) {
            return e && e.Math == Math && e;
          };
          e.exports =
            r("object" == typeof globalThis && globalThis) ||
            r("object" == typeof window && window) ||
            r("object" == typeof self && self) ||
            r("object" == typeof n.g && n.g) ||
            (function () {
              return this;
            })() ||
            Function("return this")();
        },
        6656: function (e) {
          var t = {}.hasOwnProperty;
          e.exports = function (e, n) {
            return t.call(e, n);
          };
        },
        3501: function (e) {
          e.exports = {};
        },
        490: function (e, t, n) {
          var r = n(5005);
          e.exports = r("document", "documentElement");
        },
        4664: function (e, t, n) {
          var r = n(9781),
            i = n(7293),
            o = n(317);
          e.exports =
            !r &&
            !i(function () {
              return (
                7 !=
                Object.defineProperty(o("div"), "a", {
                  get: function () {
                    return 7;
                  },
                }).a
              );
            });
        },
        1179: function (e) {
          var t = Math.abs,
            n = Math.pow,
            r = Math.floor,
            i = Math.log,
            o = Math.LN2;
          e.exports = {
            pack: function (e, a, u) {
              var s,
                l,
                c,
                f = new Array(u),
                p = 8 * u - a - 1,
                h = (1 << p) - 1,
                d = h >> 1,
                v = 23 === a ? n(2, -24) - n(2, -77) : 0,
                y = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0,
                g = 0;
              for (
                (e = t(e)) != e || e === 1 / 0
                  ? ((l = e != e ? 1 : 0), (s = h))
                  : ((s = r(i(e) / o)),
                    e * (c = n(2, -s)) < 1 && (s--, (c *= 2)),
                    (e += s + d >= 1 ? v / c : v * n(2, 1 - d)) * c >= 2 &&
                      (s++, (c /= 2)),
                    s + d >= h
                      ? ((l = 0), (s = h))
                      : s + d >= 1
                      ? ((l = (e * c - 1) * n(2, a)), (s += d))
                      : ((l = e * n(2, d - 1) * n(2, a)), (s = 0)));
                a >= 8;
                f[g++] = 255 & l, l /= 256, a -= 8
              );
              for (
                s = (s << a) | l, p += a;
                p > 0;
                f[g++] = 255 & s, s /= 256, p -= 8
              );
              return (f[--g] |= 128 * y), f;
            },
            unpack: function (e, t) {
              var r,
                i = e.length,
                o = 8 * i - t - 1,
                a = (1 << o) - 1,
                u = a >> 1,
                s = o - 7,
                l = i - 1,
                c = e[l--],
                f = 127 & c;
              for (c >>= 7; s > 0; f = 256 * f + e[l], l--, s -= 8);
              for (
                r = f & ((1 << -s) - 1), f >>= -s, s += t;
                s > 0;
                r = 256 * r + e[l], l--, s -= 8
              );
              if (0 === f) f = 1 - u;
              else {
                if (f === a) return r ? NaN : c ? -1 / 0 : 1 / 0;
                (r += n(2, t)), (f -= u);
              }
              return (c ? -1 : 1) * r * n(2, f - t);
            },
          };
        },
        8361: function (e, t, n) {
          var r = n(7293),
            i = n(4326),
            o = "".split;
          e.exports = r(function () {
            return !Object("z").propertyIsEnumerable(0);
          })
            ? function (e) {
                return "String" == i(e) ? o.call(e, "") : Object(e);
              }
            : Object;
        },
        9587: function (e, t, n) {
          var r = n(111),
            i = n(7674);
          e.exports = function (e, t, n) {
            var o, a;
            return (
              i &&
                "function" == typeof (o = t.constructor) &&
                o !== n &&
                r((a = o.prototype)) &&
                a !== n.prototype &&
                i(e, a),
              e
            );
          };
        },
        2788: function (e, t, n) {
          var r = n(5465),
            i = Function.toString;
          "function" != typeof r.inspectSource &&
            (r.inspectSource = function (e) {
              return i.call(e);
            }),
            (e.exports = r.inspectSource);
        },
        9909: function (e, t, n) {
          var r,
            i,
            o,
            a = n(8536),
            u = n(7854),
            s = n(111),
            l = n(8880),
            c = n(6656),
            f = n(5465),
            p = n(6200),
            h = n(3501),
            d = u.WeakMap;
          if (a) {
            var v = f.state || (f.state = new d()),
              y = v.get,
              g = v.has,
              m = v.set;
            (r = function (e, t) {
              return (t.facade = e), m.call(v, e, t), t;
            }),
              (i = function (e) {
                return y.call(v, e) || {};
              }),
              (o = function (e) {
                return g.call(v, e);
              });
          } else {
            var b = p("state");
            (h[b] = !0),
              (r = function (e, t) {
                return (t.facade = e), l(e, b, t), t;
              }),
              (i = function (e) {
                return c(e, b) ? e[b] : {};
              }),
              (o = function (e) {
                return c(e, b);
              });
          }
          e.exports = {
            set: r,
            get: i,
            has: o,
            enforce: function (e) {
              return o(e) ? i(e) : r(e, {});
            },
            getterFor: function (e) {
              return function (t) {
                var n;
                if (!s(t) || (n = i(t)).type !== e)
                  throw TypeError("Incompatible receiver, " + e + " required");
                return n;
              };
            },
          };
        },
        7659: function (e, t, n) {
          var r = n(5112),
            i = n(7497),
            o = r("iterator"),
            a = Array.prototype;
          e.exports = function (e) {
            return void 0 !== e && (i.Array === e || a[o] === e);
          };
        },
        3157: function (e, t, n) {
          var r = n(4326);
          e.exports =
            Array.isArray ||
            function (e) {
              return "Array" == r(e);
            };
        },
        4705: function (e, t, n) {
          var r = n(7293),
            i = /#|\.prototype\./,
            o = function (e, t) {
              var n = u[a(e)];
              return (
                n == l || (n != s && ("function" == typeof t ? r(t) : !!t))
              );
            },
            a = (o.normalize = function (e) {
              return String(e).replace(i, ".").toLowerCase();
            }),
            u = (o.data = {}),
            s = (o.NATIVE = "N"),
            l = (o.POLYFILL = "P");
          e.exports = o;
        },
        111: function (e) {
          e.exports = function (e) {
            return "object" == typeof e ? null !== e : "function" == typeof e;
          };
        },
        1913: function (e) {
          e.exports = !1;
        },
        7850: function (e, t, n) {
          var r = n(111),
            i = n(4326),
            o = n(5112)("match");
          e.exports = function (e) {
            var t;
            return r(e) && (void 0 !== (t = e[o]) ? !!t : "RegExp" == i(e));
          };
        },
        9212: function (e, t, n) {
          var r = n(9670);
          e.exports = function (e) {
            var t = e.return;
            if (void 0 !== t) return r(t.call(e)).value;
          };
        },
        3383: function (e, t, n) {
          "use strict";
          var r,
            i,
            o,
            a = n(7293),
            u = n(9518),
            s = n(8880),
            l = n(6656),
            c = n(5112),
            f = n(1913),
            p = c("iterator"),
            h = !1;
          [].keys &&
            ("next" in (o = [].keys())
              ? (i = u(u(o))) !== Object.prototype && (r = i)
              : (h = !0));
          var d =
            null == r ||
            a(function () {
              var e = {};
              return r[p].call(e) !== e;
            });
          d && (r = {}),
            (f && !d) ||
              l(r, p) ||
              s(r, p, function () {
                return this;
              }),
            (e.exports = { IteratorPrototype: r, BUGGY_SAFARI_ITERATORS: h });
        },
        7497: function (e) {
          e.exports = {};
        },
        133: function (e, t, n) {
          var r = n(7293);
          e.exports =
            !!Object.getOwnPropertySymbols &&
            !r(function () {
              return !String(Symbol());
            });
        },
        590: function (e, t, n) {
          var r = n(7293),
            i = n(5112),
            o = n(1913),
            a = i("iterator");
          e.exports = !r(function () {
            var e = new URL("b?a=1&b=2&c=3", "http://a"),
              t = e.searchParams,
              n = "";
            return (
              (e.pathname = "c%20d"),
              t.forEach(function (e, r) {
                t.delete("b"), (n += r + e);
              }),
              (o && !e.toJSON) ||
                !t.sort ||
                "http://a/c%20d?a=1&c=3" !== e.href ||
                "3" !== t.get("c") ||
                "a=1" !== String(new URLSearchParams("?a=1")) ||
                !t[a] ||
                "a" !== new URL("https://a@b").username ||
                "b" !==
                  new URLSearchParams(new URLSearchParams("a=b")).get("a") ||
                "xn--e1aybc" !== new URL("http://тест").host ||
                "#%D0%B1" !== new URL("http://a#б").hash ||
                "a1c3" !== n ||
                "x" !== new URL("http://x", void 0).host
            );
          });
        },
        8536: function (e, t, n) {
          var r = n(7854),
            i = n(2788),
            o = r.WeakMap;
          e.exports = "function" == typeof o && /native code/.test(i(o));
        },
        1574: function (e, t, n) {
          "use strict";
          var r = n(9781),
            i = n(7293),
            o = n(1956),
            a = n(5181),
            u = n(5296),
            s = n(7908),
            l = n(8361),
            c = Object.assign,
            f = Object.defineProperty;
          e.exports =
            !c ||
            i(function () {
              if (
                r &&
                1 !==
                  c(
                    { b: 1 },
                    c(
                      f({}, "a", {
                        enumerable: !0,
                        get: function () {
                          f(this, "b", { value: 3, enumerable: !1 });
                        },
                      }),
                      { b: 2 }
                    )
                  ).b
              )
                return !0;
              var e = {},
                t = {},
                n = Symbol(),
                i = "abcdefghijklmnopqrst";
              return (
                (e[n] = 7),
                i.split("").forEach(function (e) {
                  t[e] = e;
                }),
                7 != c({}, e)[n] || o(c({}, t)).join("") != i
              );
            })
              ? function (e, t) {
                  for (
                    var n = s(e), i = arguments.length, c = 1, f = a.f, p = u.f;
                    i > c;

                  )
                    for (
                      var h,
                        d = l(arguments[c++]),
                        v = f ? o(d).concat(f(d)) : o(d),
                        y = v.length,
                        g = 0;
                      y > g;

                    )
                      (h = v[g++]), (r && !p.call(d, h)) || (n[h] = d[h]);
                  return n;
                }
              : c;
        },
        30: function (e, t, n) {
          var r,
            i = n(9670),
            o = n(6048),
            a = n(748),
            u = n(3501),
            s = n(490),
            l = n(317),
            c = n(6200)("IE_PROTO"),
            f = function () {},
            p = function (e) {
              return "<script>" + e + "</script>";
            },
            h = function () {
              try {
                r = document.domain && new ActiveXObject("htmlfile");
              } catch (e) {}
              var e, t;
              h = r
                ? (function (e) {
                    e.write(p("")), e.close();
                    var t = e.parentWindow.Object;
                    return (e = null), t;
                  })(r)
                : (((t = l("iframe")).style.display = "none"),
                  s.appendChild(t),
                  (t.src = String("javascript:")),
                  (e = t.contentWindow.document).open(),
                  e.write(p("document.F=Object")),
                  e.close(),
                  e.F);
              for (var n = a.length; n--; ) delete h.prototype[a[n]];
              return h();
            };
          (u[c] = !0),
            (e.exports =
              Object.create ||
              function (e, t) {
                var n;
                return (
                  null !== e
                    ? ((f.prototype = i(e)),
                      (n = new f()),
                      (f.prototype = null),
                      (n[c] = e))
                    : (n = h()),
                  void 0 === t ? n : o(n, t)
                );
              });
        },
        6048: function (e, t, n) {
          var r = n(9781),
            i = n(3070),
            o = n(9670),
            a = n(1956);
          e.exports = r
            ? Object.defineProperties
            : function (e, t) {
                o(e);
                for (var n, r = a(t), u = r.length, s = 0; u > s; )
                  i.f(e, (n = r[s++]), t[n]);
                return e;
              };
        },
        3070: function (e, t, n) {
          var r = n(9781),
            i = n(4664),
            o = n(9670),
            a = n(7593),
            u = Object.defineProperty;
          t.f = r
            ? u
            : function (e, t, n) {
                if ((o(e), (t = a(t, !0)), o(n), i))
                  try {
                    return u(e, t, n);
                  } catch (e) {}
                if ("get" in n || "set" in n)
                  throw TypeError("Accessors not supported");
                return "value" in n && (e[t] = n.value), e;
              };
        },
        1236: function (e, t, n) {
          var r = n(9781),
            i = n(5296),
            o = n(9114),
            a = n(5656),
            u = n(7593),
            s = n(6656),
            l = n(4664),
            c = Object.getOwnPropertyDescriptor;
          t.f = r
            ? c
            : function (e, t) {
                if (((e = a(e)), (t = u(t, !0)), l))
                  try {
                    return c(e, t);
                  } catch (e) {}
                if (s(e, t)) return o(!i.f.call(e, t), e[t]);
              };
        },
        8006: function (e, t, n) {
          var r = n(6324),
            i = n(748).concat("length", "prototype");
          t.f =
            Object.getOwnPropertyNames ||
            function (e) {
              return r(e, i);
            };
        },
        5181: function (e, t) {
          t.f = Object.getOwnPropertySymbols;
        },
        9518: function (e, t, n) {
          var r = n(6656),
            i = n(7908),
            o = n(6200),
            a = n(8544),
            u = o("IE_PROTO"),
            s = Object.prototype;
          e.exports = a
            ? Object.getPrototypeOf
            : function (e) {
                return (
                  (e = i(e)),
                  r(e, u)
                    ? e[u]
                    : "function" == typeof e.constructor &&
                      e instanceof e.constructor
                    ? e.constructor.prototype
                    : e instanceof Object
                    ? s
                    : null
                );
              };
        },
        6324: function (e, t, n) {
          var r = n(6656),
            i = n(5656),
            o = n(1318).indexOf,
            a = n(3501);
          e.exports = function (e, t) {
            var n,
              u = i(e),
              s = 0,
              l = [];
            for (n in u) !r(a, n) && r(u, n) && l.push(n);
            for (; t.length > s; )
              r(u, (n = t[s++])) && (~o(l, n) || l.push(n));
            return l;
          };
        },
        1956: function (e, t, n) {
          var r = n(6324),
            i = n(748);
          e.exports =
            Object.keys ||
            function (e) {
              return r(e, i);
            };
        },
        5296: function (e, t) {
          "use strict";
          var n = {}.propertyIsEnumerable,
            r = Object.getOwnPropertyDescriptor,
            i = r && !n.call({ 1: 2 }, 1);
          t.f = i
            ? function (e) {
                var t = r(this, e);
                return !!t && t.enumerable;
              }
            : n;
        },
        7674: function (e, t, n) {
          var r = n(9670),
            i = n(6077);
          e.exports =
            Object.setPrototypeOf ||
            ("__proto__" in {}
              ? (function () {
                  var e,
                    t = !1,
                    n = {};
                  try {
                    (e = Object.getOwnPropertyDescriptor(
                      Object.prototype,
                      "__proto__"
                    ).set).call(n, []),
                      (t = n instanceof Array);
                  } catch (e) {}
                  return function (n, o) {
                    return r(n), i(o), t ? e.call(n, o) : (n.__proto__ = o), n;
                  };
                })()
              : void 0);
        },
        288: function (e, t, n) {
          "use strict";
          var r = n(1694),
            i = n(648);
          e.exports = r
            ? {}.toString
            : function () {
                return "[object " + i(this) + "]";
              };
        },
        3887: function (e, t, n) {
          var r = n(5005),
            i = n(8006),
            o = n(5181),
            a = n(9670);
          e.exports =
            r("Reflect", "ownKeys") ||
            function (e) {
              var t = i.f(a(e)),
                n = o.f;
              return n ? t.concat(n(e)) : t;
            };
        },
        857: function (e, t, n) {
          var r = n(7854);
          e.exports = r;
        },
        2248: function (e, t, n) {
          var r = n(1320);
          e.exports = function (e, t, n) {
            for (var i in t) r(e, i, t[i], n);
            return e;
          };
        },
        1320: function (e, t, n) {
          var r = n(7854),
            i = n(8880),
            o = n(6656),
            a = n(3505),
            u = n(2788),
            s = n(9909),
            l = s.get,
            c = s.enforce,
            f = String(String).split("String");
          (e.exports = function (e, t, n, u) {
            var s,
              l = !!u && !!u.unsafe,
              p = !!u && !!u.enumerable,
              h = !!u && !!u.noTargetGet;
            "function" == typeof n &&
              ("string" != typeof t || o(n, "name") || i(n, "name", t),
              (s = c(n)).source ||
                (s.source = f.join("string" == typeof t ? t : ""))),
              e !== r
                ? (l ? !h && e[t] && (p = !0) : delete e[t],
                  p ? (e[t] = n) : i(e, t, n))
                : p
                ? (e[t] = n)
                : a(t, n);
          })(Function.prototype, "toString", function () {
            return ("function" == typeof this && l(this).source) || u(this);
          });
        },
        7651: function (e, t, n) {
          var r = n(4326),
            i = n(2261);
          e.exports = function (e, t) {
            var n = e.exec;
            if ("function" == typeof n) {
              var o = n.call(e, t);
              if ("object" != typeof o)
                throw TypeError(
                  "RegExp exec method returned something other than an Object or null"
                );
              return o;
            }
            if ("RegExp" !== r(e))
              throw TypeError("RegExp#exec called on incompatible receiver");
            return i.call(e, t);
          };
        },
        2261: function (e, t, n) {
          "use strict";
          var r,
            i,
            o = n(7066),
            a = n(2999),
            u = RegExp.prototype.exec,
            s = String.prototype.replace,
            l = u,
            c =
              ((r = /a/),
              (i = /b*/g),
              u.call(r, "a"),
              u.call(i, "a"),
              0 !== r.lastIndex || 0 !== i.lastIndex),
            f = a.UNSUPPORTED_Y || a.BROKEN_CARET,
            p = void 0 !== /()??/.exec("")[1];
          (c || p || f) &&
            (l = function (e) {
              var t,
                n,
                r,
                i,
                a = this,
                l = f && a.sticky,
                h = o.call(a),
                d = a.source,
                v = 0,
                y = e;
              return (
                l &&
                  (-1 === (h = h.replace("y", "")).indexOf("g") && (h += "g"),
                  (y = String(e).slice(a.lastIndex)),
                  a.lastIndex > 0 &&
                    (!a.multiline ||
                      (a.multiline && "\n" !== e[a.lastIndex - 1])) &&
                    ((d = "(?: " + d + ")"), (y = " " + y), v++),
                  (n = new RegExp("^(?:" + d + ")", h))),
                p && (n = new RegExp("^" + d + "$(?!\\s)", h)),
                c && (t = a.lastIndex),
                (r = u.call(l ? n : a, y)),
                l
                  ? r
                    ? ((r.input = r.input.slice(v)),
                      (r[0] = r[0].slice(v)),
                      (r.index = a.lastIndex),
                      (a.lastIndex += r[0].length))
                    : (a.lastIndex = 0)
                  : c &&
                    r &&
                    (a.lastIndex = a.global ? r.index + r[0].length : t),
                p &&
                  r &&
                  r.length > 1 &&
                  s.call(r[0], n, function () {
                    for (i = 1; i < arguments.length - 2; i++)
                      void 0 === arguments[i] && (r[i] = void 0);
                  }),
                r
              );
            }),
            (e.exports = l);
        },
        7066: function (e, t, n) {
          "use strict";
          var r = n(9670);
          e.exports = function () {
            var e = r(this),
              t = "";
            return (
              e.global && (t += "g"),
              e.ignoreCase && (t += "i"),
              e.multiline && (t += "m"),
              e.dotAll && (t += "s"),
              e.unicode && (t += "u"),
              e.sticky && (t += "y"),
              t
            );
          };
        },
        2999: function (e, t, n) {
          "use strict";
          var r = n(7293);
          function i(e, t) {
            return RegExp(e, t);
          }
          (t.UNSUPPORTED_Y = r(function () {
            var e = i("a", "y");
            return (e.lastIndex = 2), null != e.exec("abcd");
          })),
            (t.BROKEN_CARET = r(function () {
              var e = i("^r", "gy");
              return (e.lastIndex = 2), null != e.exec("str");
            }));
        },
        4488: function (e) {
          e.exports = function (e) {
            if (null == e) throw TypeError("Can't call method on " + e);
            return e;
          };
        },
        3505: function (e, t, n) {
          var r = n(7854),
            i = n(8880);
          e.exports = function (e, t) {
            try {
              i(r, e, t);
            } catch (n) {
              r[e] = t;
            }
            return t;
          };
        },
        6340: function (e, t, n) {
          "use strict";
          var r = n(5005),
            i = n(3070),
            o = n(5112),
            a = n(9781),
            u = o("species");
          e.exports = function (e) {
            var t = r(e),
              n = i.f;
            a &&
              t &&
              !t[u] &&
              n(t, u, {
                configurable: !0,
                get: function () {
                  return this;
                },
              });
          };
        },
        8003: function (e, t, n) {
          var r = n(3070).f,
            i = n(6656),
            o = n(5112)("toStringTag");
          e.exports = function (e, t, n) {
            e &&
              !i((e = n ? e : e.prototype), o) &&
              r(e, o, { configurable: !0, value: t });
          };
        },
        6200: function (e, t, n) {
          var r = n(2309),
            i = n(9711),
            o = r("keys");
          e.exports = function (e) {
            return o[e] || (o[e] = i(e));
          };
        },
        5465: function (e, t, n) {
          var r = n(7854),
            i = n(3505),
            o = "__core-js_shared__",
            a = r[o] || i(o, {});
          e.exports = a;
        },
        2309: function (e, t, n) {
          var r = n(1913),
            i = n(5465);
          (e.exports = function (e, t) {
            return i[e] || (i[e] = void 0 !== t ? t : {});
          })("versions", []).push({
            version: "3.9.0",
            mode: r ? "pure" : "global",
            copyright: "© 2021 Denis Pushkarev (zloirock.ru)",
          });
        },
        6707: function (e, t, n) {
          var r = n(9670),
            i = n(3099),
            o = n(5112)("species");
          e.exports = function (e, t) {
            var n,
              a = r(e).constructor;
            return void 0 === a || null == (n = r(a)[o]) ? t : i(n);
          };
        },
        8710: function (e, t, n) {
          var r = n(9958),
            i = n(4488),
            o = function (e) {
              return function (t, n) {
                var o,
                  a,
                  u = String(i(t)),
                  s = r(n),
                  l = u.length;
                return s < 0 || s >= l
                  ? e
                    ? ""
                    : void 0
                  : (o = u.charCodeAt(s)) < 55296 ||
                    o > 56319 ||
                    s + 1 === l ||
                    (a = u.charCodeAt(s + 1)) < 56320 ||
                    a > 57343
                  ? e
                    ? u.charAt(s)
                    : o
                  : e
                  ? u.slice(s, s + 2)
                  : a - 56320 + ((o - 55296) << 10) + 65536;
              };
            };
          e.exports = { codeAt: o(!1), charAt: o(!0) };
        },
        3197: function (e) {
          "use strict";
          var t = 2147483647,
            n = /[^\0-\u007E]/,
            r = /[.\u3002\uFF0E\uFF61]/g,
            i = "Overflow: input needs wider integers to process",
            o = Math.floor,
            a = String.fromCharCode,
            u = function (e) {
              return e + 22 + 75 * (e < 26);
            },
            s = function (e, t, n) {
              var r = 0;
              for (e = n ? o(e / 700) : e >> 1, e += o(e / t); e > 455; r += 36)
                e = o(e / 35);
              return o(r + (36 * e) / (e + 38));
            },
            l = function (e) {
              var n,
                r,
                l = [],
                c = (e = (function (e) {
                  for (var t = [], n = 0, r = e.length; n < r; ) {
                    var i = e.charCodeAt(n++);
                    if (i >= 55296 && i <= 56319 && n < r) {
                      var o = e.charCodeAt(n++);
                      56320 == (64512 & o)
                        ? t.push(((1023 & i) << 10) + (1023 & o) + 65536)
                        : (t.push(i), n--);
                    } else t.push(i);
                  }
                  return t;
                })(e)).length,
                f = 128,
                p = 0,
                h = 72;
              for (n = 0; n < e.length; n++) (r = e[n]) < 128 && l.push(a(r));
              var d = l.length,
                v = d;
              for (d && l.push("-"); v < c; ) {
                var y = t;
                for (n = 0; n < e.length; n++)
                  (r = e[n]) >= f && r < y && (y = r);
                var g = v + 1;
                if (y - f > o((t - p) / g)) throw RangeError(i);
                for (p += (y - f) * g, f = y, n = 0; n < e.length; n++) {
                  if ((r = e[n]) < f && ++p > t) throw RangeError(i);
                  if (r == f) {
                    for (var m = p, b = 36; ; b += 36) {
                      var x = b <= h ? 1 : b >= h + 26 ? 26 : b - h;
                      if (m < x) break;
                      var w = m - x,
                        E = 36 - x;
                      l.push(a(u(x + (w % E)))), (m = o(w / E));
                    }
                    l.push(a(u(m))), (h = s(p, g, v == d)), (p = 0), ++v;
                  }
                }
                ++p, ++f;
              }
              return l.join("");
            };
          e.exports = function (e) {
            var t,
              i,
              o = [],
              a = e.toLowerCase().replace(r, ".").split(".");
            for (t = 0; t < a.length; t++)
              (i = a[t]), o.push(n.test(i) ? "xn--" + l(i) : i);
            return o.join(".");
          };
        },
        6091: function (e, t, n) {
          var r = n(7293),
            i = n(1361);
          e.exports = function (e) {
            return r(function () {
              return !!i[e]() || "​᠎" != "​᠎"[e]() || i[e].name !== e;
            });
          };
        },
        3111: function (e, t, n) {
          var r = n(4488),
            i = "[" + n(1361) + "]",
            o = RegExp("^" + i + i + "*"),
            a = RegExp(i + i + "*$"),
            u = function (e) {
              return function (t) {
                var n = String(r(t));
                return (
                  1 & e && (n = n.replace(o, "")),
                  2 & e && (n = n.replace(a, "")),
                  n
                );
              };
            };
          e.exports = { start: u(1), end: u(2), trim: u(3) };
        },
        1400: function (e, t, n) {
          var r = n(9958),
            i = Math.max,
            o = Math.min;
          e.exports = function (e, t) {
            var n = r(e);
            return n < 0 ? i(n + t, 0) : o(n, t);
          };
        },
        7067: function (e, t, n) {
          var r = n(9958),
            i = n(7466);
          e.exports = function (e) {
            if (void 0 === e) return 0;
            var t = r(e),
              n = i(t);
            if (t !== n) throw RangeError("Wrong length or index");
            return n;
          };
        },
        5656: function (e, t, n) {
          var r = n(8361),
            i = n(4488);
          e.exports = function (e) {
            return r(i(e));
          };
        },
        9958: function (e) {
          var t = Math.ceil,
            n = Math.floor;
          e.exports = function (e) {
            return isNaN((e = +e)) ? 0 : (e > 0 ? n : t)(e);
          };
        },
        7466: function (e, t, n) {
          var r = n(9958),
            i = Math.min;
          e.exports = function (e) {
            return e > 0 ? i(r(e), 9007199254740991) : 0;
          };
        },
        7908: function (e, t, n) {
          var r = n(4488);
          e.exports = function (e) {
            return Object(r(e));
          };
        },
        4590: function (e, t, n) {
          var r = n(3002);
          e.exports = function (e, t) {
            var n = r(e);
            if (n % t) throw RangeError("Wrong offset");
            return n;
          };
        },
        3002: function (e, t, n) {
          var r = n(9958);
          e.exports = function (e) {
            var t = r(e);
            if (t < 0) throw RangeError("The argument can't be less than 0");
            return t;
          };
        },
        7593: function (e, t, n) {
          var r = n(111);
          e.exports = function (e, t) {
            if (!r(e)) return e;
            var n, i;
            if (
              t &&
              "function" == typeof (n = e.toString) &&
              !r((i = n.call(e)))
            )
              return i;
            if ("function" == typeof (n = e.valueOf) && !r((i = n.call(e))))
              return i;
            if (
              !t &&
              "function" == typeof (n = e.toString) &&
              !r((i = n.call(e)))
            )
              return i;
            throw TypeError("Can't convert object to primitive value");
          };
        },
        1694: function (e, t, n) {
          var r = {};
          (r[n(5112)("toStringTag")] = "z"),
            (e.exports = "[object z]" === String(r));
        },
        9843: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(7854),
            o = n(9781),
            a = n(3832),
            u = n(260),
            s = n(3331),
            l = n(5787),
            c = n(9114),
            f = n(8880),
            p = n(7466),
            h = n(7067),
            d = n(4590),
            v = n(7593),
            y = n(6656),
            g = n(648),
            m = n(111),
            b = n(30),
            x = n(7674),
            w = n(8006).f,
            E = n(7321),
            k = n(2092).forEach,
            A = n(6340),
            S = n(3070),
            F = n(1236),
            T = n(9909),
            C = n(9587),
            L = T.get,
            R = T.set,
            I = S.f,
            U = F.f,
            O = Math.round,
            _ = i.RangeError,
            M = s.ArrayBuffer,
            z = s.DataView,
            P = u.NATIVE_ARRAY_BUFFER_VIEWS,
            j = u.TYPED_ARRAY_TAG,
            D = u.TypedArray,
            N = u.TypedArrayPrototype,
            B = u.aTypedArrayConstructor,
            q = u.isTypedArray,
            W = "BYTES_PER_ELEMENT",
            H = "Wrong length",
            Y = function (e, t) {
              for (var n = 0, r = t.length, i = new (B(e))(r); r > n; )
                i[n] = t[n++];
              return i;
            },
            G = function (e, t) {
              I(e, t, {
                get: function () {
                  return L(this)[t];
                },
              });
            },
            Q = function (e) {
              var t;
              return (
                e instanceof M ||
                "ArrayBuffer" == (t = g(e)) ||
                "SharedArrayBuffer" == t
              );
            },
            $ = function (e, t) {
              return (
                q(e) &&
                "symbol" != typeof t &&
                t in e &&
                String(+t) == String(t)
              );
            },
            V = function (e, t) {
              return $(e, (t = v(t, !0))) ? c(2, e[t]) : U(e, t);
            },
            X = function (e, t, n) {
              return !($(e, (t = v(t, !0))) && m(n) && y(n, "value")) ||
                y(n, "get") ||
                y(n, "set") ||
                n.configurable ||
                (y(n, "writable") && !n.writable) ||
                (y(n, "enumerable") && !n.enumerable)
                ? I(e, t, n)
                : ((e[t] = n.value), e);
            };
          o
            ? (P ||
                ((F.f = V),
                (S.f = X),
                G(N, "buffer"),
                G(N, "byteOffset"),
                G(N, "byteLength"),
                G(N, "length")),
              r(
                { target: "Object", stat: !0, forced: !P },
                { getOwnPropertyDescriptor: V, defineProperty: X }
              ),
              (e.exports = function (e, t, n) {
                var o = e.match(/\d+$/)[0] / 8,
                  u = e + (n ? "Clamped" : "") + "Array",
                  s = "get" + e,
                  c = "set" + e,
                  v = i[u],
                  y = v,
                  g = y && y.prototype,
                  S = {},
                  F = function (e, t) {
                    I(e, t, {
                      get: function () {
                        return (function (e, t) {
                          var n = L(e);
                          return n.view[s](t * o + n.byteOffset, !0);
                        })(this, t);
                      },
                      set: function (e) {
                        return (function (e, t, r) {
                          var i = L(e);
                          n &&
                            (r = (r = O(r)) < 0 ? 0 : r > 255 ? 255 : 255 & r),
                            i.view[c](t * o + i.byteOffset, r, !0);
                        })(this, t, e);
                      },
                      enumerable: !0,
                    });
                  };
                P
                  ? a &&
                    ((y = t(function (e, t, n, r) {
                      return (
                        l(e, y, u),
                        C(
                          m(t)
                            ? Q(t)
                              ? void 0 !== r
                                ? new v(t, d(n, o), r)
                                : void 0 !== n
                                ? new v(t, d(n, o))
                                : new v(t)
                              : q(t)
                              ? Y(y, t)
                              : E.call(y, t)
                            : new v(h(t)),
                          e,
                          y
                        )
                      );
                    })),
                    x && x(y, D),
                    k(w(v), function (e) {
                      e in y || f(y, e, v[e]);
                    }),
                    (y.prototype = g))
                  : ((y = t(function (e, t, n, r) {
                      l(e, y, u);
                      var i,
                        a,
                        s,
                        c = 0,
                        f = 0;
                      if (m(t)) {
                        if (!Q(t)) return q(t) ? Y(y, t) : E.call(y, t);
                        (i = t), (f = d(n, o));
                        var v = t.byteLength;
                        if (void 0 === r) {
                          if (v % o) throw _(H);
                          if ((a = v - f) < 0) throw _(H);
                        } else if ((a = p(r) * o) + f > v) throw _(H);
                        s = a / o;
                      } else (s = h(t)), (i = new M((a = s * o)));
                      for (
                        R(e, {
                          buffer: i,
                          byteOffset: f,
                          byteLength: a,
                          length: s,
                          view: new z(i),
                        });
                        c < s;

                      )
                        F(e, c++);
                    })),
                    x && x(y, D),
                    (g = y.prototype = b(N))),
                  g.constructor !== y && f(g, "constructor", y),
                  j && f(g, j, u),
                  (S[u] = y),
                  r({ global: !0, forced: y != v, sham: !P }, S),
                  W in y || f(y, W, o),
                  W in g || f(g, W, o),
                  A(u);
              }))
            : (e.exports = function () {});
        },
        3832: function (e, t, n) {
          var r = n(7854),
            i = n(7293),
            o = n(7072),
            a = n(260).NATIVE_ARRAY_BUFFER_VIEWS,
            u = r.ArrayBuffer,
            s = r.Int8Array;
          e.exports =
            !a ||
            !i(function () {
              s(1);
            }) ||
            !i(function () {
              new s(-1);
            }) ||
            !o(function (e) {
              new s(), new s(null), new s(1.5), new s(e);
            }, !0) ||
            i(function () {
              return 1 !== new s(new u(2), 1, void 0).length;
            });
        },
        3074: function (e, t, n) {
          var r = n(260).aTypedArrayConstructor,
            i = n(6707);
          e.exports = function (e, t) {
            for (
              var n = i(e, e.constructor),
                o = 0,
                a = t.length,
                u = new (r(n))(a);
              a > o;

            )
              u[o] = t[o++];
            return u;
          };
        },
        7321: function (e, t, n) {
          var r = n(7908),
            i = n(7466),
            o = n(1246),
            a = n(7659),
            u = n(9974),
            s = n(260).aTypedArrayConstructor;
          e.exports = function (e) {
            var t,
              n,
              l,
              c,
              f,
              p,
              h = r(e),
              d = arguments.length,
              v = d > 1 ? arguments[1] : void 0,
              y = void 0 !== v,
              g = o(h);
            if (null != g && !a(g))
              for (p = (f = g.call(h)).next, h = []; !(c = p.call(f)).done; )
                h.push(c.value);
            for (
              y && d > 2 && (v = u(v, arguments[2], 2)),
                n = i(h.length),
                l = new (s(this))(n),
                t = 0;
              n > t;
              t++
            )
              l[t] = y ? v(h[t], t) : h[t];
            return l;
          };
        },
        9711: function (e) {
          var t = 0,
            n = Math.random();
          e.exports = function (e) {
            return (
              "Symbol(" +
              String(void 0 === e ? "" : e) +
              ")_" +
              (++t + n).toString(36)
            );
          };
        },
        3307: function (e, t, n) {
          var r = n(133);
          e.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator;
        },
        5112: function (e, t, n) {
          var r = n(7854),
            i = n(2309),
            o = n(6656),
            a = n(9711),
            u = n(133),
            s = n(3307),
            l = i("wks"),
            c = r.Symbol,
            f = s ? c : (c && c.withoutSetter) || a;
          e.exports = function (e) {
            return (
              o(l, e) ||
                (u && o(c, e) ? (l[e] = c[e]) : (l[e] = f("Symbol." + e))),
              l[e]
            );
          };
        },
        1361: function (e) {
          e.exports = "\t\n\v\f\r                　\u2028\u2029\ufeff";
        },
        8264: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(7854),
            o = n(3331),
            a = n(6340),
            u = o.ArrayBuffer;
          r({ global: !0, forced: i.ArrayBuffer !== u }, { ArrayBuffer: u }),
            a("ArrayBuffer");
        },
        2222: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(7293),
            o = n(3157),
            a = n(111),
            u = n(7908),
            s = n(7466),
            l = n(6135),
            c = n(5417),
            f = n(1194),
            p = n(5112),
            h = n(7392),
            d = p("isConcatSpreadable"),
            v = 9007199254740991,
            y = "Maximum allowed index exceeded",
            g =
              h >= 51 ||
              !i(function () {
                var e = [];
                return (e[d] = !1), e.concat()[0] !== e;
              }),
            m = f("concat"),
            b = function (e) {
              if (!a(e)) return !1;
              var t = e[d];
              return void 0 !== t ? !!t : o(e);
            };
          r(
            { target: "Array", proto: !0, forced: !g || !m },
            {
              concat: function (e) {
                var t,
                  n,
                  r,
                  i,
                  o,
                  a = u(this),
                  f = c(a, 0),
                  p = 0;
                for (t = -1, r = arguments.length; t < r; t++)
                  if (b((o = -1 === t ? a : arguments[t]))) {
                    if (p + (i = s(o.length)) > v) throw TypeError(y);
                    for (n = 0; n < i; n++, p++) n in o && l(f, p, o[n]);
                  } else {
                    if (p >= v) throw TypeError(y);
                    l(f, p++, o);
                  }
                return (f.length = p), f;
              },
            }
          );
        },
        7327: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(2092).filter;
          r(
            { target: "Array", proto: !0, forced: !n(1194)("filter") },
            {
              filter: function (e) {
                return i(this, e, arguments.length > 1 ? arguments[1] : void 0);
              },
            }
          );
        },
        2772: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(1318).indexOf,
            o = n(9341),
            a = [].indexOf,
            u = !!a && 1 / [1].indexOf(1, -0) < 0,
            s = o("indexOf");
          r(
            { target: "Array", proto: !0, forced: u || !s },
            {
              indexOf: function (e) {
                return u
                  ? a.apply(this, arguments) || 0
                  : i(this, e, arguments.length > 1 ? arguments[1] : void 0);
              },
            }
          );
        },
        6992: function (e, t, n) {
          "use strict";
          var r = n(5656),
            i = n(1223),
            o = n(7497),
            a = n(9909),
            u = n(654),
            s = "Array Iterator",
            l = a.set,
            c = a.getterFor(s);
          (e.exports = u(
            Array,
            "Array",
            function (e, t) {
              l(this, { type: s, target: r(e), index: 0, kind: t });
            },
            function () {
              var e = c(this),
                t = e.target,
                n = e.kind,
                r = e.index++;
              return !t || r >= t.length
                ? ((e.target = void 0), { value: void 0, done: !0 })
                : "keys" == n
                ? { value: r, done: !1 }
                : "values" == n
                ? { value: t[r], done: !1 }
                : { value: [r, t[r]], done: !1 };
            },
            "values"
          )),
            (o.Arguments = o.Array),
            i("keys"),
            i("values"),
            i("entries");
        },
        1249: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(2092).map;
          r(
            { target: "Array", proto: !0, forced: !n(1194)("map") },
            {
              map: function (e) {
                return i(this, e, arguments.length > 1 ? arguments[1] : void 0);
              },
            }
          );
        },
        7042: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(111),
            o = n(3157),
            a = n(1400),
            u = n(7466),
            s = n(5656),
            l = n(6135),
            c = n(5112),
            f = n(1194)("slice"),
            p = c("species"),
            h = [].slice,
            d = Math.max;
          r(
            { target: "Array", proto: !0, forced: !f },
            {
              slice: function (e, t) {
                var n,
                  r,
                  c,
                  f = s(this),
                  v = u(f.length),
                  y = a(e, v),
                  g = a(void 0 === t ? v : t, v);
                if (
                  o(f) &&
                  ("function" != typeof (n = f.constructor) ||
                  (n !== Array && !o(n.prototype))
                    ? i(n) && null === (n = n[p]) && (n = void 0)
                    : (n = void 0),
                  n === Array || void 0 === n)
                )
                  return h.call(f, y, g);
                for (
                  r = new (void 0 === n ? Array : n)(d(g - y, 0)), c = 0;
                  y < g;
                  y++, c++
                )
                  y in f && l(r, c, f[y]);
                return (r.length = c), r;
              },
            }
          );
        },
        561: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(1400),
            o = n(9958),
            a = n(7466),
            u = n(7908),
            s = n(5417),
            l = n(6135),
            c = n(1194)("splice"),
            f = Math.max,
            p = Math.min,
            h = 9007199254740991,
            d = "Maximum allowed length exceeded";
          r(
            { target: "Array", proto: !0, forced: !c },
            {
              splice: function (e, t) {
                var n,
                  r,
                  c,
                  v,
                  y,
                  g,
                  m = u(this),
                  b = a(m.length),
                  x = i(e, b),
                  w = arguments.length;
                if (
                  (0 === w
                    ? (n = r = 0)
                    : 1 === w
                    ? ((n = 0), (r = b - x))
                    : ((n = w - 2), (r = p(f(o(t), 0), b - x))),
                  b + n - r > h)
                )
                  throw TypeError(d);
                for (c = s(m, r), v = 0; v < r; v++)
                  (y = x + v) in m && l(c, v, m[y]);
                if (((c.length = r), n < r)) {
                  for (v = x; v < b - r; v++)
                    (g = v + n), (y = v + r) in m ? (m[g] = m[y]) : delete m[g];
                  for (v = b; v > b - r + n; v--) delete m[v - 1];
                } else if (n > r)
                  for (v = b - r; v > x; v--)
                    (g = v + n - 1),
                      (y = v + r - 1) in m ? (m[g] = m[y]) : delete m[g];
                for (v = 0; v < n; v++) m[v + x] = arguments[v + 2];
                return (m.length = b - r + n), c;
              },
            }
          );
        },
        8309: function (e, t, n) {
          var r = n(9781),
            i = n(3070).f,
            o = Function.prototype,
            a = o.toString,
            u = /^\s*function ([^ (]*)/,
            s = "name";
          r &&
            !(s in o) &&
            i(o, s, {
              configurable: !0,
              get: function () {
                try {
                  return a.call(this).match(u)[1];
                } catch (e) {
                  return "";
                }
              },
            });
        },
        489: function (e, t, n) {
          var r = n(2109),
            i = n(7293),
            o = n(7908),
            a = n(9518),
            u = n(8544);
          r(
            {
              target: "Object",
              stat: !0,
              forced: i(function () {
                a(1);
              }),
              sham: !u,
            },
            {
              getPrototypeOf: function (e) {
                return a(o(e));
              },
            }
          );
        },
        1539: function (e, t, n) {
          var r = n(1694),
            i = n(1320),
            o = n(288);
          r || i(Object.prototype, "toString", o, { unsafe: !0 });
        },
        4916: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(2261);
          r(
            { target: "RegExp", proto: !0, forced: /./.exec !== i },
            { exec: i }
          );
        },
        9714: function (e, t, n) {
          "use strict";
          var r = n(1320),
            i = n(9670),
            o = n(7293),
            a = n(7066),
            u = "toString",
            s = RegExp.prototype,
            l = s.toString,
            c = o(function () {
              return "/a/b" != l.call({ source: "a", flags: "b" });
            }),
            f = l.name != u;
          (c || f) &&
            r(
              RegExp.prototype,
              u,
              function () {
                var e = i(this),
                  t = String(e.source),
                  n = e.flags;
                return (
                  "/" +
                  t +
                  "/" +
                  String(
                    void 0 === n && e instanceof RegExp && !("flags" in s)
                      ? a.call(e)
                      : n
                  )
                );
              },
              { unsafe: !0 }
            );
        },
        8783: function (e, t, n) {
          "use strict";
          var r = n(8710).charAt,
            i = n(9909),
            o = n(654),
            a = "String Iterator",
            u = i.set,
            s = i.getterFor(a);
          o(
            String,
            "String",
            function (e) {
              u(this, { type: a, string: String(e), index: 0 });
            },
            function () {
              var e,
                t = s(this),
                n = t.string,
                i = t.index;
              return i >= n.length
                ? { value: void 0, done: !0 }
                : ((e = r(n, i)),
                  (t.index += e.length),
                  { value: e, done: !1 });
            }
          );
        },
        4723: function (e, t, n) {
          "use strict";
          var r = n(7007),
            i = n(9670),
            o = n(7466),
            a = n(4488),
            u = n(1530),
            s = n(7651);
          r("match", 1, function (e, t, n) {
            return [
              function (t) {
                var n = a(this),
                  r = null == t ? void 0 : t[e];
                return void 0 !== r
                  ? r.call(t, n)
                  : new RegExp(t)[e](String(n));
              },
              function (e) {
                var r = n(t, e, this);
                if (r.done) return r.value;
                var a = i(e),
                  l = String(this);
                if (!a.global) return s(a, l);
                var c = a.unicode;
                a.lastIndex = 0;
                for (var f, p = [], h = 0; null !== (f = s(a, l)); ) {
                  var d = String(f[0]);
                  (p[h] = d),
                    "" === d && (a.lastIndex = u(l, o(a.lastIndex), c)),
                    h++;
                }
                return 0 === h ? null : p;
              },
            ];
          });
        },
        5306: function (e, t, n) {
          "use strict";
          var r = n(7007),
            i = n(9670),
            o = n(7466),
            a = n(9958),
            u = n(4488),
            s = n(1530),
            l = n(647),
            c = n(7651),
            f = Math.max,
            p = Math.min;
          r("replace", 2, function (e, t, n, r) {
            var h = r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
              d = r.REPLACE_KEEPS_$0,
              v = h ? "$" : "$0";
            return [
              function (n, r) {
                var i = u(this),
                  o = null == n ? void 0 : n[e];
                return void 0 !== o ? o.call(n, i, r) : t.call(String(i), n, r);
              },
              function (e, r) {
                if (
                  (!h && d) ||
                  ("string" == typeof r && -1 === r.indexOf(v))
                ) {
                  var u = n(t, e, this, r);
                  if (u.done) return u.value;
                }
                var y = i(e),
                  g = String(this),
                  m = "function" == typeof r;
                m || (r = String(r));
                var b = y.global;
                if (b) {
                  var x = y.unicode;
                  y.lastIndex = 0;
                }
                for (var w = []; ; ) {
                  var E = c(y, g);
                  if (null === E) break;
                  if ((w.push(E), !b)) break;
                  "" === String(E[0]) &&
                    (y.lastIndex = s(g, o(y.lastIndex), x));
                }
                for (var k, A = "", S = 0, F = 0; F < w.length; F++) {
                  E = w[F];
                  for (
                    var T = String(E[0]),
                      C = f(p(a(E.index), g.length), 0),
                      L = [],
                      R = 1;
                    R < E.length;
                    R++
                  )
                    L.push(void 0 === (k = E[R]) ? k : String(k));
                  var I = E.groups;
                  if (m) {
                    var U = [T].concat(L, C, g);
                    void 0 !== I && U.push(I);
                    var O = String(r.apply(void 0, U));
                  } else O = l(T, g, C, L, I, r);
                  C >= S && ((A += g.slice(S, C) + O), (S = C + T.length));
                }
                return A + g.slice(S);
              },
            ];
          });
        },
        3123: function (e, t, n) {
          "use strict";
          var r = n(7007),
            i = n(7850),
            o = n(9670),
            a = n(4488),
            u = n(6707),
            s = n(1530),
            l = n(7466),
            c = n(7651),
            f = n(2261),
            p = n(7293),
            h = [].push,
            d = Math.min,
            v = 4294967295,
            y = !p(function () {
              return !RegExp(v, "y");
            });
          r(
            "split",
            2,
            function (e, t, n) {
              var r;
              return (
                (r =
                  "c" == "abbc".split(/(b)*/)[1] ||
                  4 != "test".split(/(?:)/, -1).length ||
                  2 != "ab".split(/(?:ab)*/).length ||
                  4 != ".".split(/(.?)(.?)/).length ||
                  ".".split(/()()/).length > 1 ||
                  "".split(/.?/).length
                    ? function (e, n) {
                        var r = String(a(this)),
                          o = void 0 === n ? v : n >>> 0;
                        if (0 === o) return [];
                        if (void 0 === e) return [r];
                        if (!i(e)) return t.call(r, e, o);
                        for (
                          var u,
                            s,
                            l,
                            c = [],
                            p =
                              (e.ignoreCase ? "i" : "") +
                              (e.multiline ? "m" : "") +
                              (e.unicode ? "u" : "") +
                              (e.sticky ? "y" : ""),
                            d = 0,
                            y = new RegExp(e.source, p + "g");
                          (u = f.call(y, r)) &&
                          !(
                            (s = y.lastIndex) > d &&
                            (c.push(r.slice(d, u.index)),
                            u.length > 1 &&
                              u.index < r.length &&
                              h.apply(c, u.slice(1)),
                            (l = u[0].length),
                            (d = s),
                            c.length >= o)
                          );

                        )
                          y.lastIndex === u.index && y.lastIndex++;
                        return (
                          d === r.length
                            ? (!l && y.test("")) || c.push("")
                            : c.push(r.slice(d)),
                          c.length > o ? c.slice(0, o) : c
                        );
                      }
                    : "0".split(void 0, 0).length
                    ? function (e, n) {
                        return void 0 === e && 0 === n
                          ? []
                          : t.call(this, e, n);
                      }
                    : t),
                [
                  function (t, n) {
                    var i = a(this),
                      o = null == t ? void 0 : t[e];
                    return void 0 !== o
                      ? o.call(t, i, n)
                      : r.call(String(i), t, n);
                  },
                  function (e, i) {
                    var a = n(r, e, this, i, r !== t);
                    if (a.done) return a.value;
                    var f = o(e),
                      p = String(this),
                      h = u(f, RegExp),
                      g = f.unicode,
                      m =
                        (f.ignoreCase ? "i" : "") +
                        (f.multiline ? "m" : "") +
                        (f.unicode ? "u" : "") +
                        (y ? "y" : "g"),
                      b = new h(y ? f : "^(?:" + f.source + ")", m),
                      x = void 0 === i ? v : i >>> 0;
                    if (0 === x) return [];
                    if (0 === p.length) return null === c(b, p) ? [p] : [];
                    for (var w = 0, E = 0, k = []; E < p.length; ) {
                      b.lastIndex = y ? E : 0;
                      var A,
                        S = c(b, y ? p : p.slice(E));
                      if (
                        null === S ||
                        (A = d(l(b.lastIndex + (y ? 0 : E)), p.length)) === w
                      )
                        E = s(p, E, g);
                      else {
                        if ((k.push(p.slice(w, E)), k.length === x)) return k;
                        for (var F = 1; F <= S.length - 1; F++)
                          if ((k.push(S[F]), k.length === x)) return k;
                        E = w = A;
                      }
                    }
                    return k.push(p.slice(w)), k;
                  },
                ]
              );
            },
            !y
          );
        },
        3210: function (e, t, n) {
          "use strict";
          var r = n(2109),
            i = n(3111).trim;
          r(
            { target: "String", proto: !0, forced: n(6091)("trim") },
            {
              trim: function () {
                return i(this);
              },
            }
          );
        },
        2990: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(1048),
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("copyWithin", function (e, t) {
            return i.call(
              o(this),
              e,
              t,
              arguments.length > 2 ? arguments[2] : void 0
            );
          });
        },
        8927: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).every,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("every", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        3105: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(1285),
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("fill", function (e) {
            return i.apply(o(this), arguments);
          });
        },
        5035: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).filter,
            o = n(3074),
            a = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("filter", function (e) {
            var t = i(a(this), e, arguments.length > 1 ? arguments[1] : void 0);
            return o(this, t);
          });
        },
        7174: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).findIndex,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("findIndex", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        4345: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).find,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("find", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        2846: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).forEach,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("forEach", function (e) {
            i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        4731: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(1318).includes,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("includes", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        7209: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(1318).indexOf,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("indexOf", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        6319: function (e, t, n) {
          "use strict";
          var r = n(7854),
            i = n(260),
            o = n(6992),
            a = n(5112)("iterator"),
            u = r.Uint8Array,
            s = o.values,
            l = o.keys,
            c = o.entries,
            f = i.aTypedArray,
            p = i.exportTypedArrayMethod,
            h = u && u.prototype[a],
            d = !!h && ("values" == h.name || null == h.name),
            v = function () {
              return s.call(f(this));
            };
          p("entries", function () {
            return c.call(f(this));
          }),
            p("keys", function () {
              return l.call(f(this));
            }),
            p("values", v, !d),
            p(a, v, !d);
        },
        8867: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = r.aTypedArray,
            o = r.exportTypedArrayMethod,
            a = [].join;
          o("join", function (e) {
            return a.apply(i(this), arguments);
          });
        },
        7789: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(6583),
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("lastIndexOf", function (e) {
            return i.apply(o(this), arguments);
          });
        },
        3739: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).map,
            o = n(6707),
            a = r.aTypedArray,
            u = r.aTypedArrayConstructor;
          (0, r.exportTypedArrayMethod)("map", function (e) {
            return i(
              a(this),
              e,
              arguments.length > 1 ? arguments[1] : void 0,
              function (e, t) {
                return new (u(o(e, e.constructor)))(t);
              }
            );
          });
        },
        4483: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(3671).right,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("reduceRight", function (e) {
            return i(
              o(this),
              e,
              arguments.length,
              arguments.length > 1 ? arguments[1] : void 0
            );
          });
        },
        9368: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(3671).left,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("reduce", function (e) {
            return i(
              o(this),
              e,
              arguments.length,
              arguments.length > 1 ? arguments[1] : void 0
            );
          });
        },
        2056: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = r.aTypedArray,
            o = r.exportTypedArrayMethod,
            a = Math.floor;
          o("reverse", function () {
            for (var e, t = this, n = i(t).length, r = a(n / 2), o = 0; o < r; )
              (e = t[o]), (t[o++] = t[--n]), (t[n] = e);
            return t;
          });
        },
        3462: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(7466),
            o = n(4590),
            a = n(7908),
            u = n(7293),
            s = r.aTypedArray;
          (0, r.exportTypedArrayMethod)(
            "set",
            function (e) {
              s(this);
              var t = o(arguments.length > 1 ? arguments[1] : void 0, 1),
                n = this.length,
                r = a(e),
                u = i(r.length),
                l = 0;
              if (u + t > n) throw RangeError("Wrong length");
              for (; l < u; ) this[t + l] = r[l++];
            },
            u(function () {
              new Int8Array(1).set({});
            })
          );
        },
        678: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(6707),
            o = n(7293),
            a = r.aTypedArray,
            u = r.aTypedArrayConstructor,
            s = r.exportTypedArrayMethod,
            l = [].slice;
          s(
            "slice",
            function (e, t) {
              for (
                var n = l.call(a(this), e, t),
                  r = i(this, this.constructor),
                  o = 0,
                  s = n.length,
                  c = new (u(r))(s);
                s > o;

              )
                c[o] = n[o++];
              return c;
            },
            o(function () {
              new Int8Array(1).slice();
            })
          );
        },
        7462: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(2092).some,
            o = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("some", function (e) {
            return i(o(this), e, arguments.length > 1 ? arguments[1] : void 0);
          });
        },
        3824: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = r.aTypedArray,
            o = r.exportTypedArrayMethod,
            a = [].sort;
          o("sort", function (e) {
            return a.call(i(this), e);
          });
        },
        5021: function (e, t, n) {
          "use strict";
          var r = n(260),
            i = n(7466),
            o = n(1400),
            a = n(6707),
            u = r.aTypedArray;
          (0, r.exportTypedArrayMethod)("subarray", function (e, t) {
            var n = u(this),
              r = n.length,
              s = o(e, r);
            return new (a(n, n.constructor))(
              n.buffer,
              n.byteOffset + s * n.BYTES_PER_ELEMENT,
              i((void 0 === t ? r : o(t, r)) - s)
            );
          });
        },
        2974: function (e, t, n) {
          "use strict";
          var r = n(7854),
            i = n(260),
            o = n(7293),
            a = r.Int8Array,
            u = i.aTypedArray,
            s = i.exportTypedArrayMethod,
            l = [].toLocaleString,
            c = [].slice,
            f =
              !!a &&
              o(function () {
                l.call(new a(1));
              });
          s(
            "toLocaleString",
            function () {
              return l.apply(f ? c.call(u(this)) : u(this), arguments);
            },
            o(function () {
              return [1, 2].toLocaleString() != new a([1, 2]).toLocaleString();
            }) ||
              !o(function () {
                a.prototype.toLocaleString.call([1, 2]);
              })
          );
        },
        5016: function (e, t, n) {
          "use strict";
          var r = n(260).exportTypedArrayMethod,
            i = n(7293),
            o = n(7854).Uint8Array,
            a = (o && o.prototype) || {},
            u = [].toString,
            s = [].join;
          i(function () {
            u.call({});
          }) &&
            (u = function () {
              return s.call(this);
            });
          var l = a.toString != u;
          r("toString", u, l);
        },
        2472: function (e, t, n) {
          n(9843)("Uint8", function (e) {
            return function (t, n, r) {
              return e(this, t, n, r);
            };
          });
        },
        4747: function (e, t, n) {
          var r = n(7854),
            i = n(8324),
            o = n(8533),
            a = n(8880);
          for (var u in i) {
            var s = r[u],
              l = s && s.prototype;
            if (l && l.forEach !== o)
              try {
                a(l, "forEach", o);
              } catch (e) {
                l.forEach = o;
              }
          }
        },
        3948: function (e, t, n) {
          var r = n(7854),
            i = n(8324),
            o = n(6992),
            a = n(8880),
            u = n(5112),
            s = u("iterator"),
            l = u("toStringTag"),
            c = o.values;
          for (var f in i) {
            var p = r[f],
              h = p && p.prototype;
            if (h) {
              if (h[s] !== c)
                try {
                  a(h, s, c);
                } catch (e) {
                  h[s] = c;
                }
              if ((h[l] || a(h, l, f), i[f]))
                for (var d in o)
                  if (h[d] !== o[d])
                    try {
                      a(h, d, o[d]);
                    } catch (e) {
                      h[d] = o[d];
                    }
            }
          }
        },
        1637: function (e, t, n) {
          "use strict";
          n(6992);
          var r = n(2109),
            i = n(5005),
            o = n(590),
            a = n(1320),
            u = n(2248),
            s = n(8003),
            l = n(4994),
            c = n(9909),
            f = n(5787),
            p = n(6656),
            h = n(9974),
            d = n(648),
            v = n(9670),
            y = n(111),
            g = n(30),
            m = n(9114),
            b = n(8554),
            x = n(1246),
            w = n(5112),
            E = i("fetch"),
            k = i("Headers"),
            A = w("iterator"),
            S = "URLSearchParams",
            F = "URLSearchParamsIterator",
            T = c.set,
            C = c.getterFor(S),
            L = c.getterFor(F),
            R = /\+/g,
            I = Array(4),
            U = function (e) {
              return (
                I[e - 1] ||
                (I[e - 1] = RegExp("((?:%[\\da-f]{2}){" + e + "})", "gi"))
              );
            },
            O = function (e) {
              try {
                return decodeURIComponent(e);
              } catch (t) {
                return e;
              }
            },
            _ = function (e) {
              var t = e.replace(R, " "),
                n = 4;
              try {
                return decodeURIComponent(t);
              } catch (e) {
                for (; n; ) t = t.replace(U(n--), O);
                return t;
              }
            },
            M = /[!'()~]|%20/g,
            z = {
              "!": "%21",
              "'": "%27",
              "(": "%28",
              ")": "%29",
              "~": "%7E",
              "%20": "+",
            },
            P = function (e) {
              return z[e];
            },
            j = function (e) {
              return encodeURIComponent(e).replace(M, P);
            },
            D = function (e, t) {
              if (t)
                for (var n, r, i = t.split("&"), o = 0; o < i.length; )
                  (n = i[o++]).length &&
                    ((r = n.split("=")),
                    e.push({ key: _(r.shift()), value: _(r.join("=")) }));
            },
            N = function (e) {
              (this.entries.length = 0), D(this.entries, e);
            },
            B = function (e, t) {
              if (e < t) throw TypeError("Not enough arguments");
            },
            q = l(
              function (e, t) {
                T(this, { type: F, iterator: b(C(e).entries), kind: t });
              },
              "Iterator",
              function () {
                var e = L(this),
                  t = e.kind,
                  n = e.iterator.next(),
                  r = n.value;
                return (
                  n.done ||
                    (n.value =
                      "keys" === t
                        ? r.key
                        : "values" === t
                        ? r.value
                        : [r.key, r.value]),
                  n
                );
              }
            ),
            W = function () {
              f(this, W, S);
              var e,
                t,
                n,
                r,
                i,
                o,
                a,
                u,
                s,
                l = arguments.length > 0 ? arguments[0] : void 0,
                c = this,
                h = [];
              if (
                (T(c, {
                  type: S,
                  entries: h,
                  updateURL: function () {},
                  updateSearchParams: N,
                }),
                void 0 !== l)
              )
                if (y(l))
                  if ("function" == typeof (e = x(l)))
                    for (n = (t = e.call(l)).next; !(r = n.call(t)).done; ) {
                      if (
                        (a = (o = (i = b(v(r.value))).next).call(i)).done ||
                        (u = o.call(i)).done ||
                        !o.call(i).done
                      )
                        throw TypeError("Expected sequence with length 2");
                      h.push({ key: a.value + "", value: u.value + "" });
                    }
                  else
                    for (s in l)
                      p(l, s) && h.push({ key: s, value: l[s] + "" });
                else
                  D(
                    h,
                    "string" == typeof l
                      ? "?" === l.charAt(0)
                        ? l.slice(1)
                        : l
                      : l + ""
                  );
            },
            H = W.prototype;
          u(
            H,
            {
              append: function (e, t) {
                B(arguments.length, 2);
                var n = C(this);
                n.entries.push({ key: e + "", value: t + "" }), n.updateURL();
              },
              delete: function (e) {
                B(arguments.length, 1);
                for (
                  var t = C(this), n = t.entries, r = e + "", i = 0;
                  i < n.length;

                )
                  n[i].key === r ? n.splice(i, 1) : i++;
                t.updateURL();
              },
              get: function (e) {
                B(arguments.length, 1);
                for (
                  var t = C(this).entries, n = e + "", r = 0;
                  r < t.length;
                  r++
                )
                  if (t[r].key === n) return t[r].value;
                return null;
              },
              getAll: function (e) {
                B(arguments.length, 1);
                for (
                  var t = C(this).entries, n = e + "", r = [], i = 0;
                  i < t.length;
                  i++
                )
                  t[i].key === n && r.push(t[i].value);
                return r;
              },
              has: function (e) {
                B(arguments.length, 1);
                for (var t = C(this).entries, n = e + "", r = 0; r < t.length; )
                  if (t[r++].key === n) return !0;
                return !1;
              },
              set: function (e, t) {
                B(arguments.length, 1);
                for (
                  var n,
                    r = C(this),
                    i = r.entries,
                    o = !1,
                    a = e + "",
                    u = t + "",
                    s = 0;
                  s < i.length;
                  s++
                )
                  (n = i[s]).key === a &&
                    (o ? i.splice(s--, 1) : ((o = !0), (n.value = u)));
                o || i.push({ key: a, value: u }), r.updateURL();
              },
              sort: function () {
                var e,
                  t,
                  n,
                  r = C(this),
                  i = r.entries,
                  o = i.slice();
                for (i.length = 0, n = 0; n < o.length; n++) {
                  for (e = o[n], t = 0; t < n; t++)
                    if (i[t].key > e.key) {
                      i.splice(t, 0, e);
                      break;
                    }
                  t === n && i.push(e);
                }
                r.updateURL();
              },
              forEach: function (e) {
                for (
                  var t,
                    n = C(this).entries,
                    r = h(e, arguments.length > 1 ? arguments[1] : void 0, 3),
                    i = 0;
                  i < n.length;

                )
                  r((t = n[i++]).value, t.key, this);
              },
              keys: function () {
                return new q(this, "keys");
              },
              values: function () {
                return new q(this, "values");
              },
              entries: function () {
                return new q(this, "entries");
              },
            },
            { enumerable: !0 }
          ),
            a(H, A, H.entries),
            a(
              H,
              "toString",
              function () {
                for (var e, t = C(this).entries, n = [], r = 0; r < t.length; )
                  (e = t[r++]), n.push(j(e.key) + "=" + j(e.value));
                return n.join("&");
              },
              { enumerable: !0 }
            ),
            s(W, S),
            r({ global: !0, forced: !o }, { URLSearchParams: W }),
            o ||
              "function" != typeof E ||
              "function" != typeof k ||
              r(
                { global: !0, enumerable: !0, forced: !0 },
                {
                  fetch: function (e) {
                    var t,
                      n,
                      r,
                      i = [e];
                    return (
                      arguments.length > 1 &&
                        (y((t = arguments[1])) &&
                          ((n = t.body),
                          d(n) === S &&
                            ((r = t.headers ? new k(t.headers) : new k()).has(
                              "content-type"
                            ) ||
                              r.set(
                                "content-type",
                                "application/x-www-form-urlencoded;charset=UTF-8"
                              ),
                            (t = g(t, {
                              body: m(0, String(n)),
                              headers: m(0, r),
                            })))),
                        i.push(t)),
                      E.apply(this, i)
                    );
                  },
                }
              ),
            (e.exports = { URLSearchParams: W, getState: C });
        },
        285: function (e, t, n) {
          "use strict";
          n(8783);
          var r,
            i = n(2109),
            o = n(9781),
            a = n(590),
            u = n(7854),
            s = n(6048),
            l = n(1320),
            c = n(5787),
            f = n(6656),
            p = n(1574),
            h = n(8457),
            d = n(8710).codeAt,
            v = n(3197),
            y = n(8003),
            g = n(1637),
            m = n(9909),
            b = u.URL,
            x = g.URLSearchParams,
            w = g.getState,
            E = m.set,
            k = m.getterFor("URL"),
            A = Math.floor,
            S = Math.pow,
            F = "Invalid scheme",
            T = "Invalid host",
            C = "Invalid port",
            L = /[A-Za-z]/,
            R = /[\d+-.A-Za-z]/,
            I = /\d/,
            U = /^(0x|0X)/,
            O = /^[0-7]+$/,
            _ = /^\d+$/,
            M = /^[\dA-Fa-f]+$/,
            z = /[\u0000\t\u000A\u000D #%/:?@[\\]]/,
            P = /[\u0000\t\u000A\u000D #/:?@[\\]]/,
            j = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,
            D = /[\t\u000A\u000D]/g,
            N = function (e, t) {
              var n, r, i;
              if ("[" == t.charAt(0)) {
                if ("]" != t.charAt(t.length - 1)) return T;
                if (!(n = q(t.slice(1, -1)))) return T;
                e.host = n;
              } else if (X(e)) {
                if (((t = v(t)), z.test(t))) return T;
                if (null === (n = B(t))) return T;
                e.host = n;
              } else {
                if (P.test(t)) return T;
                for (n = "", r = h(t), i = 0; i < r.length; i++)
                  n += $(r[i], H);
                e.host = n;
              }
            },
            B = function (e) {
              var t,
                n,
                r,
                i,
                o,
                a,
                u,
                s = e.split(".");
              if (
                (s.length && "" == s[s.length - 1] && s.pop(),
                (t = s.length) > 4)
              )
                return e;
              for (n = [], r = 0; r < t; r++) {
                if ("" == (i = s[r])) return e;
                if (
                  ((o = 10),
                  i.length > 1 &&
                    "0" == i.charAt(0) &&
                    ((o = U.test(i) ? 16 : 8), (i = i.slice(8 == o ? 1 : 2))),
                  "" === i)
                )
                  a = 0;
                else {
                  if (!(10 == o ? _ : 8 == o ? O : M).test(i)) return e;
                  a = parseInt(i, o);
                }
                n.push(a);
              }
              for (r = 0; r < t; r++)
                if (((a = n[r]), r == t - 1)) {
                  if (a >= S(256, 5 - t)) return null;
                } else if (a > 255) return null;
              for (u = n.pop(), r = 0; r < n.length; r++)
                u += n[r] * S(256, 3 - r);
              return u;
            },
            q = function (e) {
              var t,
                n,
                r,
                i,
                o,
                a,
                u,
                s = [0, 0, 0, 0, 0, 0, 0, 0],
                l = 0,
                c = null,
                f = 0,
                p = function () {
                  return e.charAt(f);
                };
              if (":" == p()) {
                if (":" != e.charAt(1)) return;
                (f += 2), (c = ++l);
              }
              for (; p(); ) {
                if (8 == l) return;
                if (":" != p()) {
                  for (t = n = 0; n < 4 && M.test(p()); )
                    (t = 16 * t + parseInt(p(), 16)), f++, n++;
                  if ("." == p()) {
                    if (0 == n) return;
                    if (((f -= n), l > 6)) return;
                    for (r = 0; p(); ) {
                      if (((i = null), r > 0)) {
                        if (!("." == p() && r < 4)) return;
                        f++;
                      }
                      if (!I.test(p())) return;
                      for (; I.test(p()); ) {
                        if (((o = parseInt(p(), 10)), null === i)) i = o;
                        else {
                          if (0 == i) return;
                          i = 10 * i + o;
                        }
                        if (i > 255) return;
                        f++;
                      }
                      (s[l] = 256 * s[l] + i), (2 != ++r && 4 != r) || l++;
                    }
                    if (4 != r) return;
                    break;
                  }
                  if (":" == p()) {
                    if ((f++, !p())) return;
                  } else if (p()) return;
                  s[l++] = t;
                } else {
                  if (null !== c) return;
                  f++, (c = ++l);
                }
              }
              if (null !== c)
                for (a = l - c, l = 7; 0 != l && a > 0; )
                  (u = s[l]), (s[l--] = s[c + a - 1]), (s[c + --a] = u);
              else if (8 != l) return;
              return s;
            },
            W = function (e) {
              var t, n, r, i;
              if ("number" == typeof e) {
                for (t = [], n = 0; n < 4; n++)
                  t.unshift(e % 256), (e = A(e / 256));
                return t.join(".");
              }
              if ("object" == typeof e) {
                for (
                  t = "",
                    r = (function (e) {
                      for (
                        var t = null, n = 1, r = null, i = 0, o = 0;
                        o < 8;
                        o++
                      )
                        0 !== e[o]
                          ? (i > n && ((t = r), (n = i)), (r = null), (i = 0))
                          : (null === r && (r = o), ++i);
                      return i > n && ((t = r), (n = i)), t;
                    })(e),
                    n = 0;
                  n < 8;
                  n++
                )
                  (i && 0 === e[n]) ||
                    (i && (i = !1),
                    r === n
                      ? ((t += n ? ":" : "::"), (i = !0))
                      : ((t += e[n].toString(16)), n < 7 && (t += ":")));
                return "[" + t + "]";
              }
              return e;
            },
            H = {},
            Y = p({}, H, { " ": 1, '"': 1, "<": 1, ">": 1, "`": 1 }),
            G = p({}, Y, { "#": 1, "?": 1, "{": 1, "}": 1 }),
            Q = p({}, G, {
              "/": 1,
              ":": 1,
              ";": 1,
              "=": 1,
              "@": 1,
              "[": 1,
              "\\": 1,
              "]": 1,
              "^": 1,
              "|": 1,
            }),
            $ = function (e, t) {
              var n = d(e, 0);
              return n > 32 && n < 127 && !f(t, e) ? e : encodeURIComponent(e);
            },
            V = { ftp: 21, file: null, http: 80, https: 443, ws: 80, wss: 443 },
            X = function (e) {
              return f(V, e.scheme);
            },
            K = function (e) {
              return "" != e.username || "" != e.password;
            },
            Z = function (e) {
              return !e.host || e.cannotBeABaseURL || "file" == e.scheme;
            },
            J = function (e, t) {
              var n;
              return (
                2 == e.length &&
                L.test(e.charAt(0)) &&
                (":" == (n = e.charAt(1)) || (!t && "|" == n))
              );
            },
            ee = function (e) {
              var t;
              return (
                e.length > 1 &&
                J(e.slice(0, 2)) &&
                (2 == e.length ||
                  "/" === (t = e.charAt(2)) ||
                  "\\" === t ||
                  "?" === t ||
                  "#" === t)
              );
            },
            te = function (e) {
              var t = e.path,
                n = t.length;
              !n || ("file" == e.scheme && 1 == n && J(t[0], !0)) || t.pop();
            },
            ne = function (e) {
              return "." === e || "%2e" === e.toLowerCase();
            },
            re = {},
            ie = {},
            oe = {},
            ae = {},
            ue = {},
            se = {},
            le = {},
            ce = {},
            fe = {},
            pe = {},
            he = {},
            de = {},
            ve = {},
            ye = {},
            ge = {},
            me = {},
            be = {},
            xe = {},
            we = {},
            Ee = {},
            ke = {},
            Ae = function (e, t, n, i) {
              var o,
                a,
                u,
                s,
                l,
                c = n || re,
                p = 0,
                d = "",
                v = !1,
                y = !1,
                g = !1;
              for (
                n ||
                  ((e.scheme = ""),
                  (e.username = ""),
                  (e.password = ""),
                  (e.host = null),
                  (e.port = null),
                  (e.path = []),
                  (e.query = null),
                  (e.fragment = null),
                  (e.cannotBeABaseURL = !1),
                  (t = t.replace(j, ""))),
                  t = t.replace(D, ""),
                  o = h(t);
                p <= o.length;

              ) {
                switch (((a = o[p]), c)) {
                  case re:
                    if (!a || !L.test(a)) {
                      if (n) return F;
                      c = oe;
                      continue;
                    }
                    (d += a.toLowerCase()), (c = ie);
                    break;
                  case ie:
                    if (a && (R.test(a) || "+" == a || "-" == a || "." == a))
                      d += a.toLowerCase();
                    else {
                      if (":" != a) {
                        if (n) return F;
                        (d = ""), (c = oe), (p = 0);
                        continue;
                      }
                      if (
                        n &&
                        (X(e) != f(V, d) ||
                          ("file" == d && (K(e) || null !== e.port)) ||
                          ("file" == e.scheme && !e.host))
                      )
                        return;
                      if (((e.scheme = d), n))
                        return void (
                          X(e) &&
                          V[e.scheme] == e.port &&
                          (e.port = null)
                        );
                      (d = ""),
                        "file" == e.scheme
                          ? (c = ye)
                          : X(e) && i && i.scheme == e.scheme
                          ? (c = ae)
                          : X(e)
                          ? (c = ce)
                          : "/" == o[p + 1]
                          ? ((c = ue), p++)
                          : ((e.cannotBeABaseURL = !0),
                            e.path.push(""),
                            (c = we));
                    }
                    break;
                  case oe:
                    if (!i || (i.cannotBeABaseURL && "#" != a)) return F;
                    if (i.cannotBeABaseURL && "#" == a) {
                      (e.scheme = i.scheme),
                        (e.path = i.path.slice()),
                        (e.query = i.query),
                        (e.fragment = ""),
                        (e.cannotBeABaseURL = !0),
                        (c = ke);
                      break;
                    }
                    c = "file" == i.scheme ? ye : se;
                    continue;
                  case ae:
                    if ("/" != a || "/" != o[p + 1]) {
                      c = se;
                      continue;
                    }
                    (c = fe), p++;
                    break;
                  case ue:
                    if ("/" == a) {
                      c = pe;
                      break;
                    }
                    c = xe;
                    continue;
                  case se:
                    if (((e.scheme = i.scheme), a == r))
                      (e.username = i.username),
                        (e.password = i.password),
                        (e.host = i.host),
                        (e.port = i.port),
                        (e.path = i.path.slice()),
                        (e.query = i.query);
                    else if ("/" == a || ("\\" == a && X(e))) c = le;
                    else if ("?" == a)
                      (e.username = i.username),
                        (e.password = i.password),
                        (e.host = i.host),
                        (e.port = i.port),
                        (e.path = i.path.slice()),
                        (e.query = ""),
                        (c = Ee);
                    else {
                      if ("#" != a) {
                        (e.username = i.username),
                          (e.password = i.password),
                          (e.host = i.host),
                          (e.port = i.port),
                          (e.path = i.path.slice()),
                          e.path.pop(),
                          (c = xe);
                        continue;
                      }
                      (e.username = i.username),
                        (e.password = i.password),
                        (e.host = i.host),
                        (e.port = i.port),
                        (e.path = i.path.slice()),
                        (e.query = i.query),
                        (e.fragment = ""),
                        (c = ke);
                    }
                    break;
                  case le:
                    if (!X(e) || ("/" != a && "\\" != a)) {
                      if ("/" != a) {
                        (e.username = i.username),
                          (e.password = i.password),
                          (e.host = i.host),
                          (e.port = i.port),
                          (c = xe);
                        continue;
                      }
                      c = pe;
                    } else c = fe;
                    break;
                  case ce:
                    if (((c = fe), "/" != a || "/" != d.charAt(p + 1)))
                      continue;
                    p++;
                    break;
                  case fe:
                    if ("/" != a && "\\" != a) {
                      c = pe;
                      continue;
                    }
                    break;
                  case pe:
                    if ("@" == a) {
                      v && (d = "%40" + d), (v = !0), (u = h(d));
                      for (var m = 0; m < u.length; m++) {
                        var b = u[m];
                        if (":" != b || g) {
                          var x = $(b, Q);
                          g ? (e.password += x) : (e.username += x);
                        } else g = !0;
                      }
                      d = "";
                    } else if (
                      a == r ||
                      "/" == a ||
                      "?" == a ||
                      "#" == a ||
                      ("\\" == a && X(e))
                    ) {
                      if (v && "" == d) return "Invalid authority";
                      (p -= h(d).length + 1), (d = ""), (c = he);
                    } else d += a;
                    break;
                  case he:
                  case de:
                    if (n && "file" == e.scheme) {
                      c = me;
                      continue;
                    }
                    if (":" != a || y) {
                      if (
                        a == r ||
                        "/" == a ||
                        "?" == a ||
                        "#" == a ||
                        ("\\" == a && X(e))
                      ) {
                        if (X(e) && "" == d) return T;
                        if (n && "" == d && (K(e) || null !== e.port)) return;
                        if ((s = N(e, d))) return s;
                        if (((d = ""), (c = be), n)) return;
                        continue;
                      }
                      "[" == a ? (y = !0) : "]" == a && (y = !1), (d += a);
                    } else {
                      if ("" == d) return T;
                      if ((s = N(e, d))) return s;
                      if (((d = ""), (c = ve), n == de)) return;
                    }
                    break;
                  case ve:
                    if (!I.test(a)) {
                      if (
                        a == r ||
                        "/" == a ||
                        "?" == a ||
                        "#" == a ||
                        ("\\" == a && X(e)) ||
                        n
                      ) {
                        if ("" != d) {
                          var w = parseInt(d, 10);
                          if (w > 65535) return C;
                          (e.port = X(e) && w === V[e.scheme] ? null : w),
                            (d = "");
                        }
                        if (n) return;
                        c = be;
                        continue;
                      }
                      return C;
                    }
                    d += a;
                    break;
                  case ye:
                    if (((e.scheme = "file"), "/" == a || "\\" == a)) c = ge;
                    else {
                      if (!i || "file" != i.scheme) {
                        c = xe;
                        continue;
                      }
                      if (a == r)
                        (e.host = i.host),
                          (e.path = i.path.slice()),
                          (e.query = i.query);
                      else if ("?" == a)
                        (e.host = i.host),
                          (e.path = i.path.slice()),
                          (e.query = ""),
                          (c = Ee);
                      else {
                        if ("#" != a) {
                          ee(o.slice(p).join("")) ||
                            ((e.host = i.host),
                            (e.path = i.path.slice()),
                            te(e)),
                            (c = xe);
                          continue;
                        }
                        (e.host = i.host),
                          (e.path = i.path.slice()),
                          (e.query = i.query),
                          (e.fragment = ""),
                          (c = ke);
                      }
                    }
                    break;
                  case ge:
                    if ("/" == a || "\\" == a) {
                      c = me;
                      break;
                    }
                    i &&
                      "file" == i.scheme &&
                      !ee(o.slice(p).join("")) &&
                      (J(i.path[0], !0)
                        ? e.path.push(i.path[0])
                        : (e.host = i.host)),
                      (c = xe);
                    continue;
                  case me:
                    if (
                      a == r ||
                      "/" == a ||
                      "\\" == a ||
                      "?" == a ||
                      "#" == a
                    ) {
                      if (!n && J(d)) c = xe;
                      else if ("" == d) {
                        if (((e.host = ""), n)) return;
                        c = be;
                      } else {
                        if ((s = N(e, d))) return s;
                        if (("localhost" == e.host && (e.host = ""), n)) return;
                        (d = ""), (c = be);
                      }
                      continue;
                    }
                    d += a;
                    break;
                  case be:
                    if (X(e)) {
                      if (((c = xe), "/" != a && "\\" != a)) continue;
                    } else if (n || "?" != a)
                      if (n || "#" != a) {
                        if (a != r && ((c = xe), "/" != a)) continue;
                      } else (e.fragment = ""), (c = ke);
                    else (e.query = ""), (c = Ee);
                    break;
                  case xe:
                    if (
                      a == r ||
                      "/" == a ||
                      ("\\" == a && X(e)) ||
                      (!n && ("?" == a || "#" == a))
                    ) {
                      if (
                        (".." === (l = (l = d).toLowerCase()) ||
                        "%2e." === l ||
                        ".%2e" === l ||
                        "%2e%2e" === l
                          ? (te(e),
                            "/" == a || ("\\" == a && X(e)) || e.path.push(""))
                          : ne(d)
                          ? "/" == a || ("\\" == a && X(e)) || e.path.push("")
                          : ("file" == e.scheme &&
                              !e.path.length &&
                              J(d) &&
                              (e.host && (e.host = ""),
                              (d = d.charAt(0) + ":")),
                            e.path.push(d)),
                        (d = ""),
                        "file" == e.scheme && (a == r || "?" == a || "#" == a))
                      )
                        for (; e.path.length > 1 && "" === e.path[0]; )
                          e.path.shift();
                      "?" == a
                        ? ((e.query = ""), (c = Ee))
                        : "#" == a && ((e.fragment = ""), (c = ke));
                    } else d += $(a, G);
                    break;
                  case we:
                    "?" == a
                      ? ((e.query = ""), (c = Ee))
                      : "#" == a
                      ? ((e.fragment = ""), (c = ke))
                      : a != r && (e.path[0] += $(a, H));
                    break;
                  case Ee:
                    n || "#" != a
                      ? a != r &&
                        ("'" == a && X(e)
                          ? (e.query += "%27")
                          : (e.query += "#" == a ? "%23" : $(a, H)))
                      : ((e.fragment = ""), (c = ke));
                    break;
                  case ke:
                    a != r && (e.fragment += $(a, Y));
                }
                p++;
              }
            },
            Se = function (e) {
              var t,
                n,
                r = c(this, Se, "URL"),
                i = arguments.length > 1 ? arguments[1] : void 0,
                a = String(e),
                u = E(r, { type: "URL" });
              if (void 0 !== i)
                if (i instanceof Se) t = k(i);
                else if ((n = Ae((t = {}), String(i)))) throw TypeError(n);
              if ((n = Ae(u, a, null, t))) throw TypeError(n);
              var s = (u.searchParams = new x()),
                l = w(s);
              l.updateSearchParams(u.query),
                (l.updateURL = function () {
                  u.query = String(s) || null;
                }),
                o ||
                  ((r.href = Te.call(r)),
                  (r.origin = Ce.call(r)),
                  (r.protocol = Le.call(r)),
                  (r.username = Re.call(r)),
                  (r.password = Ie.call(r)),
                  (r.host = Ue.call(r)),
                  (r.hostname = Oe.call(r)),
                  (r.port = _e.call(r)),
                  (r.pathname = Me.call(r)),
                  (r.search = ze.call(r)),
                  (r.searchParams = Pe.call(r)),
                  (r.hash = je.call(r)));
            },
            Fe = Se.prototype,
            Te = function () {
              var e = k(this),
                t = e.scheme,
                n = e.username,
                r = e.password,
                i = e.host,
                o = e.port,
                a = e.path,
                u = e.query,
                s = e.fragment,
                l = t + ":";
              return (
                null !== i
                  ? ((l += "//"),
                    K(e) && (l += n + (r ? ":" + r : "") + "@"),
                    (l += W(i)),
                    null !== o && (l += ":" + o))
                  : "file" == t && (l += "//"),
                (l += e.cannotBeABaseURL
                  ? a[0]
                  : a.length
                  ? "/" + a.join("/")
                  : ""),
                null !== u && (l += "?" + u),
                null !== s && (l += "#" + s),
                l
              );
            },
            Ce = function () {
              var e = k(this),
                t = e.scheme,
                n = e.port;
              if ("blob" == t)
                try {
                  return new URL(t.path[0]).origin;
                } catch (e) {
                  return "null";
                }
              return "file" != t && X(e)
                ? t + "://" + W(e.host) + (null !== n ? ":" + n : "")
                : "null";
            },
            Le = function () {
              return k(this).scheme + ":";
            },
            Re = function () {
              return k(this).username;
            },
            Ie = function () {
              return k(this).password;
            },
            Ue = function () {
              var e = k(this),
                t = e.host,
                n = e.port;
              return null === t ? "" : null === n ? W(t) : W(t) + ":" + n;
            },
            Oe = function () {
              var e = k(this).host;
              return null === e ? "" : W(e);
            },
            _e = function () {
              var e = k(this).port;
              return null === e ? "" : String(e);
            },
            Me = function () {
              var e = k(this),
                t = e.path;
              return e.cannotBeABaseURL
                ? t[0]
                : t.length
                ? "/" + t.join("/")
                : "";
            },
            ze = function () {
              var e = k(this).query;
              return e ? "?" + e : "";
            },
            Pe = function () {
              return k(this).searchParams;
            },
            je = function () {
              var e = k(this).fragment;
              return e ? "#" + e : "";
            },
            De = function (e, t) {
              return { get: e, set: t, configurable: !0, enumerable: !0 };
            };
          if (
            (o &&
              s(Fe, {
                href: De(Te, function (e) {
                  var t = k(this),
                    n = String(e),
                    r = Ae(t, n);
                  if (r) throw TypeError(r);
                  w(t.searchParams).updateSearchParams(t.query);
                }),
                origin: De(Ce),
                protocol: De(Le, function (e) {
                  var t = k(this);
                  Ae(t, String(e) + ":", re);
                }),
                username: De(Re, function (e) {
                  var t = k(this),
                    n = h(String(e));
                  if (!Z(t)) {
                    t.username = "";
                    for (var r = 0; r < n.length; r++) t.username += $(n[r], Q);
                  }
                }),
                password: De(Ie, function (e) {
                  var t = k(this),
                    n = h(String(e));
                  if (!Z(t)) {
                    t.password = "";
                    for (var r = 0; r < n.length; r++) t.password += $(n[r], Q);
                  }
                }),
                host: De(Ue, function (e) {
                  var t = k(this);
                  t.cannotBeABaseURL || Ae(t, String(e), he);
                }),
                hostname: De(Oe, function (e) {
                  var t = k(this);
                  t.cannotBeABaseURL || Ae(t, String(e), de);
                }),
                port: De(_e, function (e) {
                  var t = k(this);
                  Z(t) ||
                    ("" == (e = String(e)) ? (t.port = null) : Ae(t, e, ve));
                }),
                pathname: De(Me, function (e) {
                  var t = k(this);
                  t.cannotBeABaseURL || ((t.path = []), Ae(t, e + "", be));
                }),
                search: De(ze, function (e) {
                  var t = k(this);
                  "" == (e = String(e))
                    ? (t.query = null)
                    : ("?" == e.charAt(0) && (e = e.slice(1)),
                      (t.query = ""),
                      Ae(t, e, Ee)),
                    w(t.searchParams).updateSearchParams(t.query);
                }),
                searchParams: De(Pe),
                hash: De(je, function (e) {
                  var t = k(this);
                  "" != (e = String(e))
                    ? ("#" == e.charAt(0) && (e = e.slice(1)),
                      (t.fragment = ""),
                      Ae(t, e, ke))
                    : (t.fragment = null);
                }),
              }),
            l(
              Fe,
              "toJSON",
              function () {
                return Te.call(this);
              },
              { enumerable: !0 }
            ),
            l(
              Fe,
              "toString",
              function () {
                return Te.call(this);
              },
              { enumerable: !0 }
            ),
            b)
          ) {
            var Ne = b.createObjectURL,
              Be = b.revokeObjectURL;
            Ne &&
              l(Se, "createObjectURL", function (e) {
                return Ne.apply(b, arguments);
              }),
              Be &&
                l(Se, "revokeObjectURL", function (e) {
                  return Be.apply(b, arguments);
                });
          }
          y(Se, "URL"), i({ global: !0, forced: !a, sham: !o }, { URL: Se });
        },
      },
      t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var i = (t[r] = { exports: {} });
      return e[r](i, i.exports, n), i.exports;
    }
    (n.d = function (e, t) {
      for (var r in t)
        n.o(t, r) &&
          !n.o(e, r) &&
          Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
      (n.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e) {
          if ("object" == typeof window) return window;
        }
      })()),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      });
    var r = {};
    return (
      (function () {
        "use strict";
        function e(e, n) {
          var r;
          if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
            if (
              Array.isArray(e) ||
              (r = (function (e, n) {
                if (e) {
                  if ("string" == typeof e) return t(e, n);
                  var r = Object.prototype.toString.call(e).slice(8, -1);
                  return (
                    "Object" === r && e.constructor && (r = e.constructor.name),
                    "Map" === r || "Set" === r
                      ? Array.from(e)
                      : "Arguments" === r ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                      ? t(e, n)
                      : void 0
                  );
                }
              })(e)) ||
              (n && e && "number" == typeof e.length)
            ) {
              r && (e = r);
              var i = 0,
                o = function () {};
              return {
                s: o,
                n: function () {
                  return i >= e.length
                    ? { done: !0 }
                    : { done: !1, value: e[i++] };
                },
                e: function (e) {
                  throw e;
                },
                f: o,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var a,
            u = !0,
            s = !1;
          return {
            s: function () {
              r = e[Symbol.iterator]();
            },
            n: function () {
              var e = r.next();
              return (u = e.done), e;
            },
            e: function (e) {
              (s = !0), (a = e);
            },
            f: function () {
              try {
                u || null == r.return || r.return();
              } finally {
                if (s) throw a;
              }
            },
          };
        }
        function t(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
          return r;
        }
        function i(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        n.r(r),
          n.d(r, {
            Dropzone: function () {
              return b;
            },
            default: function () {
              return A;
            },
          }),
          n(2222),
          n(7327),
          n(2772),
          n(6992),
          n(1249),
          n(7042),
          n(561),
          n(8264),
          n(8309),
          n(489),
          n(1539),
          n(4916),
          n(9714),
          n(8783),
          n(4723),
          n(5306),
          n(3123),
          n(3210),
          n(2472),
          n(2990),
          n(8927),
          n(3105),
          n(5035),
          n(4345),
          n(7174),
          n(2846),
          n(4731),
          n(7209),
          n(6319),
          n(8867),
          n(7789),
          n(3739),
          n(9368),
          n(4483),
          n(2056),
          n(3462),
          n(678),
          n(7462),
          n(3824),
          n(5021),
          n(2974),
          n(5016),
          n(4747),
          n(3948),
          n(285);
        var o = (function () {
          function t() {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, t);
          }
          var n, r;
          return (
            (n = t),
            (r = [
              {
                key: "on",
                value: function (e, t) {
                  return (
                    (this._callbacks = this._callbacks || {}),
                    this._callbacks[e] || (this._callbacks[e] = []),
                    this._callbacks[e].push(t),
                    this
                  );
                },
              },
              {
                key: "emit",
                value: function (t) {
                  this._callbacks = this._callbacks || {};
                  for (
                    var n = this._callbacks[t],
                      r = arguments.length,
                      i = new Array(r > 1 ? r - 1 : 0),
                      o = 1;
                    o < r;
                    o++
                  )
                    i[o - 1] = arguments[o];
                  if (n) {
                    var a,
                      u = e(n, !0);
                    try {
                      for (u.s(); !(a = u.n()).done; ) {
                        var s = a.value;
                        s.apply(this, i);
                      }
                    } catch (e) {
                      u.e(e);
                    } finally {
                      u.f();
                    }
                  }
                  return (
                    this.element &&
                      this.element.dispatchEvent(
                        this.makeEvent("dropzone:" + t, { args: i })
                      ),
                    this
                  );
                },
              },
              {
                key: "makeEvent",
                value: function (e, t) {
                  var n = { bubbles: !0, cancelable: !0, detail: t };
                  if ("function" == typeof window.CustomEvent)
                    return new CustomEvent(e, n);
                  var r = document.createEvent("CustomEvent");
                  return (
                    r.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), r
                  );
                },
              },
              {
                key: "off",
                value: function (e, t) {
                  if (!this._callbacks || 0 === arguments.length)
                    return (this._callbacks = {}), this;
                  var n = this._callbacks[e];
                  if (!n) return this;
                  if (1 === arguments.length)
                    return delete this._callbacks[e], this;
                  for (var r = 0; r < n.length; r++) {
                    var i = n[r];
                    if (i === t) {
                      n.splice(r, 1);
                      break;
                    }
                  }
                  return this;
                },
              },
            ]) && i(n.prototype, r),
            t
          );
        })();
        function a(e, t) {
          var n;
          if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
            if (
              Array.isArray(e) ||
              (n = (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return u(e, t);
                  var n = Object.prototype.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                      ? u(e, t)
                      : void 0
                  );
                }
              })(e)) ||
              (t && e && "number" == typeof e.length)
            ) {
              n && (e = n);
              var r = 0,
                i = function () {};
              return {
                s: i,
                n: function () {
                  return r >= e.length
                    ? { done: !0 }
                    : { done: !1, value: e[r++] };
                },
                e: function (e) {
                  throw e;
                },
                f: i,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var o,
            a = !0,
            s = !1;
          return {
            s: function () {
              n = e[Symbol.iterator]();
            },
            n: function () {
              var e = n.next();
              return (a = e.done), e;
            },
            e: function (e) {
              (s = !0), (o = e);
            },
            f: function () {
              try {
                a || null == n.return || n.return();
              } finally {
                if (s) throw o;
              }
            },
          };
        }
        function u(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
          return r;
        }
        var s = {
          url: null,
          method: "post",
          withCredentials: !1,
          timeout: null,
          parallelUploads: 2,
          uploadMultiple: !1,
          chunking: !1,
          forceChunking: !1,
          chunkSize: 2e6,
          parallelChunkUploads: !1,
          retryChunks: !1,
          retryChunksLimit: 3,
          maxFilesize: 256,
          paramName: "file",
          createImageThumbnails: !0,
          maxThumbnailFilesize: 10,
          thumbnailWidth: 120,
          thumbnailHeight: 120,
          thumbnailMethod: "crop",
          resizeWidth: null,
          resizeHeight: null,
          resizeMimeType: null,
          resizeQuality: 0.8,
          resizeMethod: "contain",
          filesizeBase: 1e3,
          maxFiles: null,
          headers: null,
          clickable: !0,
          ignoreHiddenFiles: !0,
          acceptedFiles: null,
          acceptedMimeTypes: null,
          autoProcessQueue: !0,
          autoQueue: !0,
          addRemoveLinks: !1,
          previewsContainer: null,
          disablePreviews: !1,
          hiddenInputContainer: "body",
          capture: null,
          renameFilename: null,
          renameFile: null,
          forceFallback: !1,
          dictDefaultMessage: "Drop files here to upload",
          dictFallbackMessage:
            "Your browser does not support drag'n'drop file uploads.",
          dictFallbackText:
            "Please use the fallback form below to upload your files like in the olden days.",
          dictFileTooBig:
            "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
          dictInvalidFileType: "You can't upload files of this type.",
          dictResponseError: "Server responded with {{statusCode}} code.",
          dictCancelUpload: "Cancel upload",
          dictUploadCanceled: "Upload canceled.",
          dictCancelUploadConfirmation:
            "Are you sure you want to cancel this upload?",
          dictRemoveFile: "Remove file",
          dictRemoveFileConfirmation: null,
          dictMaxFilesExceeded: "You can not upload any more files.",
          dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
          init: function () {},
          params: function (e, t, n) {
            if (n)
              return {
                dzuuid: n.file.upload.uuid,
                dzchunkindex: n.index,
                dztotalfilesize: n.file.size,
                dzchunksize: this.options.chunkSize,
                dztotalchunkcount: n.file.upload.totalChunkCount,
                dzchunkbyteoffset: n.index * this.options.chunkSize,
              };
          },
          accept: function (e, t) {
            return t();
          },
          chunksUploaded: function (e, t) {
            t();
          },
          fallback: function () {
            var e;
            this.element.className = "".concat(
              this.element.className,
              " dz-browser-not-supported"
            );
            var t,
              n = a(this.element.getElementsByTagName("div"), !0);
            try {
              for (n.s(); !(t = n.n()).done; ) {
                var r = t.value;
                if (/(^| )dz-message($| )/.test(r.className)) {
                  (e = r), (r.className = "dz-message");
                  break;
                }
              }
            } catch (e) {
              n.e(e);
            } finally {
              n.f();
            }
            e ||
              ((e = b.createElement(
                '<div class="dz-message"><span></span></div>'
              )),
              this.element.appendChild(e));
            var i = e.getElementsByTagName("span")[0];
            return (
              i &&
                (null != i.textContent
                  ? (i.textContent = this.options.dictFallbackMessage)
                  : null != i.innerText &&
                    (i.innerText = this.options.dictFallbackMessage)),
              this.element.appendChild(this.getFallbackForm())
            );
          },
          resize: function (e, t, n, r) {
            var i = {
                srcX: 0,
                srcY: 0,
                srcWidth: e.width,
                srcHeight: e.height,
              },
              o = e.width / e.height;
            null == t && null == n
              ? ((t = i.srcWidth), (n = i.srcHeight))
              : null == t
              ? (t = n * o)
              : null == n && (n = t / o);
            var a =
              (t = Math.min(t, i.srcWidth)) / (n = Math.min(n, i.srcHeight));
            if (i.srcWidth > t || i.srcHeight > n)
              if ("crop" === r)
                o > a
                  ? ((i.srcHeight = e.height), (i.srcWidth = i.srcHeight * a))
                  : ((i.srcWidth = e.width), (i.srcHeight = i.srcWidth / a));
              else {
                if ("contain" !== r)
                  throw new Error("Unknown resizeMethod '".concat(r, "'"));
                o > a ? (n = t / o) : (t = n * o);
              }
            return (
              (i.srcX = (e.width - i.srcWidth) / 2),
              (i.srcY = (e.height - i.srcHeight) / 2),
              (i.trgWidth = t),
              (i.trgHeight = n),
              i
            );
          },
          transformFile: function (e, t) {
            return (this.options.resizeWidth || this.options.resizeHeight) &&
              e.type.match(/image.*/)
              ? this.resizeImage(
                  e,
                  this.options.resizeWidth,
                  this.options.resizeHeight,
                  this.options.resizeMethod,
                  t
                )
              : t(e);
          },
          previewTemplate:
            '<div class="dz-preview dz-file-preview"> <div class="dz-image"><img data-dz-thumbnail/></div> <div class="dz-details"> <div class="dz-size"><span data-dz-size></span></div> <div class="dz-filename"><span data-dz-name></span></div> </div> <div class="dz-progress"> <span class="dz-upload" data-dz-uploadprogress></span> </div> <div class="dz-error-message"><span data-dz-errormessage></span></div> <div class="dz-success-mark"> <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Check</title> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path> </g> </svg> </div> <div class="dz-error-mark"> <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Error</title> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475"> <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path> </g> </g> </svg> </div> </div> ',
          drop: function (e) {
            return this.element.classList.remove("dz-drag-hover");
          },
          dragstart: function (e) {},
          dragend: function (e) {
            return this.element.classList.remove("dz-drag-hover");
          },
          dragenter: function (e) {
            return this.element.classList.add("dz-drag-hover");
          },
          dragover: function (e) {
            return this.element.classList.add("dz-drag-hover");
          },
          dragleave: function (e) {
            return this.element.classList.remove("dz-drag-hover");
          },
          paste: function (e) {},
          reset: function () {
            return this.element.classList.remove("dz-started");
          },
          addedfile: function (e) {
            var t = this;
            if (
              (this.element === this.previewsContainer &&
                this.element.classList.add("dz-started"),
              this.previewsContainer && !this.options.disablePreviews)
            ) {
              (e.previewElement = b.createElement(
                this.options.previewTemplate.trim()
              )),
                (e.previewTemplate = e.previewElement),
                this.previewsContainer.appendChild(e.previewElement);
              var n,
                r = a(e.previewElement.querySelectorAll("[data-dz-name]"), !0);
              try {
                for (r.s(); !(n = r.n()).done; ) {
                  var i = n.value;
                  i.textContent = e.name;
                }
              } catch (e) {
                r.e(e);
              } finally {
                r.f();
              }
              var o,
                u = a(e.previewElement.querySelectorAll("[data-dz-size]"), !0);
              try {
                for (u.s(); !(o = u.n()).done; )
                  (i = o.value).innerHTML = this.filesize(e.size);
              } catch (e) {
                u.e(e);
              } finally {
                u.f();
              }
              this.options.addRemoveLinks &&
                ((e._removeLink = b.createElement(
                  '<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'.concat(
                    this.options.dictRemoveFile,
                    "</a>"
                  )
                )),
                e.previewElement.appendChild(e._removeLink));
              var s,
                l = function (n) {
                  return (
                    n.preventDefault(),
                    n.stopPropagation(),
                    e.status === b.UPLOADING
                      ? b.confirm(
                          t.options.dictCancelUploadConfirmation,
                          function () {
                            return t.removeFile(e);
                          }
                        )
                      : t.options.dictRemoveFileConfirmation
                      ? b.confirm(
                          t.options.dictRemoveFileConfirmation,
                          function () {
                            return t.removeFile(e);
                          }
                        )
                      : t.removeFile(e)
                  );
                },
                c = a(
                  e.previewElement.querySelectorAll("[data-dz-remove]"),
                  !0
                );
              try {
                for (c.s(); !(s = c.n()).done; )
                  s.value.addEventListener("click", l);
              } catch (e) {
                c.e(e);
              } finally {
                c.f();
              }
            }
          },
          removedfile: function (e) {
            return (
              null != e.previewElement &&
                null != e.previewElement.parentNode &&
                e.previewElement.parentNode.removeChild(e.previewElement),
              this._updateMaxFilesReachedClass()
            );
          },
          thumbnail: function (e, t) {
            if (e.previewElement) {
              e.previewElement.classList.remove("dz-file-preview");
              var n,
                r = a(
                  e.previewElement.querySelectorAll("[data-dz-thumbnail]"),
                  !0
                );
              try {
                for (r.s(); !(n = r.n()).done; ) {
                  var i = n.value;
                  (i.alt = e.name), (i.src = t);
                }
              } catch (e) {
                r.e(e);
              } finally {
                r.f();
              }
              return setTimeout(function () {
                return e.previewElement.classList.add("dz-image-preview");
              }, 1);
            }
          },
          error: function (e, t) {
            if (e.previewElement) {
              e.previewElement.classList.add("dz-error"),
                "string" != typeof t && t.error && (t = t.error);
              var n,
                r = a(
                  e.previewElement.querySelectorAll("[data-dz-errormessage]"),
                  !0
                );
              try {
                for (r.s(); !(n = r.n()).done; ) n.value.textContent = t;
              } catch (e) {
                r.e(e);
              } finally {
                r.f();
              }
            }
          },
          errormultiple: function () {},
          processing: function (e) {
            if (
              e.previewElement &&
              (e.previewElement.classList.add("dz-processing"), e._removeLink)
            )
              return (e._removeLink.innerHTML = this.options.dictCancelUpload);
          },
          processingmultiple: function () {},
          uploadprogress: function (e, t, n) {
            if (e.previewElement) {
              var r,
                i = a(
                  e.previewElement.querySelectorAll("[data-dz-uploadprogress]"),
                  !0
                );
              try {
                for (i.s(); !(r = i.n()).done; ) {
                  var o = r.value;
                  "PROGRESS" === o.nodeName
                    ? (o.value = t)
                    : (o.style.width = "".concat(t, "%"));
                }
              } catch (e) {
                i.e(e);
              } finally {
                i.f();
              }
            }
          },
          totaluploadprogress: function () {},
          sending: function () {},
          sendingmultiple: function () {},
          success: function (e) {
            if (e.previewElement)
              return e.previewElement.classList.add("dz-success");
          },
          successmultiple: function () {},
          canceled: function (e) {
            return this.emit("error", e, this.options.dictUploadCanceled);
          },
          canceledmultiple: function () {},
          complete: function (e) {
            if (
              (e._removeLink &&
                (e._removeLink.innerHTML = this.options.dictRemoveFile),
              e.previewElement)
            )
              return e.previewElement.classList.add("dz-complete");
          },
          completemultiple: function () {},
          maxfilesexceeded: function () {},
          maxfilesreached: function () {},
          queuecomplete: function () {},
          addedfiles: function () {},
        };
        function l(e) {
          return (l =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                })(e);
        }
        function c(e, t) {
          var n;
          if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
            if (
              Array.isArray(e) ||
              (n = (function (e, t) {
                if (e) {
                  if ("string" == typeof e) return f(e, t);
                  var n = Object.prototype.toString.call(e).slice(8, -1);
                  return (
                    "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n
                      ? Array.from(e)
                      : "Arguments" === n ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                      ? f(e, t)
                      : void 0
                  );
                }
              })(e)) ||
              (t && e && "number" == typeof e.length)
            ) {
              n && (e = n);
              var r = 0,
                i = function () {};
              return {
                s: i,
                n: function () {
                  return r >= e.length
                    ? { done: !0 }
                    : { done: !1, value: e[r++] };
                },
                e: function (e) {
                  throw e;
                },
                f: i,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var o,
            a = !0,
            u = !1;
          return {
            s: function () {
              n = e[Symbol.iterator]();
            },
            n: function () {
              var e = n.next();
              return (a = e.done), e;
            },
            e: function (e) {
              (u = !0), (o = e);
            },
            f: function () {
              try {
                a || null == n.return || n.return();
              } finally {
                if (u) throw o;
              }
            },
          };
        }
        function f(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
          return r;
        }
        function p(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        }
        function h(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        function d(e, t, n) {
          return t && h(e.prototype, t), n && h(e, n), e;
        }
        function v(e, t) {
          return (v =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            })(e, t);
        }
        function y(e, t) {
          return !t || ("object" !== l(t) && "function" != typeof t) ? g(e) : t;
        }
        function g(e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        }
        function m(e) {
          return (m = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              })(e);
        }
        var b = (function (e) {
          !(function (e, t) {
            if ("function" != typeof t && null !== t)
              throw new TypeError(
                "Super expression must either be null or a function"
              );
            (e.prototype = Object.create(t && t.prototype, {
              constructor: { value: e, writable: !0, configurable: !0 },
            })),
              t && v(e, t);
          })(i, e);
          var t,
            n,
            r =
              ((t = i),
              (n = (function () {
                if ("undefined" == typeof Reflect || !Reflect.construct)
                  return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                  return (
                    Date.prototype.toString.call(
                      Reflect.construct(Date, [], function () {})
                    ),
                    !0
                  );
                } catch (e) {
                  return !1;
                }
              })()),
              function () {
                var e,
                  r = m(t);
                if (n) {
                  var i = m(this).constructor;
                  e = Reflect.construct(r, arguments, i);
                } else e = r.apply(this, arguments);
                return y(this, e);
              });
          function i(e, t) {
            var n, o, a;
            if (
              (p(this, i),
              ((n = r.call(this)).element = e),
              (n.version = i.version),
              (n.clickableElements = []),
              (n.listeners = []),
              (n.files = []),
              "string" == typeof n.element &&
                (n.element = document.querySelector(n.element)),
              !n.element || null == n.element.nodeType)
            )
              throw new Error("Invalid dropzone element.");
            if (n.element.dropzone)
              throw new Error("Dropzone already attached.");
            i.instances.push(g(n)), (n.element.dropzone = g(n));
            var u = null != (a = i.optionsForElement(n.element)) ? a : {};
            if (
              ((n.options = i.extend({}, s, u, null != t ? t : {})),
              (n.options.previewTemplate = n.options.previewTemplate.replace(
                /\n*/g,
                ""
              )),
              n.options.forceFallback || !i.isBrowserSupported())
            )
              return y(n, n.options.fallback.call(g(n)));
            if (
              (null == n.options.url &&
                (n.options.url = n.element.getAttribute("action")),
              !n.options.url)
            )
              throw new Error("No URL provided.");
            if (n.options.acceptedFiles && n.options.acceptedMimeTypes)
              throw new Error(
                "You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated."
              );
            if (n.options.uploadMultiple && n.options.chunking)
              throw new Error(
                "You cannot set both: uploadMultiple and chunking."
              );
            return (
              n.options.acceptedMimeTypes &&
                ((n.options.acceptedFiles = n.options.acceptedMimeTypes),
                delete n.options.acceptedMimeTypes),
              null != n.options.renameFilename &&
                (n.options.renameFile = function (e) {
                  return n.options.renameFilename.call(g(n), e.name, e);
                }),
              "string" == typeof n.options.method &&
                (n.options.method = n.options.method.toUpperCase()),
              (o = n.getExistingFallback()) &&
                o.parentNode &&
                o.parentNode.removeChild(o),
              !1 !== n.options.previewsContainer &&
                (n.options.previewsContainer
                  ? (n.previewsContainer = i.getElement(
                      n.options.previewsContainer,
                      "previewsContainer"
                    ))
                  : (n.previewsContainer = n.element)),
              n.options.clickable &&
                (!0 === n.options.clickable
                  ? (n.clickableElements = [n.element])
                  : (n.clickableElements = i.getElements(
                      n.options.clickable,
                      "clickable"
                    ))),
              n.init(),
              n
            );
          }
          return (
            d(
              i,
              [
                {
                  key: "getAcceptedFiles",
                  value: function () {
                    return this.files
                      .filter(function (e) {
                        return e.accepted;
                      })
                      .map(function (e) {
                        return e;
                      });
                  },
                },
                {
                  key: "getRejectedFiles",
                  value: function () {
                    return this.files
                      .filter(function (e) {
                        return !e.accepted;
                      })
                      .map(function (e) {
                        return e;
                      });
                  },
                },
                {
                  key: "getFilesWithStatus",
                  value: function (e) {
                    return this.files
                      .filter(function (t) {
                        return t.status === e;
                      })
                      .map(function (e) {
                        return e;
                      });
                  },
                },
                {
                  key: "getQueuedFiles",
                  value: function () {
                    return this.getFilesWithStatus(i.QUEUED);
                  },
                },
                {
                  key: "getUploadingFiles",
                  value: function () {
                    return this.getFilesWithStatus(i.UPLOADING);
                  },
                },
                {
                  key: "getAddedFiles",
                  value: function () {
                    return this.getFilesWithStatus(i.ADDED);
                  },
                },
                {
                  key: "getActiveFiles",
                  value: function () {
                    return this.files
                      .filter(function (e) {
                        return (
                          e.status === i.UPLOADING || e.status === i.QUEUED
                        );
                      })
                      .map(function (e) {
                        return e;
                      });
                  },
                },
                {
                  key: "init",
                  value: function () {
                    var e = this;
                    "form" === this.element.tagName &&
                      this.element.setAttribute(
                        "enctype",
                        "multipart/form-data"
                      ),
                      this.element.classList.contains("dropzone") &&
                        !this.element.querySelector(".dz-message") &&
                        this.element.appendChild(
                          i.createElement(
                            '<div class="dz-default dz-message"><button class="dz-button" type="button">'.concat(
                              this.options.dictDefaultMessage,
                              "</button></div>"
                            )
                          )
                        ),
                      this.clickableElements.length &&
                        (function t() {
                          e.hiddenFileInput &&
                            e.hiddenFileInput.parentNode.removeChild(
                              e.hiddenFileInput
                            ),
                            (e.hiddenFileInput =
                              document.createElement("input")),
                            e.hiddenFileInput.setAttribute("type", "file"),
                            (null === e.options.maxFiles ||
                              e.options.maxFiles > 1) &&
                              e.hiddenFileInput.setAttribute(
                                "multiple",
                                "multiple"
                              ),
                            (e.hiddenFileInput.className = "dz-hidden-input"),
                            null !== e.options.acceptedFiles &&
                              e.hiddenFileInput.setAttribute(
                                "accept",
                                e.options.acceptedFiles
                              ),
                            null !== e.options.capture &&
                              e.hiddenFileInput.setAttribute(
                                "capture",
                                e.options.capture
                              ),
                            e.hiddenFileInput.setAttribute("tabindex", "-1"),
                            (e.hiddenFileInput.style.visibility = "hidden"),
                            (e.hiddenFileInput.style.position = "absolute"),
                            (e.hiddenFileInput.style.top = "0"),
                            (e.hiddenFileInput.style.left = "0"),
                            (e.hiddenFileInput.style.height = "0"),
                            (e.hiddenFileInput.style.width = "0"),
                            i
                              .getElement(
                                e.options.hiddenInputContainer,
                                "hiddenInputContainer"
                              )
                              .appendChild(e.hiddenFileInput),
                            e.hiddenFileInput.addEventListener(
                              "change",
                              function () {
                                var n = e.hiddenFileInput.files;
                                if (n.length) {
                                  var r,
                                    i = c(n, !0);
                                  try {
                                    for (i.s(); !(r = i.n()).done; ) {
                                      var o = r.value;
                                      e.addFile(o);
                                    }
                                  } catch (e) {
                                    i.e(e);
                                  } finally {
                                    i.f();
                                  }
                                }
                                e.emit("addedfiles", n), t();
                              }
                            );
                        })(),
                      (this.URL =
                        null !== window.URL ? window.URL : window.webkitURL);
                    var t,
                      n = c(this.events, !0);
                    try {
                      for (n.s(); !(t = n.n()).done; ) {
                        var r = t.value;
                        this.on(r, this.options[r]);
                      }
                    } catch (e) {
                      n.e(e);
                    } finally {
                      n.f();
                    }
                    this.on("uploadprogress", function () {
                      return e.updateTotalUploadProgress();
                    }),
                      this.on("removedfile", function () {
                        return e.updateTotalUploadProgress();
                      }),
                      this.on("canceled", function (t) {
                        return e.emit("complete", t);
                      }),
                      this.on("complete", function (t) {
                        if (
                          0 === e.getAddedFiles().length &&
                          0 === e.getUploadingFiles().length &&
                          0 === e.getQueuedFiles().length
                        )
                          return setTimeout(function () {
                            return e.emit("queuecomplete");
                          }, 0);
                      });
                    var o = function (e) {
                      if (
                        (function (e) {
                          if (e.dataTransfer.types)
                            for (
                              var t = 0;
                              t < e.dataTransfer.types.length;
                              t++
                            )
                              if ("Files" === e.dataTransfer.types[t])
                                return !0;
                          return !1;
                        })(e)
                      )
                        return (
                          e.stopPropagation(),
                          e.preventDefault
                            ? e.preventDefault()
                            : (e.returnValue = !1)
                        );
                    };
                    return (
                      (this.listeners = [
                        {
                          element: this.element,
                          events: {
                            dragstart: function (t) {
                              return e.emit("dragstart", t);
                            },
                            dragenter: function (t) {
                              return o(t), e.emit("dragenter", t);
                            },
                            dragover: function (t) {
                              var n;
                              try {
                                n = t.dataTransfer.effectAllowed;
                              } catch (e) {}
                              return (
                                (t.dataTransfer.dropEffect =
                                  "move" === n || "linkMove" === n
                                    ? "move"
                                    : "copy"),
                                o(t),
                                e.emit("dragover", t)
                              );
                            },
                            dragleave: function (t) {
                              return e.emit("dragleave", t);
                            },
                            drop: function (t) {
                              return o(t), e.drop(t);
                            },
                            dragend: function (t) {
                              return e.emit("dragend", t);
                            },
                          },
                        },
                      ]),
                      this.clickableElements.forEach(function (t) {
                        return e.listeners.push({
                          element: t,
                          events: {
                            click: function (n) {
                              return (
                                (t !== e.element ||
                                  n.target === e.element ||
                                  i.elementInside(
                                    n.target,
                                    e.element.querySelector(".dz-message")
                                  )) &&
                                  e.hiddenFileInput.click(),
                                !0
                              );
                            },
                          },
                        });
                      }),
                      this.enable(),
                      this.options.init.call(this)
                    );
                  },
                },
                {
                  key: "destroy",
                  value: function () {
                    return (
                      this.disable(),
                      this.removeAllFiles(!0),
                      (null != this.hiddenFileInput
                        ? this.hiddenFileInput.parentNode
                        : void 0) &&
                        (this.hiddenFileInput.parentNode.removeChild(
                          this.hiddenFileInput
                        ),
                        (this.hiddenFileInput = null)),
                      delete this.element.dropzone,
                      i.instances.splice(i.instances.indexOf(this), 1)
                    );
                  },
                },
                {
                  key: "updateTotalUploadProgress",
                  value: function () {
                    var e,
                      t = 0,
                      n = 0;
                    if (this.getActiveFiles().length) {
                      var r,
                        i = c(this.getActiveFiles(), !0);
                      try {
                        for (i.s(); !(r = i.n()).done; ) {
                          var o = r.value;
                          (t += o.upload.bytesSent), (n += o.upload.total);
                        }
                      } catch (e) {
                        i.e(e);
                      } finally {
                        i.f();
                      }
                      e = (100 * t) / n;
                    } else e = 100;
                    return this.emit("totaluploadprogress", e, n, t);
                  },
                },
                {
                  key: "_getParamName",
                  value: function (e) {
                    return "function" == typeof this.options.paramName
                      ? this.options.paramName(e)
                      : ""
                          .concat(this.options.paramName)
                          .concat(
                            this.options.uploadMultiple
                              ? "[".concat(e, "]")
                              : ""
                          );
                  },
                },
                {
                  key: "_renameFile",
                  value: function (e) {
                    return "function" != typeof this.options.renameFile
                      ? e.name
                      : this.options.renameFile(e);
                  },
                },
                {
                  key: "getFallbackForm",
                  value: function () {
                    var e, t;
                    if ((e = this.getExistingFallback())) return e;
                    var n = '<div class="dz-fallback">';
                    this.options.dictFallbackText &&
                      (n += "<p>".concat(
                        this.options.dictFallbackText,
                        "</p>"
                      )),
                      (n += '<input type="file" name="'
                        .concat(this._getParamName(0), '" ')
                        .concat(
                          this.options.uploadMultiple
                            ? 'multiple="multiple"'
                            : void 0,
                          ' /><input type="submit" value="Upload!"></div>'
                        ));
                    var r = i.createElement(n);
                    return (
                      "FORM" !== this.element.tagName
                        ? (t = i.createElement(
                            '<form action="'
                              .concat(
                                this.options.url,
                                '" enctype="multipart/form-data" method="'
                              )
                              .concat(this.options.method, '"></form>')
                          )).appendChild(r)
                        : (this.element.setAttribute(
                            "enctype",
                            "multipart/form-data"
                          ),
                          this.element.setAttribute(
                            "method",
                            this.options.method
                          )),
                      null != t ? t : r
                    );
                  },
                },
                {
                  key: "getExistingFallback",
                  value: function () {
                    for (
                      var e = function (e) {
                          var t,
                            n = c(e, !0);
                          try {
                            for (n.s(); !(t = n.n()).done; ) {
                              var r = t.value;
                              if (/(^| )fallback($| )/.test(r.className))
                                return r;
                            }
                          } catch (e) {
                            n.e(e);
                          } finally {
                            n.f();
                          }
                        },
                        t = 0,
                        n = ["div", "form"];
                      t < n.length;
                      t++
                    ) {
                      var r,
                        i = n[t];
                      if ((r = e(this.element.getElementsByTagName(i))))
                        return r;
                    }
                  },
                },
                {
                  key: "setupEventListeners",
                  value: function () {
                    return this.listeners.map(function (e) {
                      return (function () {
                        var t = [];
                        for (var n in e.events) {
                          var r = e.events[n];
                          t.push(e.element.addEventListener(n, r, !1));
                        }
                        return t;
                      })();
                    });
                  },
                },
                {
                  key: "removeEventListeners",
                  value: function () {
                    return this.listeners.map(function (e) {
                      return (function () {
                        var t = [];
                        for (var n in e.events) {
                          var r = e.events[n];
                          t.push(e.element.removeEventListener(n, r, !1));
                        }
                        return t;
                      })();
                    });
                  },
                },
                {
                  key: "disable",
                  value: function () {
                    var e = this;
                    return (
                      this.clickableElements.forEach(function (e) {
                        return e.classList.remove("dz-clickable");
                      }),
                      this.removeEventListeners(),
                      (this.disabled = !0),
                      this.files.map(function (t) {
                        return e.cancelUpload(t);
                      })
                    );
                  },
                },
                {
                  key: "enable",
                  value: function () {
                    return (
                      delete this.disabled,
                      this.clickableElements.forEach(function (e) {
                        return e.classList.add("dz-clickable");
                      }),
                      this.setupEventListeners()
                    );
                  },
                },
                {
                  key: "filesize",
                  value: function (e) {
                    var t = 0,
                      n = "b";
                    if (e > 0) {
                      for (
                        var r = ["tb", "gb", "mb", "kb", "b"], i = 0;
                        i < r.length;
                        i++
                      ) {
                        var o = r[i];
                        if (
                          e >=
                          Math.pow(this.options.filesizeBase, 4 - i) / 10
                        ) {
                          (t = e / Math.pow(this.options.filesizeBase, 4 - i)),
                            (n = o);
                          break;
                        }
                      }
                      t = Math.round(10 * t) / 10;
                    }
                    return "<strong>"
                      .concat(t, "</strong> ")
                      .concat(this.options.dictFileSizeUnits[n]);
                  },
                },
                {
                  key: "_updateMaxFilesReachedClass",
                  value: function () {
                    return null != this.options.maxFiles &&
                      this.getAcceptedFiles().length >= this.options.maxFiles
                      ? (this.getAcceptedFiles().length ===
                          this.options.maxFiles &&
                          this.emit("maxfilesreached", this.files),
                        this.element.classList.add("dz-max-files-reached"))
                      : this.element.classList.remove("dz-max-files-reached");
                  },
                },
                {
                  key: "drop",
                  value: function (e) {
                    if (e.dataTransfer) {
                      this.emit("drop", e);
                      for (
                        var t = [], n = 0;
                        n < e.dataTransfer.files.length;
                        n++
                      )
                        t[n] = e.dataTransfer.files[n];
                      if (t.length) {
                        var r = e.dataTransfer.items;
                        r && r.length && null != r[0].webkitGetAsEntry
                          ? this._addFilesFromItems(r)
                          : this.handleFiles(t);
                      }
                      this.emit("addedfiles", t);
                    }
                  },
                },
                {
                  key: "paste",
                  value: function (e) {
                    if (
                      null !=
                      (null != (t = null != e ? e.clipboardData : void 0)
                        ? (function (e) {
                            return e.items;
                          })(t)
                        : void 0)
                    ) {
                      var t;
                      this.emit("paste", e);
                      var n = e.clipboardData.items;
                      return n.length ? this._addFilesFromItems(n) : void 0;
                    }
                  },
                },
                {
                  key: "handleFiles",
                  value: function (e) {
                    var t,
                      n = c(e, !0);
                    try {
                      for (n.s(); !(t = n.n()).done; ) {
                        var r = t.value;
                        this.addFile(r);
                      }
                    } catch (e) {
                      n.e(e);
                    } finally {
                      n.f();
                    }
                  },
                },
                {
                  key: "_addFilesFromItems",
                  value: function (e) {
                    var t = this;
                    return (function () {
                      var n,
                        r = [],
                        i = c(e, !0);
                      try {
                        for (i.s(); !(n = i.n()).done; ) {
                          var o,
                            a = n.value;
                          null != a.webkitGetAsEntry &&
                          (o = a.webkitGetAsEntry())
                            ? o.isFile
                              ? r.push(t.addFile(a.getAsFile()))
                              : o.isDirectory
                              ? r.push(t._addFilesFromDirectory(o, o.name))
                              : r.push(void 0)
                            : null == a.getAsFile ||
                              (null != a.kind && "file" !== a.kind)
                            ? r.push(void 0)
                            : r.push(t.addFile(a.getAsFile()));
                        }
                      } catch (e) {
                        i.e(e);
                      } finally {
                        i.f();
                      }
                      return r;
                    })();
                  },
                },
                {
                  key: "_addFilesFromDirectory",
                  value: function (e, t) {
                    var n = this,
                      r = e.createReader(),
                      i = function (e) {
                        return (
                          "log",
                          (n = function (t) {
                            return t.log(e);
                          }),
                          null != (t = console) && "function" == typeof t.log
                            ? n(t)
                            : void 0
                        );
                        var t, n;
                      };
                    return (function e() {
                      return r.readEntries(function (r) {
                        if (r.length > 0) {
                          var i,
                            o = c(r, !0);
                          try {
                            for (o.s(); !(i = o.n()).done; ) {
                              var a = i.value;
                              a.isFile
                                ? a.file(function (e) {
                                    if (
                                      !n.options.ignoreHiddenFiles ||
                                      "." !== e.name.substring(0, 1)
                                    )
                                      return (
                                        (e.fullPath = ""
                                          .concat(t, "/")
                                          .concat(e.name)),
                                        n.addFile(e)
                                      );
                                  })
                                : a.isDirectory &&
                                  n._addFilesFromDirectory(
                                    a,
                                    "".concat(t, "/").concat(a.name)
                                  );
                            }
                          } catch (e) {
                            o.e(e);
                          } finally {
                            o.f();
                          }
                          e();
                        }
                        return null;
                      }, i);
                    })();
                  },
                },
                {
                  key: "accept",
                  value: function (e, t) {
                    this.options.maxFilesize &&
                    e.size > 1024 * this.options.maxFilesize * 1024
                      ? t(
                          this.options.dictFileTooBig
                            .replace(
                              "{{filesize}}",
                              Math.round(e.size / 1024 / 10.24) / 100
                            )
                            .replace(
                              "{{maxFilesize}}",
                              this.options.maxFilesize
                            )
                        )
                      : i.isValidFile(e, this.options.acceptedFiles)
                      ? null != this.options.maxFiles &&
                        this.getAcceptedFiles().length >= this.options.maxFiles
                        ? (t(
                            this.options.dictMaxFilesExceeded.replace(
                              "{{maxFiles}}",
                              this.options.maxFiles
                            )
                          ),
                          this.emit("maxfilesexceeded", e))
                        : this.options.accept.call(this, e, t)
                      : t(this.options.dictInvalidFileType);
                  },
                },
                {
                  key: "addFile",
                  value: function (e) {
                    var t = this;
                    (e.upload = {
                      uuid: i.uuidv4(),
                      progress: 0,
                      total: e.size,
                      bytesSent: 0,
                      filename: this._renameFile(e),
                    }),
                      this.files.push(e),
                      (e.status = i.ADDED),
                      this.emit("addedfile", e),
                      this._enqueueThumbnail(e),
                      this.accept(e, function (n) {
                        n
                          ? ((e.accepted = !1), t._errorProcessing([e], n))
                          : ((e.accepted = !0),
                            t.options.autoQueue && t.enqueueFile(e)),
                          t._updateMaxFilesReachedClass();
                      });
                  },
                },
                {
                  key: "enqueueFiles",
                  value: function (e) {
                    var t,
                      n = c(e, !0);
                    try {
                      for (n.s(); !(t = n.n()).done; ) {
                        var r = t.value;
                        this.enqueueFile(r);
                      }
                    } catch (e) {
                      n.e(e);
                    } finally {
                      n.f();
                    }
                    return null;
                  },
                },
                {
                  key: "enqueueFile",
                  value: function (e) {
                    var t = this;
                    if (e.status !== i.ADDED || !0 !== e.accepted)
                      throw new Error(
                        "This file can't be queued because it has already been processed or was rejected."
                      );
                    if (((e.status = i.QUEUED), this.options.autoProcessQueue))
                      return setTimeout(function () {
                        return t.processQueue();
                      }, 0);
                  },
                },
                {
                  key: "_enqueueThumbnail",
                  value: function (e) {
                    var t = this;
                    if (
                      this.options.createImageThumbnails &&
                      e.type.match(/image.*/) &&
                      e.size <= 1024 * this.options.maxThumbnailFilesize * 1024
                    )
                      return (
                        this._thumbnailQueue.push(e),
                        setTimeout(function () {
                          return t._processThumbnailQueue();
                        }, 0)
                      );
                  },
                },
                {
                  key: "_processThumbnailQueue",
                  value: function () {
                    var e = this;
                    if (
                      !this._processingThumbnail &&
                      0 !== this._thumbnailQueue.length
                    ) {
                      this._processingThumbnail = !0;
                      var t = this._thumbnailQueue.shift();
                      return this.createThumbnail(
                        t,
                        this.options.thumbnailWidth,
                        this.options.thumbnailHeight,
                        this.options.thumbnailMethod,
                        !0,
                        function (n) {
                          return (
                            e.emit("thumbnail", t, n),
                            (e._processingThumbnail = !1),
                            e._processThumbnailQueue()
                          );
                        }
                      );
                    }
                  },
                },
                {
                  key: "removeFile",
                  value: function (e) {
                    if (
                      (e.status === i.UPLOADING && this.cancelUpload(e),
                      (this.files = x(this.files, e)),
                      this.emit("removedfile", e),
                      0 === this.files.length)
                    )
                      return this.emit("reset");
                  },
                },
                {
                  key: "removeAllFiles",
                  value: function (e) {
                    null == e && (e = !1);
                    var t,
                      n = c(this.files.slice(), !0);
                    try {
                      for (n.s(); !(t = n.n()).done; ) {
                        var r = t.value;
                        (r.status !== i.UPLOADING || e) && this.removeFile(r);
                      }
                    } catch (e) {
                      n.e(e);
                    } finally {
                      n.f();
                    }
                    return null;
                  },
                },
                {
                  key: "resizeImage",
                  value: function (e, t, n, r, o) {
                    var a = this;
                    return this.createThumbnail(
                      e,
                      t,
                      n,
                      r,
                      !0,
                      function (t, n) {
                        if (null == n) return o(e);
                        var r = a.options.resizeMimeType;
                        null == r && (r = e.type);
                        var u = n.toDataURL(r, a.options.resizeQuality);
                        return (
                          ("image/jpeg" !== r && "image/jpg" !== r) ||
                            (u = k.restore(e.dataURL, u)),
                          o(i.dataURItoBlob(u))
                        );
                      }
                    );
                  },
                },
                {
                  key: "createThumbnail",
                  value: function (e, t, n, r, i, o) {
                    var a = this,
                      u = new FileReader();
                    (u.onload = function () {
                      (e.dataURL = u.result),
                        "image/svg+xml" !== e.type
                          ? a.createThumbnailFromUrl(e, t, n, r, i, o)
                          : null != o && o(u.result);
                    }),
                      u.readAsDataURL(e);
                  },
                },
                {
                  key: "displayExistingFile",
                  value: function (e, t, n, r) {
                    var i = this,
                      o =
                        !(arguments.length > 4 && void 0 !== arguments[4]) ||
                        arguments[4];
                    if (
                      (this.emit("addedfile", e), this.emit("complete", e), o)
                    ) {
                      var a = function (t) {
                        i.emit("thumbnail", e, t), n && n();
                      };
                      (e.dataURL = t),
                        this.createThumbnailFromUrl(
                          e,
                          this.options.thumbnailWidth,
                          this.options.thumbnailHeight,
                          this.options.thumbnailMethod,
                          this.options.fixOrientation,
                          a,
                          r
                        );
                    } else this.emit("thumbnail", e, t), n && n();
                  },
                },
                {
                  key: "createThumbnailFromUrl",
                  value: function (e, t, n, r, i, o, a) {
                    var u = this,
                      s = document.createElement("img");
                    return (
                      a && (s.crossOrigin = a),
                      (i =
                        "from-image" !=
                          getComputedStyle(document.body).imageOrientation &&
                        i),
                      (s.onload = function () {
                        var a = function (e) {
                          return e(1);
                        };
                        return (
                          "undefined" != typeof EXIF &&
                            null !== EXIF &&
                            i &&
                            (a = function (e) {
                              return EXIF.getData(s, function () {
                                return e(EXIF.getTag(this, "Orientation"));
                              });
                            }),
                          a(function (i) {
                            (e.width = s.width), (e.height = s.height);
                            var a = u.options.resize.call(u, e, t, n, r),
                              l = document.createElement("canvas"),
                              c = l.getContext("2d");
                            switch (
                              ((l.width = a.trgWidth),
                              (l.height = a.trgHeight),
                              i > 4 &&
                                ((l.width = a.trgHeight),
                                (l.height = a.trgWidth)),
                              i)
                            ) {
                              case 2:
                                c.translate(l.width, 0), c.scale(-1, 1);
                                break;
                              case 3:
                                c.translate(l.width, l.height),
                                  c.rotate(Math.PI);
                                break;
                              case 4:
                                c.translate(0, l.height), c.scale(1, -1);
                                break;
                              case 5:
                                c.rotate(0.5 * Math.PI), c.scale(1, -1);
                                break;
                              case 6:
                                c.rotate(0.5 * Math.PI),
                                  c.translate(0, -l.width);
                                break;
                              case 7:
                                c.rotate(0.5 * Math.PI),
                                  c.translate(l.height, -l.width),
                                  c.scale(-1, 1);
                                break;
                              case 8:
                                c.rotate(-0.5 * Math.PI),
                                  c.translate(-l.height, 0);
                            }
                            E(
                              c,
                              s,
                              null != a.srcX ? a.srcX : 0,
                              null != a.srcY ? a.srcY : 0,
                              a.srcWidth,
                              a.srcHeight,
                              null != a.trgX ? a.trgX : 0,
                              null != a.trgY ? a.trgY : 0,
                              a.trgWidth,
                              a.trgHeight
                            );
                            var f = l.toDataURL("image/png");
                            if (null != o) return o(f, l);
                          })
                        );
                      }),
                      null != o && (s.onerror = o),
                      (s.src = e.dataURL)
                    );
                  },
                },
                {
                  key: "processQueue",
                  value: function () {
                    var e = this.options.parallelUploads,
                      t = this.getUploadingFiles().length,
                      n = t;
                    if (!(t >= e)) {
                      var r = this.getQueuedFiles();
                      if (r.length > 0) {
                        if (this.options.uploadMultiple)
                          return this.processFiles(r.slice(0, e - t));
                        for (; n < e; ) {
                          if (!r.length) return;
                          this.processFile(r.shift()), n++;
                        }
                      }
                    }
                  },
                },
                {
                  key: "processFile",
                  value: function (e) {
                    return this.processFiles([e]);
                  },
                },
                {
                  key: "processFiles",
                  value: function (e) {
                    var t,
                      n = c(e, !0);
                    try {
                      for (n.s(); !(t = n.n()).done; ) {
                        var r = t.value;
                        (r.processing = !0),
                          (r.status = i.UPLOADING),
                          this.emit("processing", r);
                      }
                    } catch (e) {
                      n.e(e);
                    } finally {
                      n.f();
                    }
                    return (
                      this.options.uploadMultiple &&
                        this.emit("processingmultiple", e),
                      this.uploadFiles(e)
                    );
                  },
                },
                {
                  key: "_getFilesWithXhr",
                  value: function (e) {
                    return this.files
                      .filter(function (t) {
                        return t.xhr === e;
                      })
                      .map(function (e) {
                        return e;
                      });
                  },
                },
                {
                  key: "cancelUpload",
                  value: function (e) {
                    if (e.status === i.UPLOADING) {
                      var t,
                        n = this._getFilesWithXhr(e.xhr),
                        r = c(n, !0);
                      try {
                        for (r.s(); !(t = r.n()).done; )
                          t.value.status = i.CANCELED;
                      } catch (e) {
                        r.e(e);
                      } finally {
                        r.f();
                      }
                      void 0 !== e.xhr && e.xhr.abort();
                      var o,
                        a = c(n, !0);
                      try {
                        for (a.s(); !(o = a.n()).done; ) {
                          var u = o.value;
                          this.emit("canceled", u);
                        }
                      } catch (e) {
                        a.e(e);
                      } finally {
                        a.f();
                      }
                      this.options.uploadMultiple &&
                        this.emit("canceledmultiple", n);
                    } else
                      (e.status !== i.ADDED && e.status !== i.QUEUED) ||
                        ((e.status = i.CANCELED),
                        this.emit("canceled", e),
                        this.options.uploadMultiple &&
                          this.emit("canceledmultiple", [e]));
                    if (this.options.autoProcessQueue)
                      return this.processQueue();
                  },
                },
                {
                  key: "resolveOption",
                  value: function (e) {
                    if ("function" == typeof e) {
                      for (
                        var t = arguments.length,
                          n = new Array(t > 1 ? t - 1 : 0),
                          r = 1;
                        r < t;
                        r++
                      )
                        n[r - 1] = arguments[r];
                      return e.apply(this, n);
                    }
                    return e;
                  },
                },
                {
                  key: "uploadFile",
                  value: function (e) {
                    return this.uploadFiles([e]);
                  },
                },
                {
                  key: "uploadFiles",
                  value: function (e) {
                    var t = this;
                    this._transformFiles(e, function (n) {
                      if (t.options.chunking) {
                        var r = n[0];
                        (e[0].upload.chunked =
                          t.options.chunking &&
                          (t.options.forceChunking ||
                            r.size > t.options.chunkSize)),
                          (e[0].upload.totalChunkCount = Math.ceil(
                            r.size / t.options.chunkSize
                          ));
                      }
                      if (e[0].upload.chunked) {
                        var o = e[0],
                          a = n[0];
                        o.upload.chunks = [];
                        var u = function () {
                          for (var n = 0; void 0 !== o.upload.chunks[n]; ) n++;
                          if (!(n >= o.upload.totalChunkCount)) {
                            var r = n * t.options.chunkSize,
                              u = Math.min(r + t.options.chunkSize, a.size),
                              s = {
                                name: t._getParamName(0),
                                data: a.webkitSlice
                                  ? a.webkitSlice(r, u)
                                  : a.slice(r, u),
                                filename: o.upload.filename,
                                chunkIndex: n,
                              };
                            (o.upload.chunks[n] = {
                              file: o,
                              index: n,
                              dataBlock: s,
                              status: i.UPLOADING,
                              progress: 0,
                              retries: 0,
                            }),
                              t._uploadData(e, [s]);
                          }
                        };
                        if (
                          ((o.upload.finishedChunkUpload = function (n, r) {
                            var a = !0;
                            (n.status = i.SUCCESS),
                              (n.dataBlock = null),
                              (n.xhr = null);
                            for (var s = 0; s < o.upload.totalChunkCount; s++) {
                              if (void 0 === o.upload.chunks[s]) return u();
                              o.upload.chunks[s].status !== i.SUCCESS &&
                                (a = !1);
                            }
                            a &&
                              t.options.chunksUploaded(o, function () {
                                t._finished(e, r, null);
                              });
                          }),
                          t.options.parallelChunkUploads)
                        )
                          for (var s = 0; s < o.upload.totalChunkCount; s++)
                            u();
                        else u();
                      } else {
                        for (var l = [], c = 0; c < e.length; c++)
                          l[c] = {
                            name: t._getParamName(c),
                            data: n[c],
                            filename: e[c].upload.filename,
                          };
                        t._uploadData(e, l);
                      }
                    });
                  },
                },
                {
                  key: "_getChunk",
                  value: function (e, t) {
                    for (var n = 0; n < e.upload.totalChunkCount; n++)
                      if (
                        void 0 !== e.upload.chunks[n] &&
                        e.upload.chunks[n].xhr === t
                      )
                        return e.upload.chunks[n];
                  },
                },
                {
                  key: "_uploadData",
                  value: function (e, t) {
                    var n,
                      r = this,
                      o = new XMLHttpRequest(),
                      a = c(e, !0);
                    try {
                      for (a.s(); !(n = a.n()).done; ) n.value.xhr = o;
                    } catch (e) {
                      a.e(e);
                    } finally {
                      a.f();
                    }
                    e[0].upload.chunked &&
                      (e[0].upload.chunks[t[0].chunkIndex].xhr = o);
                    var u = this.resolveOption(this.options.method, e),
                      s = this.resolveOption(this.options.url, e);
                    o.open(u, s, !0),
                      this.resolveOption(this.options.timeout, e) &&
                        (o.timeout = this.resolveOption(
                          this.options.timeout,
                          e
                        )),
                      (o.withCredentials = !!this.options.withCredentials),
                      (o.onload = function (t) {
                        r._finishedUploading(e, o, t);
                      }),
                      (o.ontimeout = function () {
                        r._handleUploadError(
                          e,
                          o,
                          "Request timedout after ".concat(
                            r.options.timeout / 1e3,
                            " seconds"
                          )
                        );
                      }),
                      (o.onerror = function () {
                        r._handleUploadError(e, o);
                      }),
                      ((null != o.upload ? o.upload : o).onprogress = function (
                        t
                      ) {
                        return r._updateFilesUploadProgress(e, o, t);
                      });
                    var l = {
                      Accept: "application/json",
                      "Cache-Control": "no-cache",
                      "X-Requested-With": "XMLHttpRequest",
                    };
                    for (var f in (this.options.headers &&
                      i.extend(l, this.options.headers),
                    l)) {
                      var p = l[f];
                      p && o.setRequestHeader(f, p);
                    }
                    var h = new FormData();
                    if (this.options.params) {
                      var d = this.options.params;
                      for (var v in ("function" == typeof d &&
                        (d = d.call(
                          this,
                          e,
                          o,
                          e[0].upload.chunked ? this._getChunk(e[0], o) : null
                        )),
                      d)) {
                        var y = d[v];
                        if (Array.isArray(y))
                          for (var g = 0; g < y.length; g++) h.append(v, y[g]);
                        else h.append(v, y);
                      }
                    }
                    var m,
                      b = c(e, !0);
                    try {
                      for (b.s(); !(m = b.n()).done; ) {
                        var x = m.value;
                        this.emit("sending", x, o, h);
                      }
                    } catch (e) {
                      b.e(e);
                    } finally {
                      b.f();
                    }
                    this.options.uploadMultiple &&
                      this.emit("sendingmultiple", e, o, h),
                      this._addFormElementData(h);
                    for (var w = 0; w < t.length; w++) {
                      var E = t[w];
                      h.append(E.name, E.data, E.filename);
                    }
                    this.submitRequest(o, h, e);
                  },
                },
                {
                  key: "_transformFiles",
                  value: function (e, t) {
                    for (
                      var n = this,
                        r = [],
                        i = 0,
                        o = function (o) {
                          n.options.transformFile.call(n, e[o], function (n) {
                            (r[o] = n), ++i === e.length && t(r);
                          });
                        },
                        a = 0;
                      a < e.length;
                      a++
                    )
                      o(a);
                  },
                },
                {
                  key: "_addFormElementData",
                  value: function (e) {
                    if ("FORM" === this.element.tagName) {
                      var t,
                        n = c(
                          this.element.querySelectorAll(
                            "input, textarea, select, button"
                          ),
                          !0
                        );
                      try {
                        for (n.s(); !(t = n.n()).done; ) {
                          var r = t.value,
                            i = r.getAttribute("name"),
                            o = r.getAttribute("type");
                          if ((o && (o = o.toLowerCase()), null != i))
                            if (
                              "SELECT" === r.tagName &&
                              r.hasAttribute("multiple")
                            ) {
                              var a,
                                u = c(r.options, !0);
                              try {
                                for (u.s(); !(a = u.n()).done; ) {
                                  var s = a.value;
                                  s.selected && e.append(i, s.value);
                                }
                              } catch (e) {
                                u.e(e);
                              } finally {
                                u.f();
                              }
                            } else
                              (!o ||
                                ("checkbox" !== o && "radio" !== o) ||
                                r.checked) &&
                                e.append(i, r.value);
                        }
                      } catch (e) {
                        n.e(e);
                      } finally {
                        n.f();
                      }
                    }
                  },
                },
                {
                  key: "_updateFilesUploadProgress",
                  value: function (e, t, n) {
                    if (e[0].upload.chunked) {
                      var r = e[0],
                        i = this._getChunk(r, t);
                      n
                        ? ((i.progress = (100 * n.loaded) / n.total),
                          (i.total = n.total),
                          (i.bytesSent = n.loaded))
                        : ((i.progress = 100), (i.bytesSent = i.total)),
                        (r.upload.progress = 0),
                        (r.upload.total = 0),
                        (r.upload.bytesSent = 0);
                      for (var o = 0; o < r.upload.totalChunkCount; o++)
                        r.upload.chunks[o] &&
                          void 0 !== r.upload.chunks[o].progress &&
                          ((r.upload.progress += r.upload.chunks[o].progress),
                          (r.upload.total += r.upload.chunks[o].total),
                          (r.upload.bytesSent += r.upload.chunks[o].bytesSent));
                      (r.upload.progress =
                        r.upload.progress / r.upload.totalChunkCount),
                        this.emit(
                          "uploadprogress",
                          r,
                          r.upload.progress,
                          r.upload.bytesSent
                        );
                    } else {
                      var a,
                        u = c(e, !0);
                      try {
                        for (u.s(); !(a = u.n()).done; ) {
                          var s = a.value;
                          (s.upload.total &&
                            s.upload.bytesSent &&
                            s.upload.bytesSent == s.upload.total) ||
                            (n
                              ? ((s.upload.progress =
                                  (100 * n.loaded) / n.total),
                                (s.upload.total = n.total),
                                (s.upload.bytesSent = n.loaded))
                              : ((s.upload.progress = 100),
                                (s.upload.bytesSent = s.upload.total)),
                            this.emit(
                              "uploadprogress",
                              s,
                              s.upload.progress,
                              s.upload.bytesSent
                            ));
                        }
                      } catch (e) {
                        u.e(e);
                      } finally {
                        u.f();
                      }
                    }
                  },
                },
                {
                  key: "_finishedUploading",
                  value: function (e, t, n) {
                    var r;
                    if (e[0].status !== i.CANCELED && 4 === t.readyState) {
                      if (
                        "arraybuffer" !== t.responseType &&
                        "blob" !== t.responseType &&
                        ((r = t.responseText),
                        t.getResponseHeader("content-type") &&
                          ~t
                            .getResponseHeader("content-type")
                            .indexOf("application/json"))
                      )
                        try {
                          r = JSON.parse(r);
                        } catch (e) {
                          (n = e), (r = "Invalid JSON response from server.");
                        }
                      this._updateFilesUploadProgress(e, t),
                        200 <= t.status && t.status < 300
                          ? e[0].upload.chunked
                            ? e[0].upload.finishedChunkUpload(
                                this._getChunk(e[0], t),
                                r
                              )
                            : this._finished(e, r, n)
                          : this._handleUploadError(e, t, r);
                    }
                  },
                },
                {
                  key: "_handleUploadError",
                  value: function (e, t, n) {
                    if (e[0].status !== i.CANCELED) {
                      if (e[0].upload.chunked && this.options.retryChunks) {
                        var r = this._getChunk(e[0], t);
                        if (r.retries++ < this.options.retryChunksLimit)
                          return void this._uploadData(e, [r.dataBlock]);
                        console.warn(
                          "Retried this chunk too often. Giving up."
                        );
                      }
                      this._errorProcessing(
                        e,
                        n ||
                          this.options.dictResponseError.replace(
                            "{{statusCode}}",
                            t.status
                          ),
                        t
                      );
                    }
                  },
                },
                {
                  key: "submitRequest",
                  value: function (e, t, n) {
                    1 == e.readyState
                      ? e.send(t)
                      : console.warn(
                          "Cannot send this request because the XMLHttpRequest.readyState is not OPENED."
                        );
                  },
                },
                {
                  key: "_finished",
                  value: function (e, t, n) {
                    var r,
                      o = c(e, !0);
                    try {
                      for (o.s(); !(r = o.n()).done; ) {
                        var a = r.value;
                        (a.status = i.SUCCESS),
                          this.emit("success", a, t, n),
                          this.emit("complete", a);
                      }
                    } catch (e) {
                      o.e(e);
                    } finally {
                      o.f();
                    }
                    if (
                      (this.options.uploadMultiple &&
                        (this.emit("successmultiple", e, t, n),
                        this.emit("completemultiple", e)),
                      this.options.autoProcessQueue)
                    )
                      return this.processQueue();
                  },
                },
                {
                  key: "_errorProcessing",
                  value: function (e, t, n) {
                    var r,
                      o = c(e, !0);
                    try {
                      for (o.s(); !(r = o.n()).done; ) {
                        var a = r.value;
                        (a.status = i.ERROR),
                          this.emit("error", a, t, n),
                          this.emit("complete", a);
                      }
                    } catch (e) {
                      o.e(e);
                    } finally {
                      o.f();
                    }
                    if (
                      (this.options.uploadMultiple &&
                        (this.emit("errormultiple", e, t, n),
                        this.emit("completemultiple", e)),
                      this.options.autoProcessQueue)
                    )
                      return this.processQueue();
                  },
                },
              ],
              [
                {
                  key: "initClass",
                  value: function () {
                    (this.prototype.Emitter = o),
                      (this.prototype.events = [
                        "drop",
                        "dragstart",
                        "dragend",
                        "dragenter",
                        "dragover",
                        "dragleave",
                        "addedfile",
                        "addedfiles",
                        "removedfile",
                        "thumbnail",
                        "error",
                        "errormultiple",
                        "processing",
                        "processingmultiple",
                        "uploadprogress",
                        "totaluploadprogress",
                        "sending",
                        "sendingmultiple",
                        "success",
                        "successmultiple",
                        "canceled",
                        "canceledmultiple",
                        "complete",
                        "completemultiple",
                        "reset",
                        "maxfilesexceeded",
                        "maxfilesreached",
                        "queuecomplete",
                      ]),
                      (this.prototype._thumbnailQueue = []),
                      (this.prototype._processingThumbnail = !1);
                  },
                },
                {
                  key: "extend",
                  value: function (e) {
                    for (
                      var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        r = 1;
                      r < t;
                      r++
                    )
                      n[r - 1] = arguments[r];
                    for (var i = 0, o = n; i < o.length; i++) {
                      var a = o[i];
                      for (var u in a) {
                        var s = a[u];
                        e[u] = s;
                      }
                    }
                    return e;
                  },
                },
                {
                  key: "uuidv4",
                  value: function () {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                      /[xy]/g,
                      function (e) {
                        var t = (16 * Math.random()) | 0;
                        return ("x" === e ? t : (3 & t) | 8).toString(16);
                      }
                    );
                  },
                },
              ]
            ),
            i
          );
        })(o);
        b.initClass(),
          (b.version = "5.9.3"),
          (b.options = {}),
          (b.optionsForElement = function (e) {
            return e.getAttribute("id")
              ? b.options[w(e.getAttribute("id"))]
              : void 0;
          }),
          (b.instances = []),
          (b.forElement = function (e) {
            if (
              ("string" == typeof e && (e = document.querySelector(e)),
              null == (null != e ? e.dropzone : void 0))
            )
              throw new Error(
                "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone."
              );
            return e.dropzone;
          }),
          (b.autoDiscover = !0),
          (b.discover = function () {
            var e;
            if (document.querySelectorAll)
              e = document.querySelectorAll(".dropzone");
            else {
              e = [];
              var t = function (t) {
                return (function () {
                  var n,
                    r = [],
                    i = c(t, !0);
                  try {
                    for (i.s(); !(n = i.n()).done; ) {
                      var o = n.value;
                      /(^| )dropzone($| )/.test(o.className)
                        ? r.push(e.push(o))
                        : r.push(void 0);
                    }
                  } catch (e) {
                    i.e(e);
                  } finally {
                    i.f();
                  }
                  return r;
                })();
              };
              t(document.getElementsByTagName("div")),
                t(document.getElementsByTagName("form"));
            }
            return (function () {
              var t,
                n = [],
                r = c(e, !0);
              try {
                for (r.s(); !(t = r.n()).done; ) {
                  var i = t.value;
                  !1 !== b.optionsForElement(i)
                    ? n.push(new b(i))
                    : n.push(void 0);
                }
              } catch (e) {
                r.e(e);
              } finally {
                r.f();
              }
              return n;
            })();
          }),
          (b.blockedBrowsers = [
            /opera.*(Macintosh|Windows Phone).*version\/12/i,
          ]),
          (b.isBrowserSupported = function () {
            var e = !0;
            if (
              window.File &&
              window.FileReader &&
              window.FileList &&
              window.Blob &&
              window.FormData &&
              document.querySelector
            )
              if ("classList" in document.createElement("a")) {
                void 0 !== b.blacklistedBrowsers &&
                  (b.blockedBrowsers = b.blacklistedBrowsers);
                var t,
                  n = c(b.blockedBrowsers, !0);
                try {
                  for (n.s(); !(t = n.n()).done; )
                    t.value.test(navigator.userAgent) && (e = !1);
                } catch (e) {
                  n.e(e);
                } finally {
                  n.f();
                }
              } else e = !1;
            else e = !1;
            return e;
          }),
          (b.dataURItoBlob = function (e) {
            for (
              var t = atob(e.split(",")[1]),
                n = e.split(",")[0].split(":")[1].split(";")[0],
                r = new ArrayBuffer(t.length),
                i = new Uint8Array(r),
                o = 0,
                a = t.length,
                u = 0 <= a;
              u ? o <= a : o >= a;
              u ? o++ : o--
            )
              i[o] = t.charCodeAt(o);
            return new Blob([r], { type: n });
          });
        var x = function (e, t) {
            return e
              .filter(function (e) {
                return e !== t;
              })
              .map(function (e) {
                return e;
              });
          },
          w = function (e) {
            return e.replace(/[\-_](\w)/g, function (e) {
              return e.charAt(1).toUpperCase();
            });
          };
        (b.createElement = function (e) {
          var t = document.createElement("div");
          return (t.innerHTML = e), t.childNodes[0];
        }),
          (b.elementInside = function (e, t) {
            if (e === t) return !0;
            for (; (e = e.parentNode); ) if (e === t) return !0;
            return !1;
          }),
          (b.getElement = function (e, t) {
            var n;
            if (
              ("string" == typeof e
                ? (n = document.querySelector(e))
                : null != e.nodeType && (n = e),
              null == n)
            )
              throw new Error(
                "Invalid `".concat(
                  t,
                  "` option provided. Please provide a CSS selector or a plain HTML element."
                )
              );
            return n;
          }),
          (b.getElements = function (e, t) {
            var n, r;
            if (e instanceof Array) {
              r = [];
              try {
                var i,
                  o = c(e, !0);
                try {
                  for (o.s(); !(i = o.n()).done; )
                    (n = i.value), r.push(this.getElement(n, t));
                } catch (e) {
                  o.e(e);
                } finally {
                  o.f();
                }
              } catch (e) {
                r = null;
              }
            } else if ("string" == typeof e) {
              r = [];
              var a,
                u = c(document.querySelectorAll(e), !0);
              try {
                for (u.s(); !(a = u.n()).done; ) (n = a.value), r.push(n);
              } catch (e) {
                u.e(e);
              } finally {
                u.f();
              }
            } else null != e.nodeType && (r = [e]);
            if (null == r || !r.length)
              throw new Error(
                "Invalid `".concat(
                  t,
                  "` option provided. Please provide a CSS selector, a plain HTML element or a list of those."
                )
              );
            return r;
          }),
          (b.confirm = function (e, t, n) {
            return window.confirm(e) ? t() : null != n ? n() : void 0;
          }),
          (b.isValidFile = function (e, t) {
            if (!t) return !0;
            t = t.split(",");
            var n,
              r = e.type,
              i = r.replace(/\/.*$/, ""),
              o = c(t, !0);
            try {
              for (o.s(); !(n = o.n()).done; ) {
                var a = n.value;
                if ("." === (a = a.trim()).charAt(0)) {
                  if (
                    -1 !==
                    e.name
                      .toLowerCase()
                      .indexOf(a.toLowerCase(), e.name.length - a.length)
                  )
                    return !0;
                } else if (/\/\*$/.test(a)) {
                  if (i === a.replace(/\/.*$/, "")) return !0;
                } else if (r === a) return !0;
              }
            } catch (e) {
              o.e(e);
            } finally {
              o.f();
            }
            return !1;
          }),
          "undefined" != typeof jQuery &&
            null !== jQuery &&
            (jQuery.fn.dropzone = function (e) {
              return this.each(function () {
                return new b(this, e);
              });
            }),
          (b.ADDED = "added"),
          (b.QUEUED = "queued"),
          (b.ACCEPTED = b.QUEUED),
          (b.UPLOADING = "uploading"),
          (b.PROCESSING = b.UPLOADING),
          (b.CANCELED = "canceled"),
          (b.ERROR = "error"),
          (b.SUCCESS = "success");
        var E = function (e, t, n, r, i, o, a, u, s, l) {
            var c = (function (e) {
              e.naturalWidth;
              var t = e.naturalHeight,
                n = document.createElement("canvas");
              (n.width = 1), (n.height = t);
              var r = n.getContext("2d");
              r.drawImage(e, 0, 0);
              for (
                var i = r.getImageData(1, 0, 1, t).data, o = 0, a = t, u = t;
                u > o;

              )
                0 === i[4 * (u - 1) + 3] ? (a = u) : (o = u),
                  (u = (a + o) >> 1);
              var s = u / t;
              return 0 === s ? 1 : s;
            })(t);
            return e.drawImage(t, n, r, i, o, a, u, s, l / c);
          },
          k = (function () {
            function e() {
              p(this, e);
            }
            return (
              d(e, null, [
                {
                  key: "initClass",
                  value: function () {
                    this.KEY_STR =
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                  },
                },
                {
                  key: "encode64",
                  value: function (e) {
                    for (
                      var t = "",
                        n = void 0,
                        r = void 0,
                        i = "",
                        o = void 0,
                        a = void 0,
                        u = void 0,
                        s = "",
                        l = 0;
                      (o = (n = e[l++]) >> 2),
                        (a = ((3 & n) << 4) | ((r = e[l++]) >> 4)),
                        (u = ((15 & r) << 2) | ((i = e[l++]) >> 6)),
                        (s = 63 & i),
                        isNaN(r) ? (u = s = 64) : isNaN(i) && (s = 64),
                        (t =
                          t +
                          this.KEY_STR.charAt(o) +
                          this.KEY_STR.charAt(a) +
                          this.KEY_STR.charAt(u) +
                          this.KEY_STR.charAt(s)),
                        (n = r = i = ""),
                        (o = a = u = s = ""),
                        l < e.length;

                    );
                    return t;
                  },
                },
                {
                  key: "restore",
                  value: function (e, t) {
                    if (!e.match("data:image/jpeg;base64,")) return t;
                    var n = this.decode64(
                        e.replace("data:image/jpeg;base64,", "")
                      ),
                      r = this.slice2Segments(n),
                      i = this.exifManipulation(t, r);
                    return "data:image/jpeg;base64,".concat(this.encode64(i));
                  },
                },
                {
                  key: "exifManipulation",
                  value: function (e, t) {
                    var n = this.getExifArray(t),
                      r = this.insertExif(e, n);
                    return new Uint8Array(r);
                  },
                },
                {
                  key: "getExifArray",
                  value: function (e) {
                    for (var t = void 0, n = 0; n < e.length; ) {
                      if ((255 === (t = e[n])[0]) & (225 === t[1])) return t;
                      n++;
                    }
                    return [];
                  },
                },
                {
                  key: "insertExif",
                  value: function (e, t) {
                    var n = e.replace("data:image/jpeg;base64,", ""),
                      r = this.decode64(n),
                      i = r.indexOf(255, 3),
                      o = r.slice(0, i),
                      a = r.slice(i),
                      u = o;
                    return (u = u.concat(t)).concat(a);
                  },
                },
                {
                  key: "slice2Segments",
                  value: function (e) {
                    for (
                      var t = 0, n = [];
                      !((255 === e[t]) & (218 === e[t + 1]));

                    ) {
                      if ((255 === e[t]) & (216 === e[t + 1])) t += 2;
                      else {
                        var r = t + (256 * e[t + 2] + e[t + 3]) + 2,
                          i = e.slice(t, r);
                        n.push(i), (t = r);
                      }
                      if (t > e.length) break;
                    }
                    return n;
                  },
                },
                {
                  key: "decode64",
                  value: function (e) {
                    var t = void 0,
                      n = void 0,
                      r = "",
                      i = void 0,
                      o = void 0,
                      a = "",
                      u = 0,
                      s = [];
                    for (
                      /[^A-Za-z0-9\+\/\=]/g.exec(e) &&
                        console.warn(
                          "There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."
                        ),
                        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                      (t =
                        (this.KEY_STR.indexOf(e.charAt(u++)) << 2) |
                        ((i = this.KEY_STR.indexOf(e.charAt(u++))) >> 4)),
                        (n =
                          ((15 & i) << 4) |
                          ((o = this.KEY_STR.indexOf(e.charAt(u++))) >> 2)),
                        (r =
                          ((3 & o) << 6) |
                          (a = this.KEY_STR.indexOf(e.charAt(u++)))),
                        s.push(t),
                        64 !== o && s.push(n),
                        64 !== a && s.push(r),
                        (t = n = r = ""),
                        (i = o = a = ""),
                        u < e.length;

                    );
                    return s;
                  },
                },
              ]),
              e
            );
          })();
        k.initClass(),
          (b._autoDiscoverFunction = function () {
            if (b.autoDiscover) return b.discover();
          }),
          (function (e, t) {
            var n = !1,
              r = !0,
              i = e.document,
              o = i.documentElement,
              a = i.addEventListener ? "addEventListener" : "attachEvent",
              u = i.addEventListener ? "removeEventListener" : "detachEvent",
              s = i.addEventListener ? "" : "on",
              l = function r(o) {
                if (
                  "readystatechange" !== o.type ||
                  "complete" === i.readyState
                )
                  return (
                    ("load" === o.type ? e : i)[u](s + o.type, r, !1),
                    !n && (n = !0) ? t.call(e, o.type || o) : void 0
                  );
              };
            if ("complete" !== i.readyState) {
              if (i.createEventObject && o.doScroll) {
                try {
                  r = !e.frameElement;
                } catch (e) {}
                r &&
                  (function e() {
                    try {
                      o.doScroll("left");
                    } catch (t) {
                      return void setTimeout(e, 50);
                    }
                    return l("poll");
                  })();
              }
              i[a](s + "DOMContentLoaded", l, !1),
                i[a](s + "readystatechange", l, !1),
                e[a](s + "load", l, !1);
            }
          })(window, b._autoDiscoverFunction),
          (window.Dropzone = b);
        var A = b;
      })(),
      r
    );
  })();
});
/* jQuery Masked Input Plugin 1.4.0 | Copyright (c) 2007 - 2014 Josh Bush (digitalbush.com) | Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) */
!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : a("object" == typeof exports ? require("jquery") : jQuery);
})(function (a) {
  var b,
    c = navigator.userAgent,
    d = /iphone/i.test(c),
    e = /chrome/i.test(c),
    f = /android/i.test(c);
  (a.mask = {
    definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" },
    autoclear: !0,
    dataName: "rawMaskFn",
    placeholder: "_",
  }),
    a.fn.extend({
      caret: function (a, b) {
        var c;
        if (0 !== this.length && !this.is(":hidden"))
          return "number" == typeof a
            ? ((b = "number" == typeof b ? b : a),
              this.each(function () {
                this.setSelectionRange
                  ? this.setSelectionRange(a, b)
                  : this.createTextRange &&
                    ((c = this.createTextRange()),
                    c.collapse(!0),
                    c.moveEnd("character", b),
                    c.moveStart("character", a),
                    c.select());
              }))
            : (this[0].setSelectionRange
                ? ((a = this[0].selectionStart), (b = this[0].selectionEnd))
                : document.selection &&
                  document.selection.createRange &&
                  ((c = document.selection.createRange()),
                  (a = 0 - c.duplicate().moveStart("character", -1e5)),
                  (b = a + c.text.length)),
              { begin: a, end: b });
      },
      unmask: function () {
        return this.trigger("unmask");
      },
      mask: function (c, g) {
        var h, i, j, k, l, m, n, o;
        if (!c && this.length > 0) {
          h = a(this[0]);
          var p = h.data(a.mask.dataName);
          return p ? p() : void 0;
        }
        return (
          (g = a.extend(
            {
              autoclear: a.mask.autoclear,
              placeholder: a.mask.placeholder,
              completed: null,
            },
            g
          )),
          (i = a.mask.definitions),
          (j = []),
          (k = n = c.length),
          (l = null),
          a.each(c.split(""), function (a, b) {
            "?" == b
              ? (n--, (k = a))
              : i[b]
              ? (j.push(new RegExp(i[b])),
                null === l && (l = j.length - 1),
                k > a && (m = j.length - 1))
              : j.push(null);
          }),
          this.trigger("unmask").each(function () {
            function h() {
              if (g.completed) {
                for (var a = l; m >= a; a++) if (j[a] && C[a] === p(a)) return;
                g.completed.call(B);
              }
            }
            function p(a) {
              return g.placeholder.charAt(a < g.placeholder.length ? a : 0);
            }
            function q(a) {
              for (; ++a < n && !j[a]; );
              return a;
            }
            function r(a) {
              for (; --a >= 0 && !j[a]; );
              return a;
            }
            function s(a, b) {
              var c, d;
              if (!(0 > a)) {
                for (c = a, d = q(b); n > c; c++)
                  if (j[c]) {
                    if (!(n > d && j[c].test(C[d]))) break;
                    (C[c] = C[d]), (C[d] = p(d)), (d = q(d));
                  }
                z(), B.caret(Math.max(l, a));
              }
            }
            function t(a) {
              var b, c, d, e;
              for (b = a, c = p(a); n > b; b++)
                if (j[b]) {
                  if (
                    ((d = q(b)),
                    (e = C[b]),
                    (C[b] = c),
                    !(n > d && j[d].test(e)))
                  )
                    break;
                  c = e;
                }
            }
            function u() {
              var a = B.val(),
                b = B.caret();
              if (a.length < o.length) {
                for (A(!0); b.begin > 0 && !j[b.begin - 1]; ) b.begin--;
                if (0 === b.begin)
                  for (; b.begin < l && !j[b.begin]; ) b.begin++;
                B.caret(b.begin, b.begin);
              } else {
                for (A(!0); b.begin < n && !j[b.begin]; ) b.begin++;
                B.caret(b.begin, b.begin);
              }
              h();
            }
            function v() {
              A(), B.val() != E && B.change();
            }
            function w(a) {
              if (!B.prop("readonly")) {
                var b,
                  c,
                  e,
                  f = a.which || a.keyCode;
                (o = B.val()),
                  8 === f || 46 === f || (d && 127 === f)
                    ? ((b = B.caret()),
                      (c = b.begin),
                      (e = b.end),
                      e - c === 0 &&
                        ((c = 46 !== f ? r(c) : (e = q(c - 1))),
                        (e = 46 === f ? q(e) : e)),
                      y(c, e),
                      s(c, e - 1),
                      a.preventDefault())
                    : 13 === f
                    ? v.call(this, a)
                    : 27 === f &&
                      (B.val(E), B.caret(0, A()), a.preventDefault());
              }
            }
            function x(b) {
              if (!B.prop("readonly")) {
                var c,
                  d,
                  e,
                  g = b.which || b.keyCode,
                  i = B.caret();
                if (
                  !(b.ctrlKey || b.altKey || b.metaKey || 32 > g) &&
                  g &&
                  13 !== g
                ) {
                  if (
                    (i.end - i.begin !== 0 &&
                      (y(i.begin, i.end), s(i.begin, i.end - 1)),
                    (c = q(i.begin - 1)),
                    n > c && ((d = String.fromCharCode(g)), j[c].test(d)))
                  ) {
                    if ((t(c), (C[c] = d), z(), (e = q(c)), f)) {
                      var k = function () {
                        a.proxy(a.fn.caret, B, e)();
                      };
                      setTimeout(k, 0);
                    } else B.caret(e);
                    i.begin <= m && h();
                  }
                  b.preventDefault();
                }
              }
            }
            function y(a, b) {
              var c;
              for (c = a; b > c && n > c; c++) j[c] && (C[c] = p(c));
            }
            function z() {
              B.val(C.join(""));
            }
            function A(a) {
              var b,
                c,
                d,
                e = B.val(),
                f = -1;
              for (b = 0, d = 0; n > b; b++)
                if (j[b]) {
                  for (C[b] = p(b); d++ < e.length; )
                    if (((c = e.charAt(d - 1)), j[b].test(c))) {
                      (C[b] = c), (f = b);
                      break;
                    }
                  if (d > e.length) {
                    y(b + 1, n);
                    break;
                  }
                } else C[b] === e.charAt(d) && d++, k > b && (f = b);
              return (
                a
                  ? z()
                  : k > f + 1
                  ? g.autoclear || C.join("") === D
                    ? (B.val() && B.val(""), y(0, n))
                    : z()
                  : (z(), B.val(B.val().substring(0, f + 1))),
                k ? b : l
              );
            }
            var B = a(this),
              C = a.map(c.split(""), function (a, b) {
                return "?" != a ? (i[a] ? p(b) : a) : void 0;
              }),
              D = C.join(""),
              E = B.val();
            B.data(a.mask.dataName, function () {
              return a
                .map(C, function (a, b) {
                  return j[b] && a != p(b) ? a : null;
                })
                .join("");
            }),
              B.one("unmask", function () {
                B.off(".mask").removeData(a.mask.dataName);
              })
                .on("focus.mask", function () {
                  if (!B.prop("readonly")) {
                    clearTimeout(b);
                    var a;
                    (E = B.val()),
                      (a = A()),
                      (b = setTimeout(function () {
                        z(),
                          a == c.replace("?", "").length
                            ? B.caret(0, a)
                            : B.caret(a);
                      }, 10));
                  }
                })
                .on("blur.mask", v)
                .on("keydown.mask", w)
                .on("keypress.mask", x)
                .on("input.mask paste.mask", function () {
                  B.prop("readonly") ||
                    setTimeout(function () {
                      var a = A(!0);
                      B.caret(a), h();
                    }, 0);
                }),
              e && f && B.off("input.mask").on("input.mask", u),
              A();
          })
        );
      },
    });
});
