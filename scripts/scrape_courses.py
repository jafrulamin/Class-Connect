import requests
from bs4 import BeautifulSoup
import json
import time
import re
from typing import List, Dict

def scrape_courses_to_json():
    """
    Scrapes CUNY course data from the global search and saves to JSON.
    """
    courses = []
    
    # CUNY college codes and names
    colleges = {
        'BAR01': 'Baruch College',
        'BMC01': 'Brooklyn College',
        'BCC01': 'Bronx Community College',
        'CTY01': 'City College',
        'CSI01': 'College of Staten Island',
        'HOS01': 'Hostos Community College',
        'HTR01': 'Hunter College',
        'JJC01': 'John Jay College',
        'KCC01': 'Kingsborough Community College',
        'LAG01': 'LaGuardia Community College',
        'LEH01': 'Lehman College',
        'MEC01': 'Medgar Evers College',
        'NCC01': 'Queensborough Community College',
        'NYC01': 'New York City College of Technology',
        'QCC01': 'Queens College',
        'QNS01': 'Queensborough Community College',
        'YRC01': 'York College'
    }
    
    # Common subjects to scrape
    subjects = ['CSC', 'MATH', 'ENG', 'HIST', 'BIO', 'CHEM', 'PHY', 'PSY', 'SOC', 'ECO']
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print("Starting course scraping...")
    print(f"Colleges: {len(colleges)}")
    print(f"Subjects: {len(subjects)}")
    print(f"Total combinations: {len(colleges) * len(subjects)}")
    print("-" * 50)
    
    for college_code, college_name in colleges.items():
        print(f"\nScraping {college_name} ({college_code})...")
        
        for subject in subjects:
            try:
                url = f"https://globalsearch.cuny.edu/search?college={college_code}&subject={subject}"
                print(f"  Fetching: {subject}...", end=" ")
                
                response = requests.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Parse course data from the page
                # Note: This is a template - you'll need to inspect the actual HTML structure
                # and adjust the selectors accordingly
                course_elements = soup.find_all(['div', 'tr', 'li'], class_=re.compile(r'course|class', re.I))
                
                if not course_elements:
                    # Try alternative selectors
                    course_elements = soup.find_all('div', {'data-course': True}) or \
                                     soup.find_all('tr', {'data-course': True}) or \
                                     soup.select('.course-item, .course-row, .course-list-item')
                
                courses_found = 0
                for element in course_elements:
                    try:
                        # Extract course information
                        # Adjust these selectors based on actual page structure
                        course_code_elem = element.find(['span', 'td', 'div'], class_=re.compile(r'code|course-code', re.I))
                        course_name_elem = element.find(['span', 'td', 'div'], class_=re.compile(r'name|title|course-name', re.I))
                        credits_elem = element.find(['span', 'td', 'div'], class_=re.compile(r'credit|credits|hours', re.I))
                        
                        if course_code_elem and course_name_elem:
                            course_code = course_code_elem.get_text(strip=True)
                            course_name = course_name_elem.get_text(strip=True)
                            
                            # Extract credits (default to 3 if not found)
                            credits = 3
                            if credits_elem:
                                credits_text = credits_elem.get_text(strip=True)
                                credits_match = re.search(r'(\d+)', credits_text)
                                if credits_match:
                                    credits = int(credits_match.group(1))
                            
                            # Create course object
                            course_data = {
                                "course_code": course_code,
                                "course_name": course_name,
                                "college": college_name,
                                "credits": credits
                            }
                            
                            # Avoid duplicates
                            if course_data not in courses:
                                courses.append(course_data)
                                courses_found += 1
                    except Exception as e:
                        continue
                
                if courses_found > 0:
                    print(f"✓ Found {courses_found} courses")
                else:
                    print("✗ No courses found (may need to adjust selectors)")
                
                # Be respectful - add delay between requests
                time.sleep(1)
                
            except requests.exceptions.RequestException as e:
                print(f"✗ Error fetching {subject}: {str(e)}")
                continue
            except Exception as e:
                print(f"✗ Error parsing {subject}: {str(e)}")
                continue
    
    # Save to JSON file
    output_file = 'cuny_courses.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(courses, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print(f"Scraping complete!")
    print(f"Total courses scraped: {len(courses)}")
    print(f"Saved to: {output_file}")
    print("=" * 50)
    
    return courses

if __name__ == "__main__":
    scrape_courses_to_json()

