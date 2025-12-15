// XML Config Editor
class ConfigEditor {
    constructor() {
        this.configData = null;
        this.templateData = null;
        this.editedFields = new Set();
        this.init();
    }

    init() {
        // Detect Edge browser and show warning
        const isEdge = /Edg/i.test(navigator.userAgent);
        if (isEdge) {
            const container = document.getElementById('editorContainer');
            container.innerHTML = '<div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 5px; margin: 10px 0;"><strong>⚠️ Microsoft Edge Compatibility Issue</strong><p>This tool has known issues with Microsoft Edge. Please use <strong>Google Chrome</strong>, Firefox, or another Chromium-based browser for the best experience.</p></div>' + container.innerHTML;
        }
        
        document.getElementById('configFile').addEventListener('change', (e) => this.loadConfigFile(e));
        document.getElementById('templateFile').addEventListener('change', (e) => this.loadTemplateFile(e));
        document.getElementById('applyTemplateBtn').addEventListener('click', () => this.applyTemplate());
        document.getElementById('resetAllBtn').addEventListener('click', () => this.resetAllToTemplate());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadConfig());
    }

    loadConfigFile(event) {
        console.log('loadConfigFile called');
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        const container = document.getElementById('editorContainer');
        container.innerHTML = '<p class="loading">Loading file...</p>';

        const reader = new FileReader();

        reader.onload = (e) => {
            console.log('FileReader onload fired');
            const text = e.target.result;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            console.log('XML parsed');
            if (xmlDoc.querySelector('parsererror')) {
                alert('Error parsing XML file. Please check the file format.');
                return;
            }

            this.configData = xmlDoc;
            this.editedFields.clear();
            console.log('Config data set, rendering editor');
            document.getElementById('downloadBtn').disabled = false;
            this.updateTemplateButtons();
            this.renderEditor();
        };

        reader.onerror = () => {
            console.log('FileReader error');
            alert('Error reading file');
        };

        reader.readAsText(file);
    }

    async loadTemplateFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            
            if (xmlDoc.querySelector('parsererror')) {
                alert('Error parsing template XML file. Please check the file format.');
                return;
            }

            this.templateData = xmlDoc;
            this.updateTemplateButtons();
        } catch (error) {
            alert('Error loading template file: ' + error.message);
        }
    }

    updateTemplateButtons() {
        const hasConfig = this.configData !== null;
        const hasTemplate = this.templateData !== null;
        document.getElementById('applyTemplateBtn').disabled = !(hasConfig && hasTemplate);
        document.getElementById('resetAllBtn').disabled = !(hasConfig && hasTemplate);
    }

    renderEditor() {
        const container = document.getElementById('editorContainer');
        const tabContainer = document.getElementById('tabContainer');
        const tabButtons = document.getElementById('tabButtons');
        
        container.innerHTML = '<p class="loading">Rendering configuration...</p>';

        setTimeout(() => {
            try {
                const elements = this.configData.querySelectorAll('DATA > Element');
                
                if (elements.length === 0) {
                    container.innerHTML = '<p class="placeholder">No configuration elements found in XML file.</p>';
                    return;
                }
                
                // Clear containers
                container.innerHTML = '';
                tabButtons.innerHTML = '';
                
                // Create tabs and content for each element
                const tabTitles = {
                    'weight:config': 'Weight',
                    'm1:config': 'M1 Belt',
                    'm2:config': 'M2 Belt',
                    'm3:config': 'M3 Belt',
                    'm4:config': 'M4 Belt',
                    'main:config': 'Main',
                    'feeder:config': 'Feeder'
                };
                // Move Main tab to the leftmost position
                const sortedElements = [];
                let mainIndex = -1;
                elements.forEach((el, idx) => {
                    if (el.getAttribute('Name') === 'main:config') {
                        mainIndex = idx;
                    }
                });
                if (mainIndex !== -1) {
                    sortedElements.push(elements[mainIndex]);
                }
                elements.forEach((el, idx) => {
                    if (idx !== mainIndex) {
                        sortedElements.push(el);
                    }
                });
                sortedElements.forEach((element, index) => {
                    const elementName = element.getAttribute('Name');
                    const tabTitle = tabTitles[elementName] || elementName;
                    // Create tab button
                    const tabBtn = document.createElement('button');
                    tabBtn.className = 'tab-button' + (index === 0 ? ' active' : '');
                    tabBtn.textContent = tabTitle;
                    tabBtn.dataset.tabIndex = index;
                    tabBtn.addEventListener('click', () => this.switchTab(index));
                    tabButtons.appendChild(tabBtn);
                    // Create tab content
                    const tabContent = document.createElement('div');
                    tabContent.className = 'tab-content' + (index === 0 ? ' active' : '');
                    tabContent.dataset.tabIndex = index;
                    const elementDiv = this.createElementSection(element);
                    tabContent.appendChild(elementDiv);
                    container.appendChild(tabContent);
                });
                
                // Show tab container
                tabContainer.style.display = 'block';
            } catch (err) {
                container.innerHTML = '<p class="placeholder">Error: ' + err.message + '</p>';
            }
        }, 0);
    }
    
    switchTab(index) {
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    createElementSection(element) {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element-section';

        const elementName = element.getAttribute('Name');
        const header = document.createElement('h2');
        header.textContent = elementName;
        elementDiv.appendChild(header);

        const groups = element.querySelectorAll(':scope > Group');
        groups.forEach(group => {
            const groupDiv = this.createGroupSection(group, elementName);
            elementDiv.appendChild(groupDiv);
        });

        return elementDiv;
    }

    createGroupSection(group, elementPath) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-section';

        const groupId = group.getAttribute('ID');
        if (!groupId) return groupDiv;
        const fullPath = `${elementPath}/${groupId}`;

        // Collapsible header
        const header = document.createElement('h3');
        header.className = 'collapsible-header';
        header.textContent = groupId;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'collapse-toggle';
        toggleBtn.textContent = '▼';
        toggleBtn.setAttribute('aria-label', 'Toggle group');
        toggleBtn.style.marginLeft = '10px';
        header.appendChild(toggleBtn);
        groupDiv.appendChild(header);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'group-content';

        // Handle nested groups
        const nestedGroups = group.querySelectorAll(':scope > Group');
        nestedGroups.forEach(nestedGroup => {
            const nestedDiv = this.createGroupSection(nestedGroup, fullPath);
            contentDiv.appendChild(nestedDiv);
        });

        // Handle properties
        const properties = group.querySelectorAll(':scope > Property');
        properties.forEach(property => {
            const propertyDiv = this.createPropertyField(property, fullPath);
            contentDiv.appendChild(propertyDiv);
        });

        groupDiv.appendChild(contentDiv);

        // Collapse/expand logic
        toggleBtn.addEventListener('click', () => {
            if (contentDiv.style.display === 'none') {
                contentDiv.style.display = '';
                toggleBtn.textContent = '▼';
            } else {
                contentDiv.style.display = 'none';
                toggleBtn.textContent = '►';
            }
        });

        return groupDiv;
    }

    createPropertyField(property, path) {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'property-field';

        const id = property.getAttribute('ID');
        const dataType = property.getAttribute('DataType');
        const value = property.getAttribute('Value') || '';
        
        if (!id || !dataType) return propertyDiv;
        
        const fieldKey = `${path}/${id}`;

        const label = document.createElement('label');
        label.textContent = this.formatParameterName(id); // Only for display
        label.title = `DataType: ${dataType}`;

        let input;
        if (dataType === 'BOOL') {
            input = document.createElement('select');
            const trueOption = document.createElement('option');
            trueOption.value = 'true';
            trueOption.textContent = 'true';
            const falseOption = document.createElement('option');
            falseOption.value = 'false';
            falseOption.textContent = 'false';
            input.appendChild(trueOption);
            input.appendChild(falseOption);
            input.value = value;
        } else if (id === 'selectedLanguage') {
            input = document.createElement('select');
            const languages = [
                { value: 'en', label: 'English' },
                { value: 'de', label: 'Deutsch' }
                // Add more languages here as needed
            ];
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.value;
                option.textContent = lang.label;
                input.appendChild(option);
            });
            input.value = value;
        } else if (id === 'feedModeDefault') {
            input = document.createElement('select');
            const modes = [
                { value: '0', label: 'Distance based' },
                { value: '1', label: 'Time based' }
            ];
            modes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode.value;
                option.textContent = mode.label;
                input.appendChild(option);
            });
            input.value = value;
        } else if (id === 'machineType') {
            input = document.createElement('select');
            const types = [
                { value: '0', label: 'Left' },
                { value: '1', label: 'Right' }
            ];
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.value;
                option.textContent = type.label;
                input.appendChild(option);
            });
            input.value = value;
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = value;
        }

        input.dataset.fieldKey = fieldKey;
        input.dataset.dataType = dataType;
        
        input.addEventListener('change', () => {
            this.editedFields.add(fieldKey);
            property.setAttribute('Value', input.value);
        });

        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = '↺';
        resetBtn.title = 'Reset to template';
        resetBtn.disabled = !this.templateData;
        resetBtn.addEventListener('click', () => this.resetFieldToTemplate(fieldKey, property, input));

        const typeSpan = document.createElement('span');
        typeSpan.className = 'data-type';
        typeSpan.textContent = dataType;

        propertyDiv.appendChild(label);
        let unit = '';
        if (dataType === 'TIME') {
            unit = 'ms';
        } else if (/speed/i.test(id)) {
            unit = 'mm/s';
        } else if (/acceleration|deceleration/i.test(id)) {
            unit = 'mm/s²';
        }
        if (unit) {
            const inputWrap = document.createElement('div');
            inputWrap.className = 'input-with-unit';
            inputWrap.appendChild(input);
            const unitSpan = document.createElement('span');
            unitSpan.className = 'unit-label';
            unitSpan.textContent = unit;
            inputWrap.appendChild(unitSpan);
            propertyDiv.appendChild(inputWrap);
        } else {
            propertyDiv.appendChild(input);
        }
        propertyDiv.appendChild(typeSpan);
        propertyDiv.appendChild(resetBtn);

        return propertyDiv;
    }

    formatParameterName(name) {
        if (!name) return '';
        if (name === 'use2ndWeightControl') return 'Use 2nd weight control';
        let formatted = name.replace(/_/g, ' ');
        formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
        formatted = formatted.replace(/\b\w/g, c => c.toUpperCase());
        return formatted;
    }

    resetFieldToTemplate(fieldKey, property, input) {
        if (!this.templateData) return;

        const templateValue = this.findTemplateValue(fieldKey);
        if (templateValue !== null) {
            property.setAttribute('Value', templateValue);
            input.value = templateValue;
            this.editedFields.delete(fieldKey);
        }
    }

    findTemplateValue(fieldKey) {
        const parts = fieldKey.split('/');
        let current = this.templateData;

        // Navigate to the property in template
        for (let i = 0; i < parts.length; i++) {
            if (i === 0) {
                // Find element
                current = current.querySelector(`Element[Name="${parts[i]}"]`);
            } else if (i < parts.length - 1) {
                // Find group
                current = current ? current.querySelector(`Group[ID="${parts[i]}"]`) : null;
            } else {
                // Find property
                const prop = current ? current.querySelector(`Property[ID="${parts[i]}"]`) : null;
                return prop ? prop.getAttribute('Value') : null;
            }
            
            if (!current) return null;
        }

        return null;
    }

    applyTemplate() {
        if (!this.templateData || !this.configData) return;

        const properties = this.configData.querySelectorAll('Property');
        properties.forEach(property => {
            const fieldKey = this.getFieldKeyFromProperty(property);
            
            // Only apply template if field hasn't been edited
            if (!this.editedFields.has(fieldKey)) {
                const templateValue = this.findTemplateValue(fieldKey);
                if (templateValue !== null) {
                    property.setAttribute('Value', templateValue);
                }
            }
        });

        this.renderEditor();
    }

    resetAllToTemplate() {
        if (!this.templateData || !this.configData) return;

        if (!confirm('Are you sure you want to reset all fields to template values? This will discard all your edits.')) {
            return;
        }

        const properties = this.configData.querySelectorAll('Property');
        properties.forEach(property => {
            const fieldKey = this.getFieldKeyFromProperty(property);
            const templateValue = this.findTemplateValue(fieldKey);
            if (templateValue !== null) {
                property.setAttribute('Value', templateValue);
            }
        });

        this.editedFields.clear();
        this.renderEditor();
    }

    getFieldKeyFromProperty(property) {
        const id = property.getAttribute('ID');
        let path = id;
        let current = property.parentElement;

        while (current && current.tagName !== 'DATA') {
            if (current.tagName === 'Group') {
                path = current.getAttribute('ID') + '/' + path;
            } else if (current.tagName === 'Element') {
                path = current.getAttribute('Name') + '/' + path;
            }
            current = current.parentElement;
        }

        return path;
    }

    downloadConfig() {
        if (!this.configData) return;

        const serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(this.configData);
        
        // Format XML with proper indentation
        xmlString = this.formatXML(xmlString);

        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.xml';
        a.click();
        URL.revokeObjectURL(url);
    }

    formatXML(xml) {
        const PADDING = '    ';
        const reg = /(>)(<)(\/*)/g;
        let pad = 0;
        
        xml = xml.replace(reg, '$1\r\n$2$3');
        
        return xml.split('\r\n').map((node, index) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/) && pad > 0) {
                pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }
            
            pad += indent;
            
            return PADDING.repeat(pad - indent) + node;
        }).join('\r\n');
    }
}

// Initialize the editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ConfigEditor();
});
