from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import json
import re

def scrape_hunter_courses():
    """Extract Hunter College courses without credits field"""
    driver = webdriver.Chrome()
    
    try:
        # Navigate to results
        driver.get("https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController")
        time.sleep(2)
        
        # Select Hunter College instead of Baruch
        hunter_checkbox = driver.find_element(By.CSS_SELECTOR, "input[value='HTR01']")
        driver.execute_script("arguments[0].click();", hunter_checkbox)
        print("✅ Selected Hunter College")
        
        term_select = Select(driver.find_element(By.NAME, "term_value"))
        term_select.select_by_value("1259")  # 2025 Fall Term
        print("✅ Selected 2025 Fall Term")
        
        next_btn = driver.find_element(By.NAME, "next_btn")
        next_btn.click()
        time.sleep(2)
        
        ug_select = Select(driver.find_element(By.NAME, "courseCareer"))
        ug_select.select_by_value("UGRD")
        print("✅ Selected Undergraduate")
        
        search_btn = driver.find_element(By.NAME, "search_btn_search")
        search_btn.click()
        print("✅ Clicked Search")
        time.sleep(5)
        
        # Click ALL expand buttons quickly first
        print("Quickly expanding all...")
        expand_buttons = driver.find_elements(By.CSS_SELECTOR, "a[id^='imageDivLink']")
        print(f"Found {len(expand_buttons)} expand buttons")
        
        for i, btn in enumerate(expand_buttons):
            try:
                driver.execute_script("arguments[0].click();", btn)
                if (i + 1) % 50 == 0:  # Print progress every 50 buttons
                    print(f"Clicked {i + 1}/{len(expand_buttons)} expand buttons...")
            except:
                continue
        time.sleep(3)
        
        # Get ALL visible text
        print("Extracting all visible text...")
        all_text = driver.find_element(By.TAG_NAME, "body").text
        
        # Extract courses using multiple patterns
        courses = []
        
        # Pattern for "ABC 1234 - Course Name"
        pattern1 = r'([A-Z]{2,4})\s+(\d{3,4}[A-Z]?)\s*-\s*([^\n\r]+)'
        matches1 = re.findall(pattern1, all_text)
        
        # Pattern for courses that might have extra text
        pattern2 = r'([A-Z]{2,4}\s+\d{3,4}[A-Z]?)\s*-\s*([^\n\r]+)'
        matches2 = re.findall(pattern2, all_text)
        
        print(f"Found {len(matches1)} matches with pattern1")
        print(f"Found {len(matches2)} matches with pattern2")
        
        # Process matches
        all_matches = matches1 + matches2
        for match in all_matches:
            if len(match) == 3:
                dept, number, course_name = match
                course_code = f"{dept} {number}"
            else:
                course_code, course_name = match
                
            course_data = {
                "course_code": course_code.strip(),
                "course_name": course_name.strip(),
                "instructor": "Extract Separately",
                "college": "Hunter College"  
            }
            
            # Avoid duplicates
            if not any(c['course_code'] == course_data['course_code'] and 
                      c['course_name'] == course_data['course_name'] 
                      for c in courses):
                courses.append(course_data)
        
        print(f"🎉 Found {len(courses)} unique courses in text")
        
        # Save results
        if courses:
            with open('hunter_courses_no_credits.json', 'w', encoding='utf-8') as f:
                json.dump(courses, f, indent=2, ensure_ascii=False)
            print(f"💾 Saved to hunter_courses_no_credits.json")
            
            # Show sample
            print("\nSample Hunter College courses:")
            for course in courses[:10]:
                print(f"  {course['course_code']} - {course['course_name']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        driver.quit()

# Run the script for Hunter College
scrape_hunter_courses()