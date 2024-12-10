import React from 'react'; 
import { TouchableOpacity, StyleSheet } from 'react-native'; 
import Svg, { Circle, Mask, Rect, G, Line } from 'react-native-svg'; 
const ThemeToggleButton: React.FC<{ isDarkTheme: boolean; toggleTheme: () => void }> = ({ 
isDarkTheme, 
toggleTheme, 
}) => { 
return ( 
<TouchableOpacity 
style={styles.themeToggle} 
onPress={toggleTheme} 
accessible 
accessibilityLabel="Theme Toggle Button" 
accessibilityHint={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`} 
> 
<Svg 
width="40" 
height="40" 
viewBox="0 0 24 24" 
fill="none" 
> 
{isDarkTheme ? ( 
// Crescent Moon for Dark Theme 
<> 
<Circle cx="12" cy="12" r="9" fill="#FFF" /> 
<Circle cx="15" cy="8" r="6" fill="#121212" /> 
</> 
) : ( 
// Sun for Light Theme 
<> 
<Circle cx="12" cy="12" r="5" fill="#FFD700" /> 
<G stroke="#FFD700" strokeWidth="1.5"> 
<Line x1="12" y1="1" x2="12" y2="4" /> 
<Line x1="12" y1="20" x2="12" y2="23" /> 
<Line x1="1" y1="12" x2="4" y2="12" /> 
<Line x1="20" y1="12" x2="23" y2="12" /> 
<Line x1="4.2" y1="4.2" x2="6.5" y2="6.5" /> 
<Line x1="17.5" y1="17.5" x2="19.8" y2="19.8" /> 
<Line x1="4.2" y1="19.8" x2="6.5" y2="17.5" /> 
<Line x1="17.5" y1="6.5" x2="19.8" y2="4.2" /> 
</G> 
</> 
)} 
</Svg> 
</TouchableOpacity> 
); 
}; 
const styles = StyleSheet.create({ 
themeToggle: { 
padding: 10, 
}, 
}); 
export default ThemeToggleButton; 

