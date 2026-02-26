document.addEventListener('DOMContentLoaded', function() {
  console.log('Script loaded'); // Debug line

  // Activity select toggle for "Others" field
  const select = document.getElementById('activity-select');
  const otherBlock = document.getElementById('other-block');
  const otherInput = document.getElementById('activity-other');
  
  function toggleOtherField() {
    if (!select) return;
    if (select.value === 'Others') {
      otherBlock.style.display = 'block';
      otherInput.required = true;
      otherInput.focus();
    } else {
      otherBlock.style.display = 'none';
      otherInput.required = false;
      otherInput.value = '';
    }
  }
  
  if (select) {
    select.addEventListener('change', toggleOtherField);
    toggleOtherField();
  } else {
    console.log('Elements not found!'); // Debug line
  }
  
  // Auto-hide flash messages after 5 seconds
  const flashMessages = document.querySelector('.flash');
  if (flashMessages) {
    setTimeout(() => {
      flashMessages.style.opacity = '0';
      flashMessages.style.transform = 'translateY(-10px)';
      flashMessages.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        flashMessages.remove();
      }, 300);
    }, 5000);
  }
  
  // Show/hide "Other Activity" field based on selection
  const activitySelect = document.getElementById('activity');
  const otherActivityField = document.getElementById('otherActivityField');
  const otherActivityInput = document.getElementById('activity_other');

  console.log('Activity select:', activitySelect); // Debug line
  console.log('Other field:', otherActivityField); // Debug line

  if (activitySelect && otherActivityField) {
    activitySelect.addEventListener('change', function() {
      console.log('Selected value:', this.value); // Debug line
      
      if (this.value === 'Others') {
        otherActivityField.style.display = 'block';
        otherActivityInput.setAttribute('required', 'required');
        // Add animation
        otherActivityField.style.opacity = '0';
        otherActivityField.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          otherActivityField.style.transition = 'all 0.3s ease';
          otherActivityField.style.opacity = '1';
          otherActivityField.style.transform = 'translateY(0)';
        }, 10);
      } else {
        otherActivityField.style.display = 'none';
        otherActivityInput.removeAttribute('required');
        otherActivityInput.value = '';
      }
    });
  } else {
    console.log('Elements not found!'); // Debug line
  }

  // Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          
          // Reset border color on input
          input.addEventListener('input', function() {
            this.style.borderColor = '#e2e8f0';
          }, { once: true });
        }
      });

      // Special validation for "Others" field
      if (activitySelect && activitySelect.value === 'Others') {
        if (!otherActivityInput.value.trim()) {
          isValid = false;
          otherActivityInput.style.borderColor = '#ef4444';
          alert('Please specify the activity when selecting "Others"');
        }
      }

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.classList.add('error');
        } else {
          this.classList.remove('error');
        }
      });
      
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('error');
        }
      });
    });
  });
  
  // Character counter for textareas
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    const counter = document.createElement('div');
    counter.style.cssText = 'font-size: 0.85rem; color: #64748b; margin-top: -16px; margin-bottom: 12px;';
    counter.textContent = `${textarea.value.length} characters`;
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);

    textarea.addEventListener('input', function() {
      counter.textContent = `${this.value.length} characters`;
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation to entry cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.entry-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
  });

  // Date formatting
  const dates = document.querySelectorAll('.entry-date');
  dates.forEach(dateElement => {
    const dateText = dateElement.textContent.trim();
    try {
      const date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        dateElement.textContent = date.toLocaleDateString('en-US', options);
      }
    } catch (e) {
      // Keep original text if parsing fails
    }
  });

  // Add loading state to buttons on form submit
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Submitting...';
        button.style.opacity = '0.7';
      }
    });
  });

  // Add "Back to top" button
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: none;
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  backToTop.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });

  backToTop.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });

  // Advanced Filter and Search Functionality
  const searchInput = document.getElementById('searchInput');
  const activityFilter = document.getElementById('activityFilter');
  const deptFilter = document.getElementById('deptFilter');
  const dateFilter = document.getElementById('dateFilter');
  const yearFilter = document.getElementById('yearFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const entriesTable = document.getElementById('entriesTable');

  if (searchInput && entriesTable) {
    const tbody = entriesTable.querySelector('tbody');
    const rows = tbody ? Array.from(tbody.querySelectorAll('tr')).filter(row => !row.classList.contains('no-data-row')) : [];
    const totalCount = document.getElementById('totalCount');
    const visibleCount = document.getElementById('visibleCount');

    // Set initial counts
    if (totalCount) totalCount.textContent = rows.length;
    if (visibleCount) visibleCount.textContent = rows.length;

    // Populate year/department filter dynamically
    if (yearFilter) {
      const years = new Set();
      rows.forEach(row => {
        const yearCell = row.cells[2]; // Year/Dept column
        if (yearCell) {
          const yearText = yearCell.textContent.trim();
          if (yearText) years.add(yearText);
        }
      });
      years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });
    }

    // Main filter function
    function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const selectedActivity = activityFilter ? activityFilter.value.toLowerCase() : '';
      const selectedDept = deptFilter ? deptFilter.value.toLowerCase() : '';
      const selectedDate = dateFilter ? dateFilter.value : '';
      let visible = 0;

      rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase() || '';
        const studentId = row.cells[1]?.textContent.toLowerCase() || '';
        const year = row.cells[2]?.textContent.toLowerCase() || '';
        const dept = row.cells[3]?.textContent.toLowerCase() || '';
        const activity = row.cells[4]?.textContent.toLowerCase() || '';
        const activityOther = row.cells[5]?.textContent.toLowerCase() || '';
        const timestamp = row.cells[7]?.textContent.toLowerCase() || '';

        // Search filter (searches across all columns)
        const matchesSearch = !searchTerm || 
          name.includes(searchTerm) ||
          studentId.includes(searchTerm) ||
          year.includes(searchTerm) ||
          dept.includes(searchTerm) ||
          activity.includes(searchTerm) ||
          activityOther.includes(searchTerm) ||
          timestamp.includes(searchTerm);

        // Activity filter
        const matchesActivity = !selectedActivity || activity.includes(selectedActivity);

        // Department filter
        const matchesDept = !selectedDept || dept.includes(selectedDept);

        // Date filter
        let matchesDate = true;
        if (selectedDate && timestamp) {
          try {
            const entryDate = new Date(timestamp);
            const filterDate = new Date(selectedDate);
            matchesDate = entryDate.toDateString() === filterDate.toDateString();
          } catch (e) {
            matchesDate = true;
          }
        }

        // Show/hide row based on all filters
        if (matchesSearch && matchesActivity && matchesDept && matchesDate) {
          row.classList.remove('hidden');
          row.style.display = '';
          visible++;
          
          // Highlight matching text
          if (searchTerm) {
            row.classList.add('highlight');
            setTimeout(() => row.classList.remove('highlight'), 2000);
          }
        } else {
          row.classList.add('hidden');
          row.style.display = 'none';
        }
      });

      // Update visible count
      if (visibleCount) visibleCount.textContent = visible;

      // Show "no results" message
      showNoResults(visible === 0 && rows.length > 0);
    }

    // Show/hide no results message
    function showNoResults(show) {
      let noResultsRow = tbody.querySelector('.no-results-row');
      
      if (show && !noResultsRow) {
        noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-results-row';
        const td = document.createElement('td');
        td.colSpan = 8;
        td.className = 'no-results';
        td.innerHTML = `
          <div class="no-results-icon">🔍</div>
          <div>No entries found matching your filters</div>
          <div style="margin-top: 8px; font-size: 0.9rem;">Try adjusting your search or filters</div>
        `;
        noResultsRow.appendChild(td);
        tbody.appendChild(noResultsRow);
      } else if (!show && noResultsRow) {
        noResultsRow.remove();
      }
    }

    // Debounce function for search input
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Event listeners
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    if (activityFilter) {
      activityFilter.addEventListener('change', applyFilters);
    }
    
    if (deptFilter) {
      deptFilter.addEventListener('change', applyFilters);
    }
    
    if (dateFilter) {
      dateFilter.addEventListener('change', applyFilters);
    }

    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        searchInput.value = '';
        if (activityFilter) activityFilter.value = '';
        if (deptFilter) deptFilter.value = '';
        if (dateFilter) dateFilter.value = '';
        applyFilters();
      });
    }

    // Export to CSV functionality
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📥 Export to CSV';
    exportBtn.className = 'btn-secondary';
    
    if (clearFiltersBtn && clearFiltersBtn.parentNode) {
      clearFiltersBtn.parentNode.appendChild(exportBtn);
    }

    exportBtn.addEventListener('click', function() {
      const visibleRows = rows.filter(row => !row.classList.contains('hidden'));
      let csv = 'Name,Student ID,Year/Dept,Dept/Office,Activity,Activity (Other),Time In,Timestamp\n';
      
      visibleRows.forEach(row => {
        const cells = Array.from(row.cells).map(cell => 
          `"${cell.textContent.trim()}"`
        );
        csv += cells.join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logbook-entries-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
});