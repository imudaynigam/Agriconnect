export const filterSchemes = (schemes, selectedCategory, searchTerm) => {
    let filtered = schemes;
  
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }
  
    if (searchTerm) {
      filtered = filtered.filter(scheme => 
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.eligibility.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    return filtered;
  };
  
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  export const isDeadlineApproaching = (deadline, daysThreshold = 30) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= daysThreshold && diffDays >= 0;
  };
  
  export const sortSchemesByDeadline = (schemes) => {
    return schemes.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  };