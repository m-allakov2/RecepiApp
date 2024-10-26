import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat, Users, Utensils, Clock } from 'lucide-react';
import { initializeGemini, generateRecipe } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState({
    ingredients: '',
    mealType: '',
    peopleCount: '',
    cookingMethod: '',
  });
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Hata',
        description: 'API anahtarı boş olamaz',
        variant: 'destructive',
      });
      return;
    }

    try {
      const success = initializeGemini(apiKey);
      if (success) {
        toast({
          title: 'Başarılı',
          description: 'API anahtarı kaydedildi',
        });
      } else {
        throw new Error('API başlatılamadı');
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'API anahtarı geçersiz',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateRecipe = async () => {
    if (!apiKey) {
      toast({
        title: 'Hata',
        description: 'Lütfen önce API anahtarını girin',
        variant: 'destructive',
      });
      return;
    }

    const { ingredients, mealType, peopleCount, cookingMethod } = formData;
    if (!ingredients || !mealType || !peopleCount || !cookingMethod) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateRecipe(
        ingredients,
        mealType,
        peopleCount,
        cookingMethod
      );
      setRecipe(result);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Tarif oluşturulurken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <ChefHat className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-center mb-2">Akıllı Tarif Asistanı</h1>
          <p className="text-muted-foreground text-center">
            Malzemelerinizi girin, size özel tarif oluşturalım
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>API Ayarları</CardTitle>
                <CardDescription>
                  Gemini API anahtarınızı girin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Anahtarı</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="API anahtarınızı girin"
                    />
                  </div>
                  <Button 
                    onClick={handleApiKeySubmit}
                    className="w-full"
                  >
                    API Anahtarını Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tarif Bilgileri</CardTitle>
                <CardDescription>
                  Tarif detaylarını girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Malzemeler</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="Malzemeleri virgülle ayırarak yazın"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealType">Öğün Tipi</Label>
                  <Select
                    value={formData.mealType}
                    onValueChange={(value) => setFormData({ ...formData, mealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Öğün seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kahvaltı">Kahvaltı</SelectItem>
                      <SelectItem value="öğle">Öğle Yemeği</SelectItem>
                      <SelectItem value="akşam">Akşam Yemeği</SelectItem>
                      <SelectItem value="atıştırmalık">Atıştırmalık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peopleCount">Kişi Sayısı</Label>
                  <Input
                    id="peopleCount"
                    type="number"
                    min="1"
                    placeholder="Kaç kişilik?"
                    value={formData.peopleCount}
                    onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookingMethod">Pişirme Yöntemi</Label>
                  <Select
                    value={formData.cookingMethod}
                    onValueChange={(value) => setFormData({ ...formData, cookingMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yöntem seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocak">Ocak</SelectItem>
                      <SelectItem value="fırın">Fırın</SelectItem>
                      <SelectItem value="ızgara">Izgara</SelectItem>
                      <SelectItem value="düdüklü">Düdüklü Tencere</SelectItem>
                      <SelectItem value="pişirme yok">Pişirme Gerektirmeyen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateRecipe} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Tarifiniz</CardTitle>
              <CardDescription>
                Oluşturulan tarif burada görünecek
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {recipe ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span>{formData.peopleCount} Kişilik</span>
                      <Utensils className="w-5 h-5 text-muted-foreground" />
                      <span>{formData.cookingMethod}</span>
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>{formData.mealType}</span>
                    </div>
                    <Separator />
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line">{recipe}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tarif oluşturmak için formu doldurun
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;