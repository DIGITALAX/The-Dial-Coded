const fileLimitAlert = (file: File): boolean => {
  if (file.size > 1048576) {
    alert("Maximum File Size of 1MB, Try Reducing It");
    return true;
  } else {
    return false;
  }
};

export default fileLimitAlert;
